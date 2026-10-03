<?php
/**
 * AURA STUDIO - ADMIN DASHBOARD
 */
define('AURA_APP', true);
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Security.php';
require_once __DIR__ . '/../core/Auth.php';
require_once __DIR__ . '/../core/helpers.php';

Auth::requireAdmin();
$adminUser = Auth::user();

// Fetch summary metrics
$totalOrders = (int)Database::fetchOne("SELECT COUNT(*) as c FROM orders")['c'] ?? 0;
$pendingOrders = (int)Database::fetchOne("SELECT COUNT(*) as c FROM orders WHERE order_status = 'Pending'")['c'] ?? 0;
$totalRevenue = (float)Database::fetchOne("SELECT SUM(grand_total) as s FROM orders WHERE order_status != 'Cancelled'")['s'] ?? 0;
$totalProducts = (int)Database::fetchOne("SELECT COUNT(*) as c FROM products WHERE is_active = 1")['c'] ?? 0;

// Low stock / out of stock variants alert (stock <= 5)
$lowStockVariants = Database::fetchAll(
    "SELECT pv.sku, pv.stock_quantity, p.name as product_name, c.name as color_name, s.code as size_code
     FROM product_variants pv
     JOIN products p ON p.id = pv.product_id
     JOIN colors c ON c.id = pv.color_id
     JOIN sizes s ON s.id = pv.size_id
     WHERE pv.stock_quantity <= 5 AND pv.is_active = 1
     ORDER BY pv.stock_quantity ASC LIMIT 6"
);

// Recent orders
$recentOrders = Database::fetchAll(
    "SELECT * FROM orders ORDER BY id DESC LIMIT 8"
);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | Aura Studio</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        :root { --sidebar-bg: #0f172a; --sidebar-active: #1e293b; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; }
        .sidebar { background: var(--sidebar-bg); min-height: 100vh; color: #94a3b8; }
        .sidebar .brand { font-size: 1.25rem; font-weight: 700; color: #fff; padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .sidebar-nav a { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1.5rem; color: #94a3b8; text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: all 0.2s; }
        .sidebar-nav a:hover, .sidebar-nav a.active { color: #fff; background: var(--sidebar-active); }
        .stat-card { border-radius: 12px; border: 1px solid #e2e8f0; background: #fff; padding: 1.5rem; }
    </style>
</head>
<body>
<div class="container-fluid">
    <div class="row">
        <!-- Sidebar Navigation -->
        <nav class="col-md-3 col-lg-2 d-md-block sidebar collapse p-0">
            <div class="brand">
                <i class="bi bi-gem me-2"></i> Aura Studio
                <div class="small fw-normal text-secondary text-uppercase" style="font-size: 0.65rem;">Operations Console</div>
            </div>
            <div class="sidebar-nav mt-3">
                <a href="index.php" class="active"><i class="bi bi-speedometer2"></i> Dashboard</a>
                <a href="products.php"><i class="bi bi-box-seam"></i> Products & Variants</a>
                <a href="orders.php"><i class="bi bi-bag-check"></i> Orders & Delivery</a>
                <a href="inventory.php"><i class="bi bi-stack"></i> Variant Stock</a>
                <a href="settings.php"><i class="bi bi-sliders"></i> Store Settings</a>
                <hr class="border-secondary my-3 opacity-25">
                <a href="logout.php" class="text-danger"><i class="bi bi-box-arrow-right"></i> Sign Out</a>
            </div>
        </nav>

        <!-- Main Content Area -->
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-3 mb-4 border-bottom">
                <div>
                    <h1 class="h3 fw-bold text-dark mb-0">Overview</h1>
                    <p class="text-muted small mb-0">Welcome back, <?= e($adminUser['full_name'] ?? 'Admin') ?></p>
                </div>
                <div>
                    <a href="orders.php" class="btn btn-dark btn-sm"><i class="bi bi-bag-check me-1"></i> Manage Orders</a>
                </div>
            </div>

            <!-- Stats Metric Cards -->
            <div class="row g-3 mb-4">
                <div class="col-12 col-sm-6 col-xl-3">
                    <div class="stat-card">
                        <div class="text-muted small fw-medium">Total Orders</div>
                        <div class="h3 fw-bold text-dark mt-2 mb-0"><?= number_format($totalOrders) ?></div>
                        <div class="text-secondary small mt-1">Lifetime customer orders</div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-xl-3">
                    <div class="stat-card">
                        <div class="text-muted small fw-medium">Pending Orders</div>
                        <div class="h3 fw-bold text-warning mt-2 mb-0"><?= number_format($pendingOrders) ?></div>
                        <div class="text-secondary small mt-1">Requires confirmation</div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-xl-3">
                    <div class="stat-card">
                        <div class="text-muted small fw-medium">Total Revenue</div>
                        <div class="h3 fw-bold text-dark mt-2 mb-0"><?= format_taka($totalRevenue) ?></div>
                        <div class="text-secondary small mt-1">Excluding cancelled orders</div>
                    </div>
                </div>
                <div class="col-12 col-sm-6 col-xl-3">
                    <div class="stat-card">
                        <div class="text-muted small fw-medium">Active Catalog</div>
                        <div class="h3 fw-bold text-dark mt-2 mb-0"><?= number_format($totalProducts) ?></div>
                        <div class="text-secondary small mt-1">Live active styles</div>
                    </div>
                </div>
            </div>

            <!-- Recent Orders and Low Stock Warning -->
            <div class="row g-4">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm rounded-3">
                        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h6 class="fw-bold mb-0 text-dark">Recent Customer Orders</h6>
                            <a href="orders.php" class="text-decoration-none small fw-semibold">View All</a>
                        </div>
                        <div class="table-responsive">
                            <table class="table align-middle mb-0">
                                <thead class="table-light small text-uppercase text-secondary">
                                    <tr>
                                        <th>Order #</th>
                                        <th>Customer</th>
                                        <th>Phone</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php if (empty($recentOrders)): ?>
                                        <tr><td colspan="6" class="text-center py-4 text-muted">No orders recorded yet.</td></tr>
                                    <?php else: ?>
                                        <?php foreach ($recentOrders as $ord): ?>
                                            <tr>
                                                <td class="fw-bold"><a href="orders.php?view=<?= $ord['id'] ?>" class="text-dark text-decoration-none"><?= e($ord['order_number']) ?></a></td>
                                                <td><?= e($ord['customer_name']) ?></td>
                                                <td class="small text-muted"><?= e($ord['customer_phone']) ?></td>
                                                <td class="fw-semibold"><?= format_taka($ord['grand_total']) ?></td>
                                                <td>
                                                    <span class="badge bg-secondary"><?= e($ord['order_status']) ?></span>
                                                </td>
                                                <td class="small text-muted"><?= date('M d, Y', strtotime($ord['created_at'])) ?></td>
                                            </tr>
                                        <?php endforeach; ?>
                                    <?php endif; ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card border-0 shadow-sm rounded-3">
                        <div class="card-header bg-white py-3">
                            <h6 class="fw-bold mb-0 text-dark"><i class="bi bi-exclamation-circle text-warning me-1"></i> Low Stock Alerts</h6>
                        </div>
                        <div class="p-3">
                            <?php if (empty($lowStockVariants)): ?>
                                <p class="text-muted small mb-0">All variation stocks are healthy.</p>
                            <?php else: ?>
                                <ul class="list-group list-group-flush">
                                    <?php foreach ($lowStockVariants as $ls): ?>
                                        <li class="list-group-item px-0 py-2 d-flex justify-content-between align-items-center">
                                            <div>
                                                <div class="small fw-semibold"><?= e($ls['product_name']) ?></div>
                                                <div class="text-muted" style="font-size: 0.75rem;"><?= e($ls['color_name']) ?> · Size <?= e($ls['size_code']) ?> (<?= e($ls['sku']) ?>)</div>
                                            </div>
                                            <span class="badge bg-danger-subtle text-danger"><?= $ls['stock_quantity'] ?> left</span>
                                        </li>
                                    <?php endforeach; ?>
                                </ul>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</div>
</body>
</html>
