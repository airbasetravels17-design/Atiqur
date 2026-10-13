<?php
/**
 * AURA STUDIO - EMERGENCY ADMIN RESET & RECOVERY TOOL
 * Allows restoring admin credentials and unlocking brute-force lockouts.
 */
define('AURA_APP', true);
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Security.php';
require_once __DIR__ . '/../core/Auth.php';

Security::initSession();

$message = null;
$messageType = 'info';
$resetDone = false;

// Function to ensure tables exist
function ensureAdminTables() {
    try {
        Database::execute("
            CREATE TABLE IF NOT EXISTS `admins` (
                `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                `username` VARCHAR(50) NOT NULL UNIQUE,
                `email` VARCHAR(100) NOT NULL UNIQUE,
                `password_hash` VARCHAR(255) NOT NULL,
                `full_name` VARCHAR(100) NOT NULL,
                `role` ENUM('super_admin','admin','editor') NOT NULL DEFAULT 'admin',
                `is_active` TINYINT(1) NOT NULL DEFAULT 1,
                `last_login_at` DATETIME NULL,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ");
    } catch (Exception $e) {
        // SQLite fallback syntax if needed
        try {
            Database::execute("
                CREATE TABLE IF NOT EXISTS admins (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL UNIQUE,
                    email TEXT NOT NULL UNIQUE,
                    password_hash TEXT NOT NULL,
                    full_name TEXT NOT NULL,
                    role TEXT NOT NULL DEFAULT 'admin',
                    is_active INTEGER NOT NULL DEFAULT 1,
                    last_login_at TEXT,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
                );
            ");
        } catch (Exception $e2) {}
    }

    try {
        Database::execute("
            CREATE TABLE IF NOT EXISTS `login_attempts` (
                `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                `ip_address` VARCHAR(45) NOT NULL,
                `attempted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX `idx_ip_attempt` (`ip_address`, `attempted_at`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        ");
    } catch (Exception $e) {}
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    ensureAdminTables();
    
    // Action: 1-Click Default Reset
    if (isset($_POST['action_default'])) {
        try {
            $defaultUsername = 'admin';
            $defaultPassword = 'admin123';
            $defaultEmail = 'admin@womensfit.com';
            $defaultName = 'Super Administrator';
            $hash = password_hash($defaultPassword, PASSWORD_DEFAULT);

            // Check if admin user already exists
            $existing = Database::fetchOne("SELECT id FROM admins WHERE username = 'admin' OR email = 'admin@womensfit.com' LIMIT 1");

            if ($existing) {
                Database::execute(
                    "UPDATE admins SET username = :u, email = :e, password_hash = :h, full_name = :fn, role = 'super_admin', is_active = 1 WHERE id = :id",
                    [
                        ':u'  => $defaultUsername,
                        ':e'  => $defaultEmail,
                        ':h'  => $hash,
                        ':fn' => $defaultName,
                        ':id' => $existing['id']
                    ]
                );
            } else {
                Database::insert(
                    "INSERT INTO admins (id, username, email, password_hash, full_name, role, is_active)
                     VALUES (1, :u, :e, :h, :fn, 'super_admin', 1)",
                    [
                        ':u'  => $defaultUsername,
                        ':e'  => $defaultEmail,
                        ':h'  => $hash,
                        ':fn' => $defaultName
                    ]
                );
            }

            // Clear login lockout attempts
            Auth::clearAttempts();

            // Clear setup lock file if present
            if (file_exists(SETUP_LOCK_FILE)) {
                @unlink(SETUP_LOCK_FILE);
            }

            $message = "Successfully reset Administrator account!<br><br><strong>Username:</strong> <code>admin</code><br><strong>Password:</strong> <code>admin123</code><br><strong>Email:</strong> <code>admin@womensfit.com</code><br><br>All login lockouts have been cleared.";
            $messageType = 'success';
            $resetDone = true;

        } catch (Exception $e) {
            $message = "Error resetting admin account: " . htmlspecialchars($e->getMessage());
            $messageType = 'danger';
        }
    }

    // Action: Custom User/Pass Reset
    if (isset($_POST['action_custom'])) {
        $customUser = trim($_POST['custom_username'] ?? '');
        $customPass = trim($_POST['custom_password'] ?? '');
        $customEmail = trim($_POST['custom_email'] ?? 'admin@womensfit.com');
        $customName = trim($_POST['custom_fullname'] ?? 'Administrator');

        if (empty($customUser) || empty($customPass)) {
            $message = "Username and password cannot be empty.";
            $messageType = 'danger';
        } else {
            try {
                $hash = password_hash($customPass, PASSWORD_DEFAULT);

                $existing = Database::fetchOne("SELECT id FROM admins WHERE username = :u OR email = :e LIMIT 1", [
                    ':u' => $customUser,
                    ':e' => $customEmail
                ]);

                if ($existing) {
                    Database::execute(
                        "UPDATE admins SET username = :u, email = :e, password_hash = :h, full_name = :fn, role = 'super_admin', is_active = 1 WHERE id = :id",
                        [
                            ':u'  => $customUser,
                            ':e'  => $customEmail,
                            ':h'  => $hash,
                            ':fn' => $customName,
                            ':id' => $existing['id']
                        ]
                    );
                } else {
                    Database::insert(
                        "INSERT INTO admins (username, email, password_hash, full_name, role, is_active)
                         VALUES (:u, :e, :h, :fn, 'super_admin', 1)",
                        [
                            ':u'  => $customUser,
                            ':e'  => $customEmail,
                            ':h'  => $hash,
                            ':fn' => $customName
                        ]
                    );
                }

                Auth::clearAttempts();
                if (file_exists(SETUP_LOCK_FILE)) {
                    @unlink(SETUP_LOCK_FILE);
                }

                $message = "Custom Administrator account successfully updated!<br><br><strong>Username:</strong> <code>" . htmlspecialchars($customUser) . "</code><br><strong>Password:</strong> <em>(The password you entered)</em>";
                $messageType = 'success';
                $resetDone = true;

            } catch (Exception $e) {
                $message = "Database error: " . htmlspecialchars($e->getMessage());
                $messageType = 'danger';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Password Reset & Recovery | Women's Fit</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body {
            background-color: #0f172a;
            color: #1e293b;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
        }
        .card-recovery {
            background: #ffffff;
            border-radius: 14px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
            max-width: 520px;
            width: 100%;
            overflow: hidden;
        }
        .header-bar {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: white;
            padding: 1.75rem 2rem;
            text-align: center;
            border-bottom: 3px solid #e11d48;
        }
        .btn-reset-default {
            background-color: #10b981;
            color: white;
            font-weight: 600;
            padding: 0.85rem;
            border-radius: 8px;
            border: none;
            transition: all 0.2s;
        }
        .btn-reset-default:hover {
            background-color: #059669;
            color: white;
        }
        .badge-step {
            background-color: #e2e8f0;
            color: #475569;
            font-weight: 700;
            padding: 0.2rem 0.5rem;
            border-radius: 6px;
            font-size: 0.75rem;
        }
    </style>
</head>
<body>

<div class="card-recovery">
    <div class="header-bar">
        <span class="badge bg-danger mb-2 px-2 py-1" style="font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase;">Recovery Tool</span>
        <h4 class="fw-bold mb-1">Admin Access Recovery</h4>
        <p class="text-white-50 small mb-0">Reset credentials & unlock the administrator portal</p>
    </div>

    <div class="p-4">
        <?php if ($message): ?>
            <div class="alert alert-<?= $messageType ?> small mb-4">
                <?= $message ?>
            </div>
        <?php endif; ?>

        <?php if ($resetDone): ?>
            <div class="text-center py-2">
                <a href="login.php" class="btn btn-dark w-100 py-2 fw-semibold">
                    <i class="bi bi-box-arrow-in-right me-1"></i> Go to Admin Login Now
                </a>
            </div>
        <?php else: ?>

            <!-- OPTION 1: 1-CLICK INSTANT RESET -->
            <div class="border rounded-3 p-3 mb-4 bg-light">
                <div class="d-flex align-items-center justify-content-between mb-2">
                    <h6 class="fw-bold mb-0 text-dark">Option 1: 1-Click Instant Reset</h6>
                    <span class="badge bg-success">Recommended</span>
                </div>
                <p class="small text-muted mb-3">
                    Instantly configures the super administrator account with the default credentials and clears any temporary lockout.
                </p>

                <div class="bg-white p-2 rounded border small mb-3">
                    <div><strong>Username:</strong> <code class="text-primary">admin</code></div>
                    <div><strong>Password:</strong> <code class="text-primary">admin123</code></div>
                    <div><strong>Email:</strong> <code>admin@womensfit.com</code></div>
                </div>

                <form method="POST">
                    <input type="hidden" name="action_default" value="1">
                    <button type="submit" class="btn btn-reset-default w-100 shadow-sm">
                        <i class="bi bi-shield-check me-1"></i> Reset Admin to Default (admin / admin123)
                    </button>
                </form>
            </div>

            <!-- OPTION 2: CUSTOM CREDENTIALS -->
            <div class="border rounded-3 p-3">
                <h6 class="fw-bold mb-2 text-dark">Option 2: Set Custom Credentials</h6>
                <p class="small text-muted mb-3">Create or overwrite the admin account with your preferred username and password.</p>

                <form method="POST">
                    <input type="hidden" name="action_custom" value="1">
                    <div class="mb-2">
                        <label class="form-label small fw-semibold text-secondary mb-1">Username</label>
                        <input type="text" name="custom_username" class="form-control form-control-sm" required placeholder="e.g. admin or atiqur">
                    </div>
                    <div class="mb-2">
                        <label class="form-label small fw-semibold text-secondary mb-1">Password</label>
                        <input type="password" name="custom_password" class="form-control form-control-sm" required placeholder="Your new password">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold text-secondary mb-1">Email</label>
                        <input type="email" name="custom_email" class="form-control form-control-sm" value="admin@womensfit.com" required>
                    </div>
                    <button type="submit" class="btn btn-outline-dark btn-sm w-100 fw-semibold">
                        <i class="bi bi-key me-1"></i> Save Custom Credentials
                    </button>
                </form>
            </div>

        <?php endif; ?>

        <div class="text-center mt-3 pt-2 border-top">
            <a href="login.php" class="small text-decoration-none text-muted">
                ← Back to Login
            </a>
            <span class="mx-2 text-muted">•</span>
            <a href="<?= BASE_URL ?>/" class="small text-decoration-none text-muted">
                Storefront
            </a>
        </div>
    </div>
</div>

</body>
</html>
