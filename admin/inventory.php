<?php
/**
 * AURA STUDIO - ADMIN VARIANT-LEVEL INVENTORY MANAGEMENT
 */
define('AURA_APP', true);
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Security.php';
require_once __DIR__ . '/../core/Auth.php';
require_once __DIR__ . '/../core/helpers.php';

Auth::requireAdmin();

$message = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_stock') {
    if (Security::validateCsrfToken($_POST['csrf_token'] ?? '')) {
        $variantId = (int)($_POST['variant_id'] ?? 0);
        $newStock = max(0, (int)($_POST['stock_quantity'] ?? 0));
        $isActive = isset($_POST['is_active']) ? 1 : 0;

        Database::execute(
            "UPDATE product_variants SET stock_quantity = :st, is_active = :act WHERE id = :id",
            [':st' => $newStock, ':act' => $isActive, ':id' => $variantId]
        );
        $message = "Stock level updated successfully.";
    }
}

// Fetch all product variants with product, color, and size details
$variants = Database::fetchAll(
    "SELECT pv.*, p.name as product_name, p.base_sku, c.name as color_name, c.hex_code as color_hex, s.code as size_code
     FROM product_variants pv
     JOIN products p ON p.id = pv.product_id
     JOIN colors c ON c.id = pv.color_id
     JOIN sizes s ON s.id = pv.size_id
     ORDER BY p.name ASC, c.name ASC, s.sort_order ASC"
);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Variant Inventory Management | Aura Studio Admin</title>
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
                <a href="inventory.php" class="active"><i class="bi bi-stack"></i> Variant Stock</a>
                <a href="settings.php"><i class="bi bi-sliders"></i> Store Settings</a>
                <hr class="border-secondary my-3 opacity-25">
                <a href="logout.php" class="text-danger"><i class="bi bi-box-arrow-right"></i> Sign Out</a>
            </div>
        </nav>

        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            <h1 class="h3 fw-bold text-dark mb-3">Variant-Level Inventory</h1>
            <p class="text-muted small mb-4">Stock is tracked strictly per variation (Color × Size). Orders reduce individual variant stocks.</p>

            <?php if ($message): ?>
                <div class="alert alert-success py-2 small"><?= e($message) ?></div>
            <?php endif; ?>

            <div class="card border-0 shadow-sm rounded-3">
                <div class="table-responsive">
                    <table class="table align-middle mb-0">
                        <thead class="table-light small text-uppercase text-secondary">
                            <tr>
                                <th>Product</th>
                                <th>Color</th>
                                <th>Size</th>
                                <th>Variant SKU</th>
                                <th>Stock Status</th>
                                <th>Current Stock</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($variants as $v): ?>
                                <tr>
                                    <td class="fw-semibold"><?= e($v['product_name']) ?></td>
                                    <td>
                                        <span class="d-inline-block rounded-circle me-1 border" style="width:12px;height:12px;background:<?= e($v['color_hex']) ?>"></span>
                                        <?= e($v['color_name']) ?>
                                    </td>
                                    <td><span class="badge bg-light text-dark border"><?= e($v['size_code']) ?></span></td>
                                    <td><code><?= e($v['sku']) ?></code></td>
                                    <td>
                                        <?php if ($v['stock_quantity'] == 0): ?>
                                            <span class="badge bg-danger">Out of Stock</span>
                                        <?php elseif ($v['stock_quantity'] <= 5): ?>
                                            <span class="badge bg-warning text-dark">Low Stock (<?= $v['stock_quantity'] ?>)</span>
                                        <?php else: ?>
                                            <span class="badge bg-success">In Stock (<?= $v['stock_quantity'] ?>)</span>
                                        <?php endif; ?>
                                    </td>
                                    <td style="width: 140px;">
                                        <form method="POST" class="d-flex align-items-center gap-1">
                                            <?= Security::csrfField() ?>
                                            <input type="hidden" name="action" value="update_stock">
                                            <input type="hidden" name="variant_id" value="<?= $v['id'] ?>">
                                            <input type="number" name="stock_quantity" value="<?= $v['stock_quantity'] ?>" min="0" class="form-control form-control-sm text-center" style="width:70px;">
                                            <button type="submit" class="btn btn-outline-dark btn-sm py-0 px-2" title="Save Stock"><i class="bi bi-check-lg"></i></button>
                                        </form>
                                    </td>
                                    <td>
                                        <span class="badge <?= $v['is_active'] ? 'bg-success-subtle text-success' : 'bg-secondary' ?>">
                                            <?= $v['is_active'] ? 'Active' : 'Disabled' ?>
                                        </span>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
</div>
</body>
</html>
