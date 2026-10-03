<?php
/**
 * AURA STUDIO - ADMIN PRODUCT & VARIANT MANAGEMENT
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

// Handle Product Creation
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create_product') {
    if (!Security::validateCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'Session security token expired.';
    } else {
        $name        = trim($_POST['name'] ?? '');
        $categoryId  = (int)($_POST['category_id'] ?? 0);
        $baseSku     = trim($_POST['base_sku'] ?? '');
        $regularPrice= (float)($_POST['regular_price'] ?? 0);
        $salePrice   = !empty($_POST['sale_price']) ? (float)$_POST['sale_price'] : null;
        $shortDesc   = trim($_POST['short_description'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $mainImage   = trim($_POST['main_image'] ?? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800');

        if (empty($name) || empty($baseSku) || $regularPrice <= 0 || $categoryId <= 0) {
            $error = 'Please fill all required product fields.';
        } else {
            try {
                $slug = slugify($name);
                // Check if slug exists
                $existing = Database::fetchOne("SELECT id FROM products WHERE slug = :s", [':s' => $slug]);
                if ($existing) {
                    $slug .= '-' . time();
                }

                $productId = Database::insert(
                    "INSERT INTO products (category_id, name, slug, base_sku, short_description, description, regular_price, sale_price, main_image, is_active)
                     VALUES (:cid, :name, :slug, :sku, :sdesc, :desc, :rp, :sp, :img, 1)",
                    [
                        ':cid'  => $categoryId,
                        ':name' => $name,
                        ':slug' => $slug,
                        ':sku'  => $baseSku,
                        ':sdesc'=> $shortDesc,
                        ':desc' => $description,
                        ':rp'   => $regularPrice,
                        ':sp'   => $salePrice,
                        ':img'  => $mainImage
                    ]
                );

                // Add default standard variants (Black & Pink, Sizes S, M, L)
                $colors = Database::fetchAll("SELECT id, name FROM colors LIMIT 2");
                $sizes  = Database::fetchAll("SELECT id, code FROM sizes WHERE code IN ('S', 'M', 'L')");

                foreach ($colors as $c) {
                    foreach ($sizes as $s) {
                        $vSku = sprintf("%s-%s-%s", $baseSku, strtoupper(substr($c['name'], 0, 3)), $s['code']);
                        Database::insert(
                            "INSERT INTO product_variants (product_id, color_id, size_id, sku, stock_quantity, is_active)
                             VALUES (:pid, :cid, :sid, :sku, 10, 1)",
                            [
                                ':pid' => $productId,
                                ':cid' => $c['id'],
                                ':sid' => $s['id'],
                                ':sku' => $vSku
                            ]
                        );
                    }
                }

                $message = 'Product created successfully with initial variant stock matrix!';
            } catch (Exception $e) {
                $error = 'Failed to save product: ' . $e->getMessage();
            }
        }
    }
}

// Fetch categories for dropdown
$categories = Database::fetchAll("SELECT id, name FROM categories WHERE is_active = 1 ORDER BY sort_order ASC");

// Fetch products with variant summaries
$products = Database::fetchAll(
    "SELECT p.*, c.name as category_name,
            COUNT(pv.id) as total_variants,
            COALESCE(SUM(pv.stock_quantity), 0) as total_stock
     FROM products p
     JOIN categories c ON c.id = p.category_id
     LEFT JOIN product_variants pv ON pv.product_id = p.id
     GROUP BY p.id
     ORDER BY p.id DESC"
);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Management | Aura Studio Admin</title>
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
                <a href="products.php" class="active"><i class="bi bi-box-seam"></i> Products & Variants</a>
                <a href="orders.php"><i class="bi bi-bag-check"></i> Orders & Delivery</a>
                <a href="inventory.php"><i class="bi bi-stack"></i> Variant Stock</a>
                <a href="settings.php"><i class="bi bi-sliders"></i> Store Settings</a>
                <hr class="border-secondary my-3 opacity-25">
                <a href="logout.php" class="text-danger"><i class="bi bi-box-arrow-right"></i> Sign Out</a>
            </div>
        </nav>

        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <h1 class="h3 fw-bold text-dark mb-0">Products Catalog & Variant Matrix</h1>
                <button class="btn btn-dark btn-sm" data-bs-toggle="collapse" data-bs-target="#newProductCard">
                    <i class="bi bi-plus-lg me-1"></i> Add New Product
                </button>
            </div>

            <?php if ($message): ?>
                <div class="alert alert-success py-2 small"><?= e($message) ?></div>
            <?php endif; ?>
            <?php if ($error): ?>
                <div class="alert alert-danger py-2 small"><?= e($error) ?></div>
            <?php endif; ?>

            <!-- Add Product Form Drawer/Collapse -->
            <div class="collapse mb-4" id="newProductCard">
                <div class="card border-0 shadow-sm rounded-3 p-4">
                    <h5 class="fw-bold mb-3">Create New Women's Product</h5>
                    <form method="POST">
                        <?= Security::csrfField() ?>
                        <input type="hidden" name="action" value="create_product">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label small fw-semibold">Product Title *</label>
                                <input type="text" name="name" class="form-control" required placeholder="e.g. Embroidered Georgette Anarkali">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label small fw-semibold">Category *</label>
                                <select name="category_id" class="form-select" required>
                                    <option value="">Select Category</option>
                                    <?php foreach ($categories as $cat): ?>
                                        <option value="<?= $cat['id'] ?>"><?= e($cat['name']) ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label small fw-semibold">Base SKU *</label>
                                <input type="text" name="base_sku" class="form-control" required placeholder="AS-KURTI-01">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label small fw-semibold">Regular Price (৳) *</label>
                                <input type="number" step="0.01" name="regular_price" class="form-control" required placeholder="2499.00">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label small fw-semibold">Sale Price (৳)</label>
                                <input type="number" step="0.01" name="sale_price" class="form-control" placeholder="1899.00">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-semibold">Short Subtitle / Fit Description</label>
                                <input type="text" name="short_description" class="form-control" placeholder="Relaxed A-Line silhouette with delicate hand embroidery">
                            </div>
                            <div class="col-12">
                                <label class="form-label small fw-semibold">Detailed Description</label>
                                <textarea name="description" rows="3" class="form-control" placeholder="Detailed fabric composition, styling advice, and care instructions..."></textarea>
                            </div>
                            <div class="col-12">
                                <label class="form-label small fw-semibold">Image URL</label>
                                <input type="url" name="main_image" class="form-control" placeholder="https://..." value="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800">
                            </div>
                            <div class="col-12 text-end">
                                <button type="submit" class="btn btn-dark">Publish Product & Build Matrix</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Products List Table -->
            <div class="card border-0 shadow-sm rounded-3">
                <div class="table-responsive">
                    <table class="table align-middle mb-0">
                        <thead class="table-light small text-uppercase text-secondary">
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Base SKU</th>
                                <th>Price</th>
                                <th>Variants</th>
                                <th>Total Stock</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($products as $p): ?>
                                <tr>
                                    <td>
                                        <div class="fw-semibold text-dark"><?= e($p['name']) ?></div>
                                        <div class="text-muted small"><?= e($p['slug']) ?></div>
                                    </td>
                                    <td><span class="badge bg-light text-dark border"><?= e($p['category_name']) ?></span></td>
                                    <td><code><?= e($p['base_sku']) ?></code></td>
                                    <td>
                                        <?php if (!empty($p['sale_price'])): ?>
                                            <span class="fw-bold text-danger"><?= format_taka($p['sale_price']) ?></span>
                                            <span class="text-muted text-decoration-line-through small ms-1"><?= format_taka($p['regular_price']) ?></span>
                                        <?php else: ?>
                                            <span class="fw-bold"><?= format_taka($p['regular_price']) ?></span>
                                        <?php endif; ?>
                                    </td>
                                    <td><?= (int)$p['total_variants'] ?> combinations</td>
                                    <td>
                                        <?php if ((int)$p['total_stock'] <= 5): ?>
                                            <span class="badge bg-danger"><?= (int)$p['total_stock'] ?></span>
                                        <?php else: ?>
                                            <span class="badge bg-success"><?= (int)$p['total_stock'] ?></span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <span class="badge <?= $p['is_active'] ? 'bg-success-subtle text-success' : 'bg-secondary' ?>">
                                            <?= $p['is_active'] ? 'Active' : 'Draft' ?>
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
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
