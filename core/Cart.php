<?php
/**
 * AURA STUDIO - VARIANT-AWARE CART ENGINE
 * Handles variant-level cart items, atomic stock validation, and price recalculations.
 */

if (!defined('AURA_APP')) {
    require_once __DIR__ . '/../config/config.php';
}
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Security.php';

class Cart {
    private const CART_KEY = '_aura_cart_items';

    public static function getItems(): array {
        Security::initSession();
        return $_SESSION[self::CART_KEY] ?? [];
    }

    public static function addItem(int $variantId, int $quantity = 1): array {
        Security::initSession();

        if ($quantity <= 0) {
            return ['success' => false, 'message' => 'Quantity must be at least 1.'];
        }

        // Query fresh variant details directly from DB
        $variant = Database::fetchOne(
            "SELECT pv.id as variant_id, pv.product_id, pv.sku, pv.stock_quantity, pv.price_override,
                    p.name as product_name, p.slug as product_slug, p.regular_price, p.sale_price, p.main_image,
                    c.name as color_name, c.hex_code as color_hex,
                    s.code as size_code
             FROM product_variants pv
             JOIN products p ON p.id = pv.product_id
             JOIN colors c ON c.id = pv.color_id
             JOIN sizes s ON s.id = pv.size_id
             WHERE pv.id = :id AND pv.is_active = 1 AND p.is_active = 1
             LIMIT 1",
            [':id' => $variantId]
        );

        if (!$variant) {
            return ['success' => false, 'message' => 'Selected product variation is currently unavailable.'];
        }

        // Look for color-specific primary image if available
        $colorImg = Database::fetchOne(
            "SELECT image_url FROM product_images WHERE product_id = :pid AND color_id = :cid ORDER BY is_primary DESC, sort_order ASC LIMIT 1",
            [':pid' => $variant['product_id'], ':cid' => $variant['color_hex']]
        );
        $displayImage = $colorImg['image_url'] ?? $variant['main_image'];

        // Determine server-side authoritative unit price
        $unitPrice = !empty($variant['price_override']) && (float)$variant['price_override'] > 0
            ? (float)$variant['price_override']
            : (!empty($variant['sale_price']) && (float)$variant['sale_price'] > 0 ? (float)$variant['sale_price'] : (float)$variant['regular_price']);

        $items = self::getItems();
        $key = 'var_' . $variantId;
        $currentQty = isset($items[$key]) ? (int)$items[$key]['quantity'] : 0;
        $newQty = $currentQty + $quantity;

        // Atomic stock validation
        if ($newQty > (int)$variant['stock_quantity']) {
            $available = (int)$variant['stock_quantity'] - $currentQty;
            return [
                'success' => false,
                'message' => $available > 0
                    ? sprintf("Only %d more piece(s) available in stock for %s (%s, %s).", $available, $variant['product_name'], $variant['color_name'], $variant['size_code'])
                    : "This variation is currently out of stock."
            ];
        }

        $items[$key] = [
            'variant_id'   => (int)$variantId,
            'product_id'   => (int)$variant['product_id'],
            'product_name' => $variant['product_name'],
            'product_slug' => $variant['product_slug'],
            'sku'          => $variant['sku'],
            'color_name'   => $variant['color_name'],
            'color_hex'    => $variant['color_hex'],
            'size_code'    => $variant['size_code'],
            'unit_price'   => $unitPrice,
            'quantity'     => $newQty,
            'max_stock'    => (int)$variant['stock_quantity'],
            'image'        => $displayImage
        ];

        $_SESSION[self::CART_KEY] = $items;

        return [
            'success'    => true,
            'message'    => sprintf("%s (%s / %s) added to cart.", $variant['product_name'], $variant['color_name'], $variant['size_code']),
            'cart_count' => self::getCount(),
            'totals'     => self::getTotals()
        ];
    }

    public static function updateQuantity(int $variantId, int $quantity): array {
        Security::initSession();
        $items = self::getItems();
        $key = 'var_' . $variantId;

        if (!isset($items[$key])) {
            return ['success' => false, 'message' => 'Item not found in cart.'];
        }

        if ($quantity <= 0) {
            return self::removeItem($variantId);
        }

        // Revalidate against live database stock
        $v = Database::fetchOne("SELECT stock_quantity FROM product_variants WHERE id = :id AND is_active = 1", [':id' => $variantId]);
        if (!$v) {
            self::removeItem($variantId);
            return ['success' => false, 'message' => 'This variant is no longer available.'];
        }

        if ($quantity > (int)$v['stock_quantity']) {
            return [
                'success' => false,
                'message' => sprintf("Only %d piece(s) available in stock.", (int)$v['stock_quantity'])
            ];
        }

        $items[$key]['quantity'] = $quantity;
        $_SESSION[self::CART_KEY] = $items;

        return [
            'success'    => true,
            'cart_count' => self::getCount(),
            'totals'     => self::getTotals()
        ];
    }

    public static function removeItem(int $variantId): array {
        Security::initSession();
        $items = self::getItems();
        $key = 'var_' . $variantId;
        if (isset($items[$key])) {
            unset($items[$key]);
            $_SESSION[self::CART_KEY] = $items;
        }

        return [
            'success'    => true,
            'message'    => 'Item removed from cart.',
            'cart_count' => self::getCount(),
            'totals'     => self::getTotals()
        ];
    }

    public static function clear(): void {
        Security::initSession();
        unset($_SESSION[self::CART_KEY]);
    }

    public static function getCount(): int {
        $count = 0;
        foreach (self::getItems() as $item) {
            $count += (int)$item['quantity'];
        }
        return $count;
    }

    public static function getTotals(string $destination = 'inside_dhaka'): array {
        $items = self::getItems();
        $subtotal = 0.00;

        foreach ($items as $item) {
            $subtotal += ((float)$item['unit_price'] * (int)$item['quantity']);
        }

        // Shipping calculation rules
        $freeShippingThreshold = 1999.00;
        $insideDhakaCharge = 80.00;
        $outsideDhakaCharge = 150.00;

        if ($subtotal >= $freeShippingThreshold || $subtotal == 0) {
            $shipping = 0.00;
        } else {
            $shipping = ($destination === 'outside_dhaka') ? $outsideDhakaCharge : $insideDhakaCharge;
        }

        $discount = 0.00;
        $grandTotal = max(0, $subtotal + $shipping - $discount);

        return [
            'subtotal'        => $subtotal,
            'shipping'        => $shipping,
            'discount'        => $discount,
            'grand_total'     => $grandTotal,
            'is_free_shipping'=> ($subtotal >= $freeShippingThreshold && $subtotal > 0),
            'currency'        => CURRENCY_SYMBOL
        ];
    }
}
