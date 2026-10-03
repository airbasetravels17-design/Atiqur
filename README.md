# Aura Studio — Premium Women's Fashion & Fit E-Commerce Platform

A production-grade, shared-hosting-friendly (cPanel & XAMPP compatible) full-stack e-commerce web application tailored for contemporary women's fashion in Bangladesh.

All prices, charges, and summaries use **Bangladeshi Taka (৳)**.

---

## 🌟 Key Architecture & Features

### Public Storefront
- **Zero Admin Exposure**: Absolutely no links or references to the admin panel appear anywhere on the customer-facing storefront.
- **Top Bar Contract**: Clean 3-zone header with single wordmark, category navigation, search bar, order tracking shortcut, and shopping bag counter.
- **Hero & Promotional Sections**: Seasonal editorial banners (Summer Collection, Timeless Elegance), circular category links, and trust indicators.
- **Shop Catalog & Multi-Faceted Filters**: Real-time filtering by category, price range, color swatch, size, stock availability, and sorting (Newest, Popular, Price Low-High, Price High-Low).
- **Product Detail Page with Dynamic Color-Specific Galleries**:
  - Selecting a color (e.g. *Blush Rose*, *Emerald Sage*, *Midnight Black*) immediately updates the photo gallery to that exact color's photography angles.
  - Selecting size dynamically calculates availability for the specific (Color × Size) variant.
  - Unavailable combinations (e.g. *Emerald Sage / XXL*) are clearly marked and disabled, preventing invalid add-to-bag operations.
- **Variant-Aware Cart**: Tracks separate items per variant (`Product A / Color 1 / Size S` vs `Product A / Color 2 / Size S`), with quantity caps bounded by live variant inventory.
- **Free Delivery Calculation**: Progress bar towards free delivery on orders over **৳1,999** (Inside Dhaka standard ৳80, Outside Dhaka ৳150).
- **Checkout (Cash on Delivery)**: Simple, frictionless form collecting recipient name, mobile phone, address, city/district, and special delivery notes.
- **Order Confirmation & Tracking**: Generates collision-safe order codes (e.g. `WF-YYYYMMDD-XXXX`), with a real-time progress timeline (Pending → Confirmed → Processing → Shipped → Delivered).

### Administrator Control Panel (`/admin/`)
- **Secure Authentication**: Password hashing with `password_hash()` (Argon2ID / Bcrypt), session regeneration on login, and brute-force throttling (5 attempts per 15 mins).
- **One-Time Setup Wizard**: `admin/setup.php` sets up the initial super administrator account and writes `admin/setup.lock`, locking out any future runs.
- **Dashboard Overview**: Total revenue in ৳, pending orders counter, active catalog metrics, and low-stock warnings (≤ 5 units).
- **Product & Variant Matrix**: Manage parent products, SKU, descriptions, and color-size combination matrices.
- **Variant Inventory Management**: Live stock adjustments per individual variant. Orders atomically decrement stock.
- **Order Fulfillment**: Review recipient contact, address, itemized breakdown, and update statuses with audit trail comments.
- **Store Settings**: Configure delivery charges, hotline, address, and announcement banner text.

---

## 📁 Project File Structure

```text
/
├── index.php                      # Public storefront entry point
├── .htaccess                      # Security headers, block sensitive files
├── INSTALLATION.md                # 34-step cPanel & XAMPP deployment guide
├── README.md                      # Architecture documentation
├── config/
│   └── config.php                 # Database credentials, BASE_URL, currency
├── core/
│   ├── Database.php               # PDO singleton with prepared queries & transactions
│   ├── Security.php               # CSRF tokens, XSS escaping, safe upload validator
│   ├── Auth.php                   # Sessions, password hashing, brute-force rate limiter
│   ├── Cart.php                   # Variant-aware session cart with atomic validation
│   └── helpers.php                # Currency format_taka(), slugify(), order codes
├── models/
│   ├── Product.php                # Product catalog & filter queries
│   └── Order.php                  # Transaction-safe order creation & tracking
├── database/
│   └── schema.sql                 # MySQL 8+ / MariaDB relational schema & seed data
├── api/
│   ├── cart.php                   # AJAX cart endpoints
│   ├── checkout.php               # Order placement endpoint
│   └── track_order.php            # Customer order lookup endpoint
└── admin/
    ├── index.php                  # Admin dashboard
    ├── login.php                  # Admin authentication form
    ├── logout.php                 # Session termination
    ├── setup.php                  # One-time first admin installer (locks after run)
    ├── products.php               # Product & variant catalog
    ├── orders.php                 # Order fulfillment & status updates
    ├── inventory.php              # Variant-level stock matrix
    └── settings.php               # Store configs & courier charges
```

---

## 🚀 Quick Deployment Guide

1. Create a MySQL database in cPanel or phpMyAdmin: `aura_studio_db`.
2. Import `database/schema.sql`.
3. Configure `config/config.php` with database name, user, and password.
4. Visit `https://yourdomain.com/admin/setup.php` to set up your administrator credentials.
5. Setup will automatically activate `admin/setup.lock`.

For complete instructions, refer to `INSTALLATION.md`.
