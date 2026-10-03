<?php
/**
 * AURA STUDIO - SECURITY CORE
 * Implements CSRF protection, input sanitation, secure headers, and upload validation.
 */

if (!defined('AURA_APP')) {
    require_once __DIR__ . '/../config/config.php';
}

class Security {
    public static function initSession(): void {
        if (session_status() === PHP_SESSION_NONE) {
            $cookieParams = [
                'lifetime' => SESSION_LIFETIME,
                'path'     => '/',
                'domain'   => '',
                'secure'   => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
                'httponly' => true,
                'samesite' => 'Lax'
            ];
            session_set_cookie_params($cookieParams);
            session_start();
        }
    }

    public static function setSecurityHeaders(): void {
        if (!headers_sent()) {
            header("X-Content-Type-Options: nosniff");
            header("X-Frame-Options: SAMEORIGIN");
            header("X-XSS-Protection: 1; mode=block");
            header("Referrer-Policy: strict-origin-when-cross-origin");
        }
    }

    public static function getCsrfToken(): string {
        self::initSession();
        if (empty($_SESSION[CSRF_TOKEN_KEY])) {
            $_SESSION[CSRF_TOKEN_KEY] = bin2hex(random_bytes(32));
        }
        return $_SESSION[CSRF_TOKEN_KEY];
    }

    public static function validateCsrfToken(?string $token): bool {
        self::initSession();
        if (empty($token) || empty($_SESSION[CSRF_TOKEN_KEY])) {
            return false;
        }
        return hash_equals($_SESSION[CSRF_TOKEN_KEY], $token);
    }

    public static function csrfField(): string {
        $token = self::getCsrfToken();
        return '<input type="hidden" name="csrf_token" value="' . htmlspecialchars($token, ENT_QUOTES, 'UTF-8') . '">';
    }

    public static function escape(?string $str): string {
        return htmlspecialchars((string) $str, ENT_QUOTES, 'UTF-8');
    }

    public static function sanitizeString(?string $str): string {
        if ($str === null) return '';
        return trim(strip_tags($str));
    }

    public static function sanitizePhone(string $phone): string {
        // Keeps numbers, spaces, and leading plus sign
        return preg_replace('/[^\d+]/', '', trim($phone));
    }

    public static function validateUpload(array $file, array $allowedMimes = ['image/jpeg', 'image/png', 'image/webp']): ?string {
        if (!isset($file['error']) || is_array($file['error'])) {
            return 'Invalid upload parameter structure.';
        }

        if ($file['error'] !== UPLOAD_ERR_OK) {
            return match ($file['error']) {
                UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'File exceeds maximum upload size (5MB).',
                UPLOAD_ERR_PARTIAL => 'File was only partially uploaded.',
                UPLOAD_ERR_NO_FILE => 'No file was uploaded.',
                default => 'Unknown upload error.'
            };
        }

        if ($file['size'] > MAX_UPLOAD_SIZE) {
            return 'File size exceeds maximum allowed 5MB limit.';
        }

        // Validate MIME type securely using finfo
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);

        if (!in_array($mime, $allowedMimes, true)) {
            return 'Invalid file type. Only JPG, PNG, and WebP images are permitted.';
        }

        return null; // Valid
    }

    public static function storeUploadedImage(array $file, string $subfolder = 'products'): string {
        $validationError = self::validateUpload($file);
        if ($validationError !== null) {
            throw new Exception($validationError);
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);
        $extensions = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp'
        ];
        $ext = $extensions[$mime] ?? 'jpg';

        $targetDir = UPLOAD_DIR . '/' . $subfolder;
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        // Generate collision-safe cryptographically random filename
        $safeName = sprintf('%s_%s.%s', date('Ymd_His'), bin2hex(random_bytes(6)), $ext);
        $targetFile = $targetDir . '/' . $safeName;

        if (!move_uploaded_file($file['tmp_name'], $targetFile)) {
            throw new Exception('Failed to store uploaded file on server disk.');
        }

        return '/uploads/' . $subfolder . '/' . $safeName;
    }
}

// Global short helper for template escaping
function e(?string $string): string {
    return Security::escape($string);
}
