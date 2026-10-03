<?php
/**
 * AURA STUDIO - ADMIN STORE SETTINGS
 */
define('AURA_APP', true);
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Security.php';
require_once __DIR__ . '/../core/Auth.php';
require_once __DIR__ . '/../core/helpers.php';

Auth::requireAdmin();

$message = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_settings') {
    if (Security::validateCsrfToken($_POST['csrf_token'] ?? '')) {
        $keys = [
            'store_name', 'store_tagline', 'store_email', 'store_phone',
            'store_address', 'shipping_charge_inside_dhaka',
            'shipping_charge_outside_dhaka', 'free_shipping_threshold', 'announcement_text'
        ];

        foreach ($keys as $k) {
            if (isset($_POST[$k])) {
                $val = trim($_POST[$k]);
                Database::execute(
                    "INSERT INTO store_settings (setting_key, setting_value) VALUES (:k, :v)
                     ON DUPLICATE KEY UPDATE setting_value = :v",
                    [':k' => $k, ':v' => $val]
                );
            }
        }
        $message = "Store configurations updated successfully.";
    }
}

// Load current settings
$settings = [];
$rows = Database::fetchAll("SELECT setting_key, setting_value FROM store_settings");
foreach ($rows as $r) {
    $settings[$r['setting_key']] = $r['setting_value'];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Store Settings | Aura Studio Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; }
        .sidebar { background: #0f172a; min-height: 100vh; color: #94a3b8; }
        .sidebar .brand { font-size: 1.25rem; font-weight: 700; color: #fff; padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .sidebar-nav a { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1.5rem; color: #94a3b8; text-decoration: none; font-size: 0.875rem; font-weight: 500; }
        .sidebar-nav a:hover, .sidebar-nav a.active { color: #fff; background: #1e293b; }
    </style>
</head>
<body>
<div class="container-fluid">
    <div class="row">
        <nav class="col-md-3 col-lg-2 d-md-block sidebar collapse p-0">
            <div class="brand">Aura Studio Admin</div>
            <div class="sidebar-nav mt-3">
                <a href="index.php"><i class="bi bi-speedometer2"></i> Dashboard</a>
                <a href="products.php"><i class="bi bi-box-seam"></i> Products & Variants</a>
                <a href="orders.php"><i class="bi bi-bag-check"></i> Orders & Delivery</a>
                <a href="inventory.php"><i class="bi bi-stack"></i> Variant Stock</a>
                <a href="settings.php" class="active"><i class="bi bi-sliders"></i> Store Settings</a>
                <hr class="border-secondary my-3 opacity-25">
                <a href="logout.php" class="text-danger"><i class="bi bi-box-arrow-right"></i> Sign Out</a>
            </div>
        </nav>

        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            <h1 class="h3 fw-bold text-dark mb-4">Store Configuration & Delivery Rules</h1>

            <?php if ($message): ?>
                <div class="alert alert-success py-2 small"><?= e($message) ?></div>
            <?php endif; ?>

            <div class="card border-0 shadow-sm rounded-3 p-4">
                <form method="POST">
                    <?= Security::csrfField() ?>
                    <input type="hidden" name="action" value="save_settings">

                    <h5 class="fw-bold mb-3">General Store Profile</h5>
                    <div class="row g-3 mb-4">
                        <div class="col-md-6">
                            <label class="form-label small fw-semibold">Store Brand Name</label>
                            <input type="text" name="store_name" class="form-control" value="<?= e($settings['store_name'] ?? 'Aura Studio') ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-semibold">Tagline</label>
                            <input type="text" name="store_tagline" class="form-control" value="<?= e($settings['store_tagline'] ?? "Elevated Women's Fashion & Fits") ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-semibold">Support Email</label>
                            <input type="email" name="store_email" class="form-control" value="<?= e($settings['store_email'] ?? 'concierge@aurastudio.fashion') ?>">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label small fw-semibold">Hotline / Phone</label>
                            <input type="text" name="store_phone" class="form-control" value="<?= e($settings['store_phone'] ?? '+880 1711-000000') ?>">
                        </div>
                        <div class="col-12">
                            <label class="form-label small fw-semibold">Physical Atelier Address</label>
                            <input type="text" name="store_address" class="form-control" value="<?= e($settings['store_address'] ?? 'House 42, Road 11, Banani, Dhaka-1213, Bangladesh') ?>">
                        </div>
                    </div>

                    <h5 class="fw-bold mb-3">Currency & Delivery Charges (Bangladeshi Taka ৳)</h5>
                    <div class="row g-3 mb-4">
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">Delivery Charge (Inside Dhaka)</label>
                            <div class="input-group">
                                <span class="input-group-text">৳</span>
                                <input type="number" step="0.01" name="shipping_charge_inside_dhaka" class="form-control" value="<?= e($settings['shipping_charge_inside_dhaka'] ?? '80.00') ?>">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">Delivery Charge (Outside Dhaka)</label>
                            <div class="input-group">
                                <span class="input-group-text">৳</span>
                                <input type="number" step="0.01" name="shipping_charge_outside_dhaka" class="form-control" value="<?= e($settings['shipping_charge_outside_dhaka'] ?? '150.00') ?>">
                            </div>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small fw-semibold">Free Delivery Threshold</label>
                            <div class="input-group">
                                <span class="input-group-text">৳</span>
                                <input type="number" step="0.01" name="free_shipping_threshold" class="form-control" value="<?= e($settings['free_shipping_threshold'] ?? '1999.00') ?>">
                            </div>
                        </div>
                    </div>

                    <h5 class="fw-bold mb-3">Top Promotional Announcement Bar</h5>
                    <div class="mb-4">
                        <input type="text" name="announcement_text" class="form-control" value="<?= e($settings['announcement_text'] ?? '✨ SUMMER SALE IS LIVE — UP TO 60% OFF BESTSELLERS! FREE DELIVERY OVER ৳1,999 ✨') ?>">
                    </div>

                    <button type="submit" class="btn btn-dark">Save Configurations</button>
                </form>
            </div>
        </main>
    </div>
</div>
</body>
</html>
