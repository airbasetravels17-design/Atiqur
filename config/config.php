<?php
/**
 * AURA STUDIO - CONFIGURATION FILE
 * Compatible with XAMPP (localhost) and cPanel Shared Hosting
 */

// Prevent direct script access
if (!defined('AURA_APP')) {
    define('AURA_APP', true);
}

// Environment: 'development' or 'production'
// Set to 'production' when deploying to cPanel shared hosting
define('APP_ENV', 'development');
define('APP_DEBUG', true);

// Application Identity
define('APP_NAME', "Women's Fit");
define('APP_TAGLINE', "Elevated Styles For Every You");

// Base URL (Adjust for your domain or local subfolder)
// Local XAMPP example: 'http://localhost/aurastudio'
// cPanel live domain: 'https://yourdomain.com'
if (!defined('BASE_URL')) {
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443)) ? "https://" : "http://";
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    
    // Auto-detect subfolder so /aurastudio works out-of-the-box on localhost XAMPP
    $scriptName = $_SERVER['SCRIPT_NAME'] ?? '';
    $scriptDir = str_replace('\\', '/', dirname($scriptName));
    $basePath = preg_replace('#/(admin|api)$#', '', $scriptDir);
    $basePath = ($basePath !== '/' && $basePath !== '.') ? rtrim($basePath, '/') : '';
    
    define('BASE_URL', $protocol . $host . $basePath);
}

// Database Credentials (Standard MySQL / MariaDB)
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'aura_studio_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Fallback Driver: Set to 'mysql' for standard cPanel/XAMPP.
// Supports 'sqlite' for portable zero-config local environments.
define('DB_DRIVER', extension_loaded('pdo_mysql') ? 'mysql' : 'sqlite');
define('SQLITE_PATH', __DIR__ . '/../database/store.sqlite');

// Currency Settings (Bangladeshi Taka ৳)
define('CURRENCY_SYMBOL', '৳');
define('CURRENCY_CODE', 'BDT');

// Upload & Asset Paths
define('ROOT_PATH', dirname(__DIR__));
define('UPLOAD_DIR', ROOT_PATH . '/uploads');
define('UPLOAD_URL', BASE_URL . '/uploads');
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024); // 5MB

// Session & Security Settings
define('SESSION_LIFETIME', 7200); // 2 hours
define('CSRF_TOKEN_KEY', '_aura_csrf_token');
define('ADMIN_SESSION_KEY', '_aura_admin_auth');
define('SETUP_LOCK_FILE', ROOT_PATH . '/admin/setup.lock');

// Error Reporting according to environment
if (APP_DEBUG) {
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', '0');
    ini_set('display_startup_errors', '0');
    error_reporting(0);
}
