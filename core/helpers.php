<?php
/**
 * AURA STUDIO - SYSTEM HELPERS
 * All monetary values use Bangladeshi Taka (৳).
 */

if (!defined('AURA_APP')) {
    require_once __DIR__ . '/../config/config.php';
}
require_once __DIR__ . '/Database.php';

function format_taka(float|int|string|null $amount): string {
    $num = (float)($amount ?? 0);
    // Standard Bangladeshi / Indian grouping or standard comma formatted with ৳
    return CURRENCY_SYMBOL . number_format($num, 0, '.', ',');
}

function format_taka_decimals(float|int|string|null $amount): string {
    $num = (float)($amount ?? 0);
    return CURRENCY_SYMBOL . number_format($num, 2, '.', ',');
}

function generate_order_number(): string {
    // WF-20261003-XXXX format
    return sprintf("WF-%s-%04d", date('Ymd'), random_int(1000, 9999));
}

function get_setting(string $key, ?string $default = null): ?string {
    static $settingsCache = null;
    if ($settingsCache === null) {
        try {
            $rows = Database::fetchAll("SELECT setting_key, setting_value FROM store_settings");
            $settingsCache = [];
            foreach ($rows as $r) {
                $settingsCache[$r['setting_key']] = $r['setting_value'];
            }
        } catch (Exception $e) {
            $settingsCache = [];
        }
    }
    return $settingsCache[$key] ?? $default;
}

function slugify(string $text): string {
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    $text = strtolower($text);
    return empty($text) ? 'item-' . time() : $text;
}

function asset_url(string $path): string {
    return BASE_URL . '/assets/' . ltrim($path, '/');
}

function flash(string $key, string $message, string $type = 'success'): void {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION['_flash'][$key] = [
        'message' => $message,
        'type'    => $type
    ];
}

function get_flash(string $key): ?array {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    if (isset($_SESSION['_flash'][$key])) {
        $val = $_SESSION['_flash'][$key];
        unset($_SESSION['_flash'][$key]);
        return $val;
    }
    return null;
}
