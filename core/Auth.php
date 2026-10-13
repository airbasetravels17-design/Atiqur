<?php
/**
 * AURA STUDIO - AUTHENTICATION CORE
 * Handles admin session management, login rate limiting, and password hashing.
 */

if (!defined('AURA_APP')) {
    require_once __DIR__ . '/../config/config.php';
}
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Security.php';

class Auth {
    private const MAX_ATTEMPTS = 5;
    private const LOCKOUT_MINUTES = 15;

    public static function attempt(string $username, string $password): array {
        Security::initSession();

        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

        // Check brute-force attempts
        if (self::isLockedOut($ip)) {
            return [
                'success' => false,
                'message' => 'Too many failed login attempts. Please wait 15 minutes before trying again.'
            ];
        }

        $admin = Database::fetchOne(
            "SELECT * FROM admins WHERE (username = :user_val OR email = :email_val) AND is_active = 1 LIMIT 1",
            [':user_val' => trim($username), ':email_val' => trim($username)]
        );

        if (!$admin || !password_verify($password, $admin['password_hash'])) {
            self::recordFailedAttempt($ip);
            return [
                'success' => false,
                'message' => 'Invalid username or password credentials.'
            ];
        }

        // Login successful: regenerate session ID to prevent session fixation attacks
        session_regenerate_id(true);

        $_SESSION[ADMIN_SESSION_KEY] = [
            'id'        => (int)$admin['id'],
            'username'  => $admin['username'],
            'email'     => $admin['email'],
            'full_name' => $admin['full_name'],
            'role'      => $admin['role'],
            'logged_in' => time()
        ];

        // Update last login timestamp
        Database::execute(
            "UPDATE admins SET last_login_at = CURRENT_TIMESTAMP WHERE id = :id",
            [':id' => $admin['id']]
        );

        // Clear previous failed attempts
        self::clearAttempts($ip);

        return [
            'success' => true,
            'message' => 'Authentication successful.'
        ];
    }

    public static function check(): bool {
        Security::initSession();
        return !empty($_SESSION[ADMIN_SESSION_KEY]['id']);
    }

    public static function user(): ?array {
        Security::initSession();
        return $_SESSION[ADMIN_SESSION_KEY] ?? null;
    }

    public static function logout(): void {
        Security::initSession();
        unset($_SESSION[ADMIN_SESSION_KEY]);
        session_destroy();
    }

    public static function requireAdmin(): void {
        if (!self::check()) {
            $redirectUrl = BASE_URL . '/admin/login.php';
            header("Location: " . $redirectUrl);
            exit;
        }
    }

    private static function isLockedOut(string $ip): bool {
        try {
            $cutoff = date('Y-m-d H:i:s', strtotime('-' . self::LOCKOUT_MINUTES . ' minutes'));
            $res = Database::fetchOne(
                "SELECT COUNT(*) as cnt FROM login_attempts WHERE ip_address = :ip AND attempted_at > :cutoff",
                [':ip' => $ip, ':cutoff' => $cutoff]
            );
            return ($res && (int)$res['cnt'] >= self::MAX_ATTEMPTS);
        } catch (Exception $e) {
            return false;
        }
    }

    private static function recordFailedAttempt(string $ip): void {
        try {
            Database::execute(
                "INSERT INTO login_attempts (ip_address) VALUES (:ip)",
                [':ip' => $ip]
            );
        } catch (Exception $e) {}
    }

    private static function clearAttempts(string $ip): void {
        try {
            Database::execute(
                "DELETE FROM login_attempts WHERE ip_address = :ip",
                [':ip' => $ip]
            );
        } catch (Exception $e) {}
    }
}
