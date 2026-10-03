<?php
/**
 * AURA STUDIO - PDO DATABASE WRAPPER
 * Provides singleton PDO connection, prepared statements, and transactional support.
 */

if (!defined('AURA_APP')) {
    require_once __DIR__ . '/../config/config.php';
}

class Database {
    private static ?PDO $instance = null;

    private function __construct() {}
    private function __clone() {}

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            try {
                if (DB_DRIVER === 'mysql' && extension_loaded('pdo_mysql')) {
                    $dsn = sprintf(
                        "mysql:host=%s;port=%s;dbname=%s;charset=%s",
                        DB_HOST,
                        DB_PORT,
                        DB_NAME,
                        DB_CHARSET
                    );
                    $options = [
                        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES   => false,
                        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
                    ];
                    self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
                } else {
                    // Portable SQLite mode (for environments without active MySQL)
                    $dbDir = dirname(SQLITE_PATH);
                    if (!is_dir($dbDir)) {
                        mkdir($dbDir, 0755, true);
                    }
                    self::$instance = new PDO("sqlite:" . SQLITE_PATH);
                    self::$instance->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                    self::$instance->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
                    self::$instance->exec("PRAGMA foreign_keys = ON;");
                }
            } catch (PDOException $e) {
                if (APP_DEBUG) {
                    http_response_code(500);
                    $errMsg = htmlspecialchars($e->getMessage());
                    echo <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Database Setup Required | Aura Studio</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; background: #FAF9F6; color: #1C1917; padding: 2rem; display: flex; justify-content: center; align-items: center; min-height: 80vh; margin: 0; }
        .card { background: #FFFFFF; border: 1px solid #E7E5E4; border-radius: 16px; padding: 2.5rem; max-width: 620px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
        h1 { font-size: 1.5rem; color: #7C3AED; margin-top: 0; }
        .error-box { background: #FEF2F2; border: 1px solid #FCA5A5; color: #991B1B; padding: 0.875rem; border-radius: 8px; font-family: monospace; font-size: 0.85rem; word-break: break-all; margin: 1rem 0; }
        ol { padding-left: 1.25rem; font-size: 0.95rem; line-height: 1.6; }
        li { margin-bottom: 0.5rem; }
        .btn { display: inline-block; background: #7C3AED; color: #FFF; text-decoration: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; margin-top: 1rem; }
        code { background: #F3F4F6; padding: 2px 6px; border-radius: 4px; font-size: 0.875rem; }
    </style>
</head>
<body>
    <div class="card">
        <h1>⚙️ Database Setup Needed</h1>
        <p>Aura Studio cannot connect to MySQL database <code>aura_studio_db</code>.</p>
        <div class="error-box">{$errMsg}</div>
        <p><strong>Quick 3-Step Setup in XAMPP:</strong></p>
        <ol>
            <li>Open phpMyAdmin: <a href="http://localhost/phpmyadmin" target="_blank">http://localhost/phpmyadmin</a></li>
            <li>Click <strong>New</strong> in the left sidebar and create a database named <code>aura_studio_db</code>.</li>
            <li>Select <code>aura_studio_db</code>, go to the <strong>Import</strong> tab, choose <code>database/schema.sql</code> from this project, and click <strong>Go / Import</strong>.</li>
        </ol>
        <p style="font-size:0.875rem; color:#78716C;">After importing, refresh this page (F5) to launch the storefront.</p>
        <a href="http://localhost/phpmyadmin" target="_blank" class="btn">Open phpMyAdmin →</a>
    </div>
</body>
</html>
HTML;
                    exit;
                } else {
                    error_log("Database Connection Error: " . $e->getMessage());
                    die("We are currently experiencing a brief technical service interruption. Please try again shortly.");
                }
            }
        }
        return self::$instance;
    }

    public static function query(string $sql, array $params = []): PDOStatement {
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public static function fetchAll(string $sql, array $params = []): array {
        return self::query($sql, $params)->fetchAll();
    }

    public static function fetchOne(string $sql, array $params = []): ?array {
        $res = self::query($sql, $params)->fetch();
        return $res === false ? null : $res;
    }

    public static function insert(string $sql, array $params = []): int {
        self::query($sql, $params);
        return (int) self::getConnection()->lastInsertId();
    }

    public static function execute(string $sql, array $params = []): int {
        $stmt = self::query($sql, $params);
        return $stmt->rowCount();
    }

    public static function beginTransaction(): bool {
        return self::getConnection()->beginTransaction();
    }

    public static function commit(): bool {
        return self::getConnection()->commit();
    }

    public static function rollBack(): bool {
        if (self::getConnection()->inTransaction()) {
            return self::getConnection()->rollBack();
        }
        return false;
    }
}
