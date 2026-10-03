<?php
/**
 * AURA STUDIO - SECURE INITIAL ADMINISTRATOR SETUP
 * This wizard only functions once. After account creation, it writes setup.lock
 * and permanently locks further access.
 */
define('AURA_APP', true);
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Security.php';

Security::initSession();

// Check if setup is already locked
if (file_exists(SETUP_LOCK_FILE)) {
    die("<h3>Setup Locked</h3><p>Initial installation has already been completed. For security reasons, this setup wizard is permanently disabled.</p><p><a href='login.php'>Proceed to Admin Login</a></p>");
}

// Also check if any admin already exists in the database
try {
    $existingAdmin = Database::fetchOne("SELECT id FROM admins LIMIT 1");
    if ($existingAdmin) {
        touch(SETUP_LOCK_FILE);
        die("<h3>Setup Already Configured</h3><p>An administrator account already exists. Setup is now locked.</p><p><a href='login.php'>Proceed to Admin Login</a></p>");
    }
} catch (Exception $e) {
    // Database table might need migration
}

$error = null;
$success = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = trim($_POST['full_name'] ?? '');
    $username = trim($_POST['username'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (empty($fullName) || empty($username) || empty($email) || empty($password)) {
        $error = 'All fields are required to initialize the administrator profile.';
    } elseif (strlen($password) < 8) {
        $error = 'Password must be at least 8 characters long for security.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please provide a valid administrator email address.';
    } else {
        try {
            $hash = password_hash($password, PASSWORD_DEFAULT);
            Database::insert(
                "INSERT INTO admins (username, email, password_hash, full_name, role, is_active)
                 VALUES (:u, :e, :h, :fn, 'super_admin', 1)",
                [
                    ':u'  => $username,
                    ':e'  => $email,
                    ':h'  => $hash,
                    ':fn' => $fullName
                ]
            );

            // Create lock file
            file_put_contents(SETUP_LOCK_FILE, "INSTALLED_ON=" . date('c'));
            $success = true;
        } catch (Exception $e) {
            $error = 'Failed to create administrator account: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Initial Administrator Setup | Aura Studio</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light py-5">
    <div class="container" style="max-width: 500px;">
        <div class="card border-0 shadow-sm rounded-3 p-4">
            <div class="text-center mb-4">
                <h3 class="fw-bold">Aura Studio</h3>
                <p class="text-muted small">First Administrator Account Initialization</p>
            </div>

            <?php if ($success): ?>
                <div class="alert alert-success">
                    <h5 class="alert-heading">Setup Complete!</h5>
                    <p class="small mb-2">The super administrator account has been created and <code>admin/setup.lock</code> has been activated.</p>
                    <a href="login.php" class="btn btn-dark btn-sm w-100 mt-2">Proceed to Admin Login</a>
                </div>
            <?php else: ?>
                <?php if ($error): ?>
                    <div class="alert alert-danger py-2 small"><?= htmlspecialchars($error) ?></div>
                <?php endif; ?>

                <form method="POST">
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Full Name</label>
                        <input type="text" name="full_name" class="form-control" required placeholder="Store Director">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Username</label>
                        <input type="text" name="username" class="form-control" required placeholder="admin">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Email Address</label>
                        <input type="email" name="email" class="form-control" required placeholder="admin@aurastudio.com">
                    </div>
                    <div class="mb-4">
                        <label class="form-label small fw-semibold">Password</label>
                        <input type="password" name="password" class="form-control" required minlength="8" placeholder="Minimum 8 characters">
                    </div>
                    <button type="submit" class="btn btn-dark w-100 py-2">Create Administrator & Lock Wizard</button>
                </form>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
