<?php
/**
 * AURA STUDIO - ORDER MODEL
 * Complete transaction-safe order placement with atomic stock reduction.
 */

if (!defined('AURA_APP')) {
    require_once __DIR__ . '/../config/config.php';
}
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/helpers.php';
require_once __DIR__ . '/../core/Cart.php';

class Order {
    public static function createFromCart(array $customerData): array {
        $cartItems = Cart::getItems();
        if (empty($cartItems)) {
            return ['success' => false, 'message' => 'Your shopping bag is empty.'];
        }

        // Validate customer fields
        $name    = trim($customerData['name'] ?? '');
        $phone   = trim($customerData['phone'] ?? '');
        $email   = trim($customerData['email'] ?? '');
        $address = trim($customerData['address'] ?? '');
        $city    = trim($customerData['city'] ?? 'Dhaka');
        $area    = trim($customerData['area'] ?? '');
        $note    = trim($customerData['note'] ?? '');

        if (empty($name) || strlen($name) < 3) {
            return ['success' => false, 'message' => 'Please provide your full recipient name.'];
        }
        if (empty($phone) || strlen($phone) < 8) {
            return ['success' => false, 'message' => 'Please provide a valid contact phone number.'];
        }
        if (empty($address) || strlen($address) < 8) {
            return ['success' => false, 'message' => 'Please enter your complete delivery street address.'];
        }

        // Destination for shipping rate
        $isOutsideDhaka = (stripos($city, 'outside') !== false || (stripos($city, 'dhaka') === false && !empty($city)));
        $destination = $isOutsideDhaka ? 'outside_dhaka' : 'inside_dhaka';

        // Begin DB Transaction
        Database::beginTransaction();

        try {
            $subtotal = 0.00;
            $verifiedItems = [];

            // Step 1: Re-verify all variants, live prices, and current stock atomically
            foreach ($cartItems as $item) {
                $variantId = (int)$item['variant_id'];
                $requestedQty = (int)$item['quantity'];

                // Lock row with FOR UPDATE or fetch current stock
                $v = Database::fetchOne(
                    "SELECT pv.*, p.name as product_name, p.regular_price, p.sale_price, p.is_active as product_active,
                            c.name as color_name, s.code as size_code
                     FROM product_variants pv
                     JOIN products p ON p.id = pv.product_id
                     JOIN colors c ON c.id = pv.color_id
                     JOIN sizes s ON s.id = pv.size_id
                     WHERE pv.id = :id AND pv.is_active = 1 AND p.is_active = 1",
                    [':id' => $variantId]
                );

                if (!$v) {
                    Database::rollBack();
                    return [
                        'success' => false,
                        'message' => sprintf("Item '%s' is no longer available in our catalog.", $item['product_name'])
                    ];
                }

                if ((int)$v['stock_quantity'] < $requestedQty) {
                    Database::rollBack();
                    return [
                        'success' => false,
                        'message' => sprintf("Insufficient stock for %s (%s, %s). Only %d remaining.", $v['product_name'], $v['color_name'], $v['size_code'], (int)$v['stock_quantity'])
                    ];
                }

                $unitPrice = !empty($v['price_override']) && (float)$v['price_override'] > 0
                    ? (float)$v['price_override']
                    : (!empty($v['sale_price']) && (float)$v['sale_price'] > 0 ? (float)$v['sale_price'] : (float)$v['regular_price']);

                $lineTotal = $unitPrice * $requestedQty;
                $subtotal += $lineTotal;

                $verifiedItems[] = [
                    'variant_id'   => $variantId,
                    'product_id'   => (int)$v['product_id'],
                    'product_name' => $v['product_name'],
                    'color_name'   => $v['color_name'],
                    'size_code'    => $v['size_code'],
                    'sku'          => $v['sku'],
                    'unit_price'   => $unitPrice,
                    'quantity'     => $requestedQty,
                    'subtotal'     => $lineTotal
                ];
            }

            // Step 2: Compute shipping & grand total
            $shippingCharge = ($subtotal >= 1999.00) ? 0.00 : ($isOutsideDhaka ? 150.00 : 80.00);
            $discount = 0.00;
            $grandTotal = $subtotal + $shippingCharge - $discount;

            $orderNumber = generate_order_number();

            // Step 3: Insert order record
            $orderId = Database::insert(
                "INSERT INTO orders (
                    order_number, customer_name, customer_phone, customer_email,
                    delivery_address, city, area, customer_note,
                    subtotal, shipping_charge, discount_amount, grand_total,
                    payment_method, payment_status, order_status
                ) VALUES (
                    :num, :cname, :cphone, :cemail,
                    :addr, :city, :area, :note,
                    :sub, :ship, :disc, :total,
                    'Cash on Delivery', 'unpaid', 'Pending'
                )",
                [
                    ':num'   => $orderNumber,
                    ':cname' => $name,
                    ':cphone'=> $phone,
                    ':cemail'=> $email,
                    ':addr'  => $address,
                    ':city'  => $city,
                    ':area'  => $area,
                    ':note'  => $note,
                    ':sub'   => $subtotal,
                    ':ship'  => $shippingCharge,
                    ':disc'  => $discount,
                    ':total' => $grandTotal
                ]
            );

            // Step 4: Insert order items & reduce variant stock atomically
            foreach ($verifiedItems as $item) {
                Database::insert(
                    "INSERT INTO order_items (
                        order_id, product_id, variant_id, product_name,
                        color_name, size_code, sku, unit_price, quantity, subtotal
                    ) VALUES (
                        :oid, :pid, :vid, :pname,
                        :cname, :scode, :sku, :price, :qty, :sub
                    )",
                    [
                        ':oid'   => $orderId,
                        ':pid'   => $item['product_id'],
                        ':vid'   => $item['variant_id'],
                        ':pname' => $item['product_name'],
                        ':cname' => $item['color_name'],
                        ':scode' => $item['size_code'],
                        ':sku'   => $item['sku'],
                        ':price' => $item['unit_price'],
                        ':qty'   => $item['quantity'],
                        ':sub'   => $item['subtotal']
                    ]
                );

                // Atomic stock reduction
                Database::execute(
                    "UPDATE product_variants
                     SET stock_quantity = stock_quantity - :qty
                     WHERE id = :vid AND stock_quantity >= :qty",
                    [
                        ':qty' => $item['quantity'],
                        ':vid' => $item['variant_id']
                    ]
                );
            }

            // Step 5: Record initial status history
            Database::insert(
                "INSERT INTO order_status_history (order_id, status, comment, changed_by)
                 VALUES (:oid, 'Pending', 'Order placed via Cash on Delivery', 'Customer')",
                [':oid' => $orderId]
            );

            // Commit all changes
            Database::commit();

            // Clear session cart
            Cart::clear();

            return [
                'success'      => true,
                'order_number' => $orderNumber,
                'order_id'     => $orderId,
                'grand_total'  => $grandTotal,
                'message'      => 'Order placed successfully!'
            ];
        } catch (Exception $e) {
            Database::rollBack();
            return [
                'success' => false,
                'message' => 'An unexpected error occurred while placing your order. Please try again.'
            ];
        }
    }

    public static function findByNumberAndPhone(string $orderNumber, string $phone): ?array {
        $order = Database::fetchOne(
            "SELECT * FROM orders WHERE order_number = :num AND customer_phone LIKE :phone LIMIT 1",
            [':num' => trim($orderNumber), ':phone' => '%' . trim($phone) . '%']
        );

        if (!$order) {
            return null;
        }

        $order['items'] = Database::fetchAll(
            "SELECT * FROM order_items WHERE order_id = :oid",
            [':oid' => $order['id']]
        );

        $order['history'] = Database::fetchAll(
            "SELECT * FROM order_status_history WHERE order_id = :oid ORDER BY id ASC",
            [':oid' => $order['id']]
        );

        return $order;
    }
}
