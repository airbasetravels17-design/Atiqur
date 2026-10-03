<?php
/**
 * AURA STUDIO - PRODUCT MODEL
 */

if (!defined('AURA_APP')) {
    require_once __DIR__ . '/../config/config.php';
}
require_once __DIR__ . '/../core/Database.php';

class Product {
    public static function getFeatured(int $limit = 8): array {
        return Database::fetchAll(
            "SELECT p.*, c.name as category_name, c.slug as category_slug
             FROM products p
             JOIN categories c ON c.id = p.category_id
             WHERE p.is_active = 1 AND p.is_featured = 1
             ORDER BY p.id DESC LIMIT :limit",
            [':limit' => $limit]
        );
    }

    public static function getTrending(int $limit = 8): array {
        return Database::fetchAll(
            "SELECT p.*, c.name as category_name, c.slug as category_slug
             FROM products p
             JOIN categories c ON c.id = p.category_id
             WHERE p.is_active = 1 AND p.is_trending = 1
             ORDER BY p.id DESC LIMIT :limit",
            [':limit' => $limit]
        );
    }

    public static function findBySlug(string $slug): ?array {
        $product = Database::fetchOne(
            "SELECT p.*, c.name as category_name, c.slug as category_slug
             FROM products p
             JOIN categories c ON c.id = p.category_id
             WHERE p.slug = :slug AND p.is_active = 1 LIMIT 1",
            [':slug' => $slug]
        );

        if (!$product) {
            return null;
        }

        // Fetch all product images (including color assignments)
        $product['images'] = Database::fetchAll(
            "SELECT pi.*, c.name as color_name, c.hex_code as color_hex
             FROM product_images pi
             LEFT JOIN colors c ON c.id = pi.color_id
             WHERE pi.product_id = :id
             ORDER BY pi.sort_order ASC, pi.id ASC",
            [':id' => $product['id']]
        );

        // Fetch all variants with color, size, and stock
        $product['variants'] = Database::fetchAll(
            "SELECT pv.*, c.name as color_name, c.hex_code as color_hex, s.code as size_code, s.sort_order as size_sort
             FROM product_variants pv
             JOIN colors c ON c.id = pv.color_id
             JOIN sizes s ON s.id = pv.size_id
             WHERE pv.product_id = :id AND pv.is_active = 1
             ORDER BY c.name ASC, s.sort_order ASC",
            [':id' => $product['id']]
        );

        // Group colors and sizes
        $colors = [];
        $sizes = [];
        foreach ($product['variants'] as $v) {
            $colors[$v['color_id']] = [
                'id'       => $v['color_id'],
                'name'     => $v['color_name'],
                'hex_code' => $v['color_hex']
            ];
            $sizes[$v['size_id']] = [
                'id'   => $v['size_id'],
                'code' => $v['size_code']
            ];
        }
        $product['available_colors'] = array_values($colors);
        $product['available_sizes']  = array_values($sizes);

        return $product;
    }

    public static function filter(array $filters = [], int $limit = 20, int $offset = 0): array {
        $where = ["p.is_active = 1"];
        $params = [];

        if (!empty($filters['category'])) {
            $where[] = "c.slug = :cat";
            $params[':cat'] = $filters['category'];
        }

        if (!empty($filters['search'])) {
            $where[] = "(p.name LIKE :search OR p.base_sku LIKE :search OR p.short_description LIKE :search)";
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        if (isset($filters['min_price']) && is_numeric($filters['min_price'])) {
            $where[] = "COALESCE(p.sale_price, p.regular_price) >= :min_price";
            $params[':min_price'] = (float)$filters['min_price'];
        }

        if (isset($filters['max_price']) && is_numeric($filters['max_price'])) {
            $where[] = "COALESCE(p.sale_price, p.regular_price) <= :max_price";
            $params[':max_price'] = (float)$filters['max_price'];
        }

        $orderBy = match ($filters['sort'] ?? 'latest') {
            'price_asc'  => "COALESCE(p.sale_price, p.regular_price) ASC",
            'price_desc' => "COALESCE(p.sale_price, p.regular_price) DESC",
            'popular'    => "p.is_trending DESC, p.id DESC",
            default      => "p.id DESC"
        };

        $whereClause = implode(" AND ", $where);

        $countSql = "SELECT COUNT(DISTINCT p.id) as total FROM products p JOIN categories c ON c.id = p.category_id WHERE $whereClause";
        $total = (int)Database::fetchOne($countSql, $params)['total'];

        $sql = "SELECT p.*, c.name as category_name, c.slug as category_slug
                FROM products p
                JOIN categories c ON c.id = p.category_id
                WHERE $whereClause
                ORDER BY $orderBy
                LIMIT " . (int)$limit . " OFFSET " . (int)$offset;

        $items = Database::fetchAll($sql, $params);

        return [
            'items' => $items,
            'total' => $total,
            'limit' => $limit,
            'page'  => floor($offset / $limit) + 1
        ];
    }
}
