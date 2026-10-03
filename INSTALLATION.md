# Women's Fit — Complete Production Installation & Deployment Guide

> **Official Deployment Manual for Localhost (XAMPP / Apache / Node.js) & Web Hosting**
> Currency: Bangladeshi Taka (৳) | Architecture: Modern High-Performance SPA & Modular Backend

---

## 1. Quick Localhost Run with XAMPP (0 Configuration Needed)

The project includes pre-built production assets in `./assets` and `./dist`. You can run it immediately on Apache / XAMPP without installing build tools:

1. **Start XAMPP**:
   - Open the **XAMPP Control Panel** and start **Apache**.

2. **Extract Project Folder**:
   - Extract the project zip files directly into your XAMPP web root directory:
     - **Windows**: `C:\xampp\htdocs\aurastudio`
     - **macOS**: `/Applications/XAMPP/xamppfiles/htdocs/aurastudio`
     - **Linux**: `/opt/lampp/htdocs/aurastudio`

3. **Open in Browser**:
   - Navigate to:
     ```
     http://localhost/aurastudio
     ```
     or:
     ```
     http://localhost/aurastudio/index.php
     ```
   - The latest **Women's Fit** storefront will load immediately with:
     - 🌺 Coral Announcement & Customizable Seasonal PromoBanner
     - 🌟 5-Star Reviews & Rating Breakdown System
     - 💬 1-Click WhatsApp & Facebook Social Media Sharing
     - 🔍 Clickable Search History with LocalStorage Persistence
     - 👗 Color Variant Image Switching & Live Stock Status
     - 🛒 Cash on Delivery (COD) Checkout & Real-Time Order Tracking
     - 🛡️ 28-Module Full Administrator Portal (Access via keyboard shortcut `Ctrl + Shift + A` or `#admin`)

---

## 2. Optional: Running with Node.js & Vite (Development Mode)

If you have Node.js (v18+) installed and wish to run the interactive hot-reloading development server:

1. Open your terminal in the project directory:
   ```bash
   cd C:\xampp\htdocs\aurastudio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite dev server:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```
   http://localhost:3000
   ```

---

## 3. Administrator Access Information

The admin portal is strictly protected and hidden from the public storefront:

- **Direct Route**: `http://localhost/aurastudio/#admin` (or `http://localhost:3000/#admin` in Vite dev server)
- **Keyboard Shortcut**: Press `Ctrl + Shift + A` (or `Alt + A`) anywhere on the storefront to immediately open the admin portal login.
- **Default Admin Credentials**:
  - **Username / Email**: `admin@womensfit.com` (or `admin`)
  - **Password**: `WomensFit@2026`
- **Features in Admin Portal**:
  1. Live Orders Dashboard & Status Management (Pending, Confirmed, Shipped, Delivered)
  2. Inventory & Stock Management with Color/Size Variant Control
  3. Visual CMS: Seasonal Promo Banner Editor (colors, badges, CTA links, 1-click seasonal presets)
  4. Coupons, Discounts & Free Shipping Thresholds
  5. Customer Reviews Moderation
  6. Store Settings (Store Name, Phone, Address, Shipping Rates inside/outside Dhaka)

---

## 4. Troubleshooting

- **If you see "500 Internal Server Error" in Apache**:
  - Make sure your `.htaccess` file does NOT contain `<Directory>` directives (the updated `.htaccess` has this removed).
  - Verify that Apache's `mod_rewrite` is enabled.
- **If CSS/JavaScript styles do not update**:
  - Perform a hard refresh in your browser: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac) to clear the browser cache.
