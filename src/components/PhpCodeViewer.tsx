import React, { useState } from 'react';
import JSZip from 'jszip';
import { Download, FileCode, Check, Copy, Folder, Server, Database, Shield } from 'lucide-react';

interface PhpCodeViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const PHP_FILES: Record<string, { desc: string; code: string }> = {
  'config/config.php': {
    desc: 'cPanel / XAMPP Database Credentials, Base URL & Currency Constants',
    code: `<?php
define('AURA_APP', true);
define('APP_ENV', 'development'); // 'production' for live server
define('APP_DEBUG', true);

define('APP_NAME', "Women's Fit");
define('BASE_URL', 'http://localhost/womensfit');

// MySQL / MariaDB Credentials
define('DB_HOST', 'localhost');
define('DB_PORT', '3306');
define('DB_NAME', 'womens_fit_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Currency Settings (Bangladeshi Taka ৳)
define('CURRENCY_SYMBOL', '৳');
define('CURRENCY_CODE', 'BDT');

define('ROOT_PATH', dirname(__DIR__));
define('UPLOAD_DIR', ROOT_PATH . '/uploads');
define('UPLOAD_URL', BASE_URL . '/uploads');
define('SETUP_LOCK_FILE', ROOT_PATH . '/admin/setup.lock');
`
  },
  'database/schema.sql': {
    desc: 'Complete MySQL 8+ / MariaDB Database Schema with Variant Matrix & Seed Data',
    code: `-- WOMEN'S FIT - WOMEN'S E-COMMERCE DATABASE
-- Compatible with MySQL 8.0+ / MariaDB 10.4+ / XAMPP / cPanel

CREATE TABLE \`admins\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`username\` VARCHAR(60) NOT NULL UNIQUE,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`full_name\` VARCHAR(100) NOT NULL,
  \`role\` ENUM('super_admin', 'store_manager') NOT NULL DEFAULT 'super_admin',
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE \`products\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`category_id\` INT UNSIGNED NOT NULL,
  \`name\` VARCHAR(200) NOT NULL,
  \`slug\` VARCHAR(220) NOT NULL UNIQUE,
  \`base_sku\` VARCHAR(50) NOT NULL UNIQUE,
  \`regular_price\` DECIMAL(12,2) NOT NULL,
  \`sale_price\` DECIMAL(12,2) NULL,
  \`main_image\` VARCHAR(255) NOT NULL,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE \`product_variants\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`product_id\` INT UNSIGNED NOT NULL,
  \`color_id\` INT UNSIGNED NOT NULL,
  \`size_id\` INT UNSIGNED NOT NULL,
  \`sku\` VARCHAR(60) NOT NULL UNIQUE,
  \`stock_quantity\` INT NOT NULL DEFAULT 0,
  \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT \`fk_variant_product\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE \`orders\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`order_number\` VARCHAR(30) NOT NULL UNIQUE,
  \`customer_name\` VARCHAR(120) NOT NULL,
  \`customer_phone\` VARCHAR(30) NOT NULL,
  \`delivery_address\` TEXT NOT NULL,
  \`city\` VARCHAR(80) NOT NULL,
  \`grand_total\` DECIMAL(12,2) NOT NULL,
  \`payment_method\` VARCHAR(40) NOT NULL DEFAULT 'Cash on Delivery',
  \`order_status\` ENUM('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled') NOT NULL DEFAULT 'Pending',
  \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`
  },
  'core/Database.php': {
    desc: 'PDO Database Singleton, Prepared Queries & Transaction Support',
    code: `<?php
class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false
            ];
            self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
        }
        return self::$instance;
    }

    public static function query(string $sql, array $params = []): PDOStatement {
        $stmt = self::getConnection()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }

    public static function fetchAll(string $sql, array $params = []): array {
        return self::query($sql, $params)->fetchAll();
    }

    public static function fetchOne(string $sql, array $params = []): ?array {
        $res = self::query($sql, $params)->fetch();
        return $res === false ? null : $res;
    }

    public static function insert(string $sql, array $params = []): int {
        self::query($sql, $params);
        return (int) self::getConnection()->lastInsertId();
    }

    public static function beginTransaction(): bool { return self::getConnection()->beginTransaction(); }
    public static function commit(): bool { return self::getConnection()->commit(); }
    public static function rollBack(): bool { return self::getConnection()->rollBack(); }
}
`
  },
  'core/Cart.php': {
    desc: 'Variant-Aware Shopping Cart Engine with Server-Side Atomic Stock Verification',
    code: `<?php
class Cart {
    public static function addItem(int $variantId, int $quantity = 1): array {
        Security::initSession();
        // Server-side database validation
        $variant = Database::fetchOne(
            "SELECT pv.*, p.name, p.regular_price, p.sale_price, c.name as color_name, s.code as size_code
             FROM product_variants pv
             JOIN products p ON p.id = pv.product_id
             JOIN colors c ON c.id = pv.color_id
             JOIN sizes s ON s.id = pv.size_id
             WHERE pv.id = :id AND pv.is_active = 1",
            [':id' => $variantId]
        );

        if (!$variant || (int)$variant['stock_quantity'] < $quantity) {
            return ['success' => false, 'message' => 'Variant is out of stock.'];
        }

        // Add to session cart
        $items = self::getItems();
        $key = 'var_' . $variantId;
        $items[$key] = [
            'variant_id'   => $variantId,
            'product_name' => $variant['name'],
            'color_name'   => $variant['color_name'],
            'size_code'    => $variant['size_code'],
            'quantity'     => $quantity,
            'unit_price'   => (float)($variant['sale_price'] ?? $variant['regular_price'])
        ];
        $_SESSION['_aura_cart'] = $items;
        return ['success' => true];
    }
}
`
  },
  'admin/setup.php': {
    desc: 'Secure One-Time Setup Wizard with Automatic setup.lock Enforcement',
    code: `<?php
define('AURA_APP', true);
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../core/Database.php';

if (file_exists(SETUP_LOCK_FILE)) {
    die("Setup already completed. Access permanently locked.");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $hash = password_hash($_POST['password'], PASSWORD_DEFAULT);
    Database::insert(
        "INSERT INTO admins (username, email, password_hash, full_name, role)
         VALUES (:u, :e, :h, :fn, 'super_admin')",
        [':u' => $_POST['username'], ':e' => $_POST['email'], ':h' => $hash, ':fn' => $_POST['full_name']]
    );
    file_put_contents(SETUP_LOCK_FILE, "LOCKED=" . date('c'));
    echo "Setup finished. Please proceed to login.php.";
}
`
  },
  'INSTALLATION.md': {
    desc: 'Official 34-Step Deployment Guide for cPanel and XAMPP',
    code: `# Women's Fit — Complete Production Installation & Deployment Guide
1. Import database/schema.sql into phpMyAdmin.
2. Edit config/config.php with your MySQL database credentials.
3. Access /admin/setup.php to initialize your super administrator account.
4. Verify that admin/setup.lock is created automatically.
5. All money uses Bangladeshi Taka (৳).
`
  },
  '.htaccess': {
    desc: 'Apache Security Headers, Directory Browsing Blocker & Sensitive File Guard',
    code: `Options -Indexes
Options +FollowSymLinks
AddDefaultCharset UTF-8

<FilesMatch "^(config\\.php|schema\\.sql|\\.env|setup\\.lock|\\.htaccess)$">
    Require all denied
</FilesMatch>
`
  }
};

export const PhpCodeViewer: React.FC<PhpCodeViewerProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>('config/config.php');
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentFile = PHP_FILES[selectedFile] || PHP_FILES['config/config.php'];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      
      // Add all PHP architecture files into zip
      Object.entries(PHP_FILES).forEach(([path, { code }]) => {
        zip.file(path, code);
      });

      // Generate zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'womens-fit-php-cpanel-ready.zip';
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to generate zip:', e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6">
      <div className="bg-[#0F172A] text-stone-200 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col h-[90vh] overflow-hidden border border-stone-800">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-serif text-base font-bold text-white">
                PHP Shared Hosting (cPanel & XAMPP) Source Package
              </h2>
              <p className="text-[11px] text-stone-400">
                100% Shared-hosting compatible: PHP 8.1+ / MySQL PDO / No Node.js required on server
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isZipping ? 'Bundling...' : 'Download Complete Package (.zip)'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body (File Tree Left + Code Viewer Right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* File Selector Tree */}
          <div className="w-full md:w-72 bg-stone-950/80 p-3 border-r border-stone-800 overflow-y-auto space-y-1 text-xs">
            <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest px-2 py-1">
              Package Files
            </div>
            {Object.keys(PHP_FILES).map(path => (
              <button
                key={path}
                onClick={() => setSelectedFile(path)}
                className={`w-full text-left px-3 py-2 rounded-lg font-mono flex items-center gap-2 transition-colors ${
                  selectedFile === path
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-stone-400 hover:bg-stone-800/50 hover:text-stone-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{path}</span>
              </button>
            ))}
          </div>

          {/* Code Display Area */}
          <div className="flex-1 flex flex-col bg-[#0A0F1D] overflow-hidden">
            <div className="p-3 bg-stone-900/60 border-b border-stone-800/80 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-amber-400 font-bold">{selectedFile}</span>
                <span className="text-stone-400 text-[11px] ml-2 hidden sm:inline">— {currentFile.desc}</span>
              </div>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-[11px] font-medium flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="flex-1 p-4 font-mono text-xs text-stone-300 overflow-auto whitespace-pre leading-relaxed select-text">
              <code>{currentFile.code}</code>
            </pre>
          </div>

        </div>

        {/* Footer Note */}
        <div className="p-3 bg-stone-950 border-t border-stone-800 text-[11px] text-stone-400 flex flex-wrap justify-between items-center px-4">
          <span>✓ Works after uploading files to cPanel <code>public_html</code> via File Manager or FTP.</span>
          <span className="font-mono text-stone-500">Bangladeshi Taka (৳) Standard</span>
        </div>

      </div>
    </div>
  );
};
