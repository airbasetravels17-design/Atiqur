<?php
/**
 * AURA STUDIO - ADMIN ORDER MANAGEMENT
 */
define('AURA_APP', true);
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Security.php';
require_once __DIR__ . '/../core/Auth.php';
require_once __DIR__ . '/../core/helpers.php';

Auth::requireAdmin();

$message = null;
$error = null;

// Handle Status Update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'update_status') {
    if (!Security::validateCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'Security session expired.';
    } else {
        $orderId = (int)($_POST['order_id'] ?? 0);
        $newStatus = trim($_POST['status'] ?? '');
        $comment = trim($_POST['comment'] ?? '');

        $allowedStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
        if ($orderId > 0 && in_array($newStatus, $allowedStatuses, true)) {
            Database::execute("UPDATE orders SET order_status = :s WHERE id = :id", [':s' => $newStatus, ':id' => $orderId]);
            Database::insert(
                "INSERT INTO order_status_history (order_id, status, comment, changed_by) VALUES (:oid, :st, :c, :by)",
                [
                    ':oid' => $orderId,
                    ':st'  => $newStatus,
                    ':c'   => !empty($comment) ? $comment : "Status updated to $newStatus",
                    ':by'  => Auth::user()['full_name'] ?? 'Admin'
                ]
            );
            $message = "Order status updated to $newStatus successfully.";
        }
    }
}

// Check if viewing specific order
$viewOrderId = isset($_GET['view']) ? (int)$_GET['view'] : null;
$viewOrder = null;
if ($viewOrderId) {
    $viewOrder = Database::fetchOne("SELECT * FROM orders WHERE id = :id", [':id' => $viewOrderId]);
    if ($viewOrder) {
        $viewOrder['items'] = Database::fetchAll("SELECT * FROM order_items WHERE order_id = :id", [':id' => $viewOrderId]);
        $viewOrder['history'] = Database::fetchAll("SELECT * FROM order_status_history WHERE order_id = :id ORDER BY id DESC", [':id' => $viewOrderId]);
    }
}

// Fetch orders list
$filterStatus = $_GET['status'] ?? '';
$where = "1=1";
$params = [];
if (!empty($filterStatus)) {
    $where = "order_status = :st";
    $params[':st'] = $filterStatus;
}
$orders = Database::fetchAll("SELECT * FROM orders WHERE $where ORDER BY id DESC", $params);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Management | Aura Studio Admin</title>
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
        <!-- Sidebar Navigation -->
        <nav class="col-md-3 col-lg-2 d-md-block sidebar collapse p-0">
            <div class="brand">Aura Studio Admin</div>
            <div class="sidebar-nav mt-3">
                <a href="index.php"><i class="bi bi-speedometer2"></i> Dashboard</a>
                <a href="products.php"><i class="bi bi-box-seam"></i> Products & Variants</a>
                <a href="orders.php" class="active"><i class="bi bi-bag-check"></i> Orders & Delivery</a>
                <a href="inventory.php"><i class="bi bi-stack"></i> Variant Stock</a>
                <a href="settings.php"><i class="bi bi-sliders"></i> Store Settings</a>
                <hr class="border-secondary my-3 opacity-25">
                <a href="logout.php" class="text-danger"><i class="bi bi-box-arrow-right"></i> Sign Out</a>
            </div>
        </nav>

        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <h1 class="h3 fw-bold text-dark mb-0">Customer Orders & Fulfillment</h1>
            </div>

            <?php if ($message): ?>
                <div class="alert alert-success py-2 small"><?= e($message) ?></div>
            <?php endif; ?>
            <?php if ($error): ?>
                <div class="alert alert-danger py-2 small"><?= e($error) ?></div>
            <?php endif; ?>

            <?php if ($viewOrder): ?>
                <!-- Single Order Detail View -->
                <div class="card border-0 shadow-sm rounded-3 mb-4 p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h4 class="fw-bold mb-0">Order <?= e($viewOrder['order_number']) ?></h4>
                        <a href="orders.php" class="btn btn-outline-secondary btn-sm"><i class="bi bi-arrow-left"></i> Back to Orders</a>
                    </div>
                    <div class="row g-4">
                        <div class="col-md-6">
                            <h6 class="fw-semibold text-secondary">Customer & Delivery Details</h6>
                            <p class="mb-1"><strong>Name:</strong> <?= e($viewOrder['customer_name']) ?></p>
                            <p class="mb-1"><strong>Phone:</strong> <?= e($viewOrder['customer_phone']) ?></p>
                            <p class="mb-1"><strong>Email:</strong> <?= e($viewOrder['customer_email'] ?: 'N/A') ?></p>
                            <p class="mb-1"><strong>Delivery Address:</strong> <?= e($viewOrder['delivery_address']) ?>, <?= e($viewOrder['city']) ?></p>
                            <?php if ($viewOrder['customer_note']): ?>
                                <p class="mb-1 text-muted"><strong>Customer Note:</strong> <?= e($viewOrder['customer_note']) ?></p>
                            <?php endif; ?>
                        </div>
                        <div class="col-md-6">
                            <h6 class="fw-semibold text-secondary">Update Order Status</h6>
                            <form method="POST">
                                <?= Security::csrfField() ?>
                                <input type="hidden" name="action" value="update_status">
                                <input type="hidden" name="order_id" value="<?= $viewOrder['id'] ?>">
                                <div class="mb-2">
                                    <select name="status" class="form-select">
                                        <?php foreach (['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as $st): ?>
                                            <option value="<?= $st ?>" <?= $viewOrder['order_status'] === $st ? 'selected' : '' ?>><?= $st ?></option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>
                                <div class="mb-2">
                                    <input type="text" name="comment" class="form-control form-control-sm" placeholder="Optional audit comment">
                                </div>
                                <button type="submit" class="btn btn-dark btn-sm">Update Status</button>
                            </form>
                        </div>
                    </div>

                    <h6 class="fw-semibold text-secondary mt-4 mb-2">Order Items</h6>
                    <div class="table-responsive">
                        <table class="table align-middle border mb-3">
                            <thead class="table-light small">
                                <tr>
                                    <th>Item</th>
                                    <th>Color</th>
                                    <th>Size</th>
                                    <th>SKU</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($viewOrder['items'] as $item): ?>
                                    <tr>
                                        <td class="fw-semibold"><?= e($item['product_name']) ?></td>
                                        <td><?= e($item['color_name']) ?></td>
                                        <td><span class="badge bg-light text-dark border"><?= e($item['size_code']) ?></span></td>
                                        <td><small class="text-muted"><?= e($item['sku']) ?></small></td>
                                        <td><?= format_taka($item['unit_price']) ?></td>
                                        <td><?= (int)$item['quantity'] ?></td>
                                        <td class="fw-semibold"><?= format_taka($item['subtotal']) ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>

                    <div class="row justify-content-end">
                        <div class="col-md-4">
                            <ul class="list-group list-group-flush small">
                                <li class="list-group-item d-flex justify-content-between px-0">
                                    <span>Subtotal:</span>
                                    <span><?= format_taka($viewOrder['subtotal']) ?></span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between px-0">
                                    <span>Delivery Charge:</span>
                                    <span><?= format_taka($viewOrder['shipping_charge']) ?></span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between px-0 fw-bold fs-6">
                                    <span>Grand Total:</span>
                                    <span><?= format_taka($viewOrder['grand_total']) ?></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            <?php endif; ?>

            <!-- Orders Table -->
            <div class="card border-0 shadow-sm rounded-3">
                <div class="table-responsive">
                    <table class="table align-middle mb-0">
                        <thead class="table-light small text-uppercase text-secondary">
                            <tr>
                                <th>Order #</th>
                                <th>Customer</th>
                                <th>Phone</th>
                                <th>City</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Placed At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (empty($orders)): ?>
                                <tr><td colspan="8" class="text-center py-4 text-muted">No orders found.</td></tr>
                            <?php else: ?>
                                <?php foreach ($orders as $o): ?>
                                    <tr>
                                        <td class="fw-bold"><a href="orders.php?view=<?= $o['id'] ?>" class="text-dark"><?= e($o['order_number']) ?></a></td>
                                        <td><?= e($o['customer_name']) ?></td>
                                        <td><small class="text-muted"><?= e($o['customer_phone']) ?></small></td>
                                        <td><?= e($o['city']) ?></td>
                                        <td class="fw-semibold"><?= format_taka($o['grand_total']) ?></td>
                                        <td>
                                            <span class="badge bg-secondary"><?= e($o['order_status']) ?></span>
                                        </td>
                                        <td class="small text-muted"><?= date('M d, Y H:i', strtotime($o['created_at'])) ?></td>
                                        <td>
                                            <a href="orders.php?view=<?= $o['id'] ?>" class="btn btn-outline-dark btn-sm py-0 px-2">View</a>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
</div>
</body>
</html>
