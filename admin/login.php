<?php
/**
 * AURA STUDIO - SECURE ADMIN LOGIN
 */
define('AURA_APP', true);
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Security.php';
require_once __DIR__ . '/../core/Auth.php';

Security::initSession();
Security::setSecurityHeaders();

// If already authenticated, redirect to dashboard
if (Auth::check()) {
    header('Location: ' . BASE_URL . '/admin/index.php');
    exit;
}

$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrf = $_POST['csrf_token'] ?? '';
    if (!Security::validateCsrfToken($csrf)) {
        $error = 'Security session expired. Please refresh and try again.';
    } else {
        $username = trim($_POST['username'] ?? '');
        $password = trim($_POST['password'] ?? '');

        if (empty($username) || empty($password)) {
            $error = 'Please enter both username and password.';
        } else {
            $result = Auth::attempt($username, $password);
            if ($result['success']) {
                header('Location: ' . BASE_URL . '/admin/index.php');
                exit;
            } else {
                $error = $result['message'];
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
    <title>Administration Console | Aura Studio</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body {
            background-color: #0f172a;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .login-card {
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-width: 420px;
            padding: 2.5rem;
        }
        .brand-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        .brand-header h1 {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: -0.025em;
            color: #0f172a;
        }
        .brand-header p {
            color: #64748b;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        .btn-primary {
            background-color: #0f172a;
            border-color: #0f172a;
            font-weight: 500;
            padding: 0.75rem;
            border-radius: 8px;
        }
        .btn-primary:hover {
            background-color: #1e293b;
            border-color: #1e293b;
        }
        .form-control {
            border-radius: 8px;
            padding: 0.75rem 1rem;
            border-color: #cbd5e1;
        }
        .form-control:focus {
            border-color: #0f172a;
            box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.1);
        }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="brand-header">
            <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:#e11d48; font-weight:700;">Admin Console</span>
            <h1><?= htmlspecialchars(APP_NAME) ?></h1>
            <p>Administration & Operations Portal</p>
        </div>

        <?php if ($error): ?>
            <div class="alert alert-danger py-2 small" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-1"></i> <?= e($error) ?>
            </div>
        <?php endif; ?>

        <form method="POST" action="">
            <?= Security::csrfField() ?>

            <div class="mb-3">
                <label class="form-label small fw-semibold text-secondary">Username or Email</label>
                <div class="input-group">
                    <span class="input-group-text bg-light text-muted"><i class="bi bi-person"></i></span>
                    <input type="text" name="username" class="form-control" required autofocus placeholder="admin or admin@womensfit.com" value="<?= htmlspecialchars($_POST['username'] ?? 'admin') ?>">
                </div>
            </div>

            <div class="mb-4">
                <label class="form-label small fw-semibold text-secondary">Password</label>
                <div class="input-group">
                    <span class="input-group-text bg-light text-muted"><i class="bi bi-lock"></i></span>
                    <input type="password" name="password" class="form-control" required placeholder="admin123">
                </div>
            </div>

            <button type="submit" class="btn btn-primary w-100">
                Sign In to Dashboard
            </button>

            <div class="mt-3 p-2 bg-light rounded text-center" style="font-size: 0.8rem; color: #64748b; border: 1px dashed #cbd5e1;">
                Default Credentials: <strong>admin</strong> / <strong>admin123</strong>
            </div>

            <div class="text-center mt-3">
                <a href="<?= BASE_URL ?>/" class="text-decoration-none small text-muted">
                    ← Return to Storefront
                </a>
            </div>
        </form>
    </div>
</body>
</html>
