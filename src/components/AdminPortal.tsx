import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, Product, ProductVariant, Coupon, PromoBannerConfig, DEFAULT_PROMO_BANNER } from '../types/ecommerce';
import { formatTaka } from '../utils/format';
import { 
  ShoppingCart, ShoppingBag, Receipt, Truck, CreditCard, Package, Layers, 
  ListChecks, Tag, Star, Warehouse, MessageSquare, Ticket, Megaphone, 
  Image as ImageIcon, LayoutGrid, FileText, Menu, LogOut, CheckCircle, 
  AlertTriangle, Eye, Plus, Search, Trash2, Upload, ExternalLink, ArrowLeft, 
  X, HelpCircle, CheckSquare, Quote, Footprints, Users, UserCheck, ShieldCheck, 
  UserCog, Settings, Webhook, Send, Bell, ClipboardList, Zap, Database, Download, Sparkles
} from 'lucide-react';

interface AdminPortalProps {
  orders: Order[];
  products: Product[];
  promoBanner?: PromoBannerConfig;
  onUpdatePromoBanner?: (config: PromoBannerConfig) => void;
  onAddProduct: (product: Product) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, comment: string) => void;
  onUpdateVariantStock: (productId: string, variantId: string, newStock: number) => void;
  onExitAdmin: () => void;
}

type AdminModule = 
  // 1. Sales & Fulfillment
  | 'orders' | 'abandoned-checkouts' | 'pos' | 'shipping-methods'
  // 2. Finance & Gateways
  | 'payments'
  // 3. Product Catalog
  | 'products' | 'variants' | 'attributes' | 'categories' | 'brands' | 'inventory' | 'reviews'
  // 4. Marketing & Promotions
  | 'coupons' | 'popup-ads'
  // 5. Storefront & Visual CMS
  | 'promo-banner' | 'hero-sliders' | 'homepage-sections' | 'landing-pages' | 'menus'
  | 'pages-cms' | 'faqs' | 'features' | 'testimonials' | 'footer-config'
  // 6. Customers & Access
  | 'customers' | 'administrators' | 'roles-permissions' | 'profile-settings'
  // 7. System & Operations
  | 'settings' | 'integrations-webhooks' | 'telegram-alerts' | 'notifications'
  | 'activity-logs' | 'cache-management' | 'database-backups';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  orders,
  products,
  promoBanner,
  onUpdatePromoBanner,
  onAddProduct,
  onUpdateOrderStatus,
  onUpdateVariantStock,
  onExitAdmin
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active module selected from the sidebar
  const [activeModule, setActiveModule] = useState<AdminModule>('orders');

  // Promo Banner State
  const [bannerForm, setBannerForm] = useState<PromoBannerConfig>(() => {
    return promoBanner || DEFAULT_PROMO_BANNER;
  });

  // Sync banner form when external prop changes
  useEffect(() => {
    if (promoBanner) {
      setBannerForm(promoBanner);
    }
  }, [promoBanner]);

  // Selected Order for detail inspection
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Pending');
  const [statusComment, setStatusComment] = useState('');

  // Product Creation Modal with Image Upload
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('Women\'s Fit');
  const [newProdCategory, setNewProdCategory] = useState('Kurtis');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdRegPrice, setNewProdRegPrice] = useState('1999');
  const [newProdSalePrice, setNewProdSalePrice] = useState('999');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: 'c1', code: 'WOMENFIT10', discountPercent: 10, minSpend: 1500, expiryDate: '2026-12-31', usageCount: 42, isActive: true },
    { id: 'c2', code: 'SUMMER20', discountPercent: 20, minSpend: 2500, expiryDate: '2026-11-30', usageCount: 18, isActive: true },
    { id: 'c3', code: 'FREESHIP', discountPercent: 0, minSpend: 1000, expiryDate: '2026-10-31', usageCount: 65, isActive: true }
  ]);

  // Dynamic FAQs State
  const [faqs, setFaqs] = useState([
    { id: 'f1', question: 'How long does delivery take across Bangladesh?', answer: 'Inside Dhaka delivery is completed in 24-48 hours. Nationwide delivery to other districts takes 3-4 days via our verified courier partners.', category: 'Shipping & Delivery' },
    { id: 'f2', question: 'Can I pay via Cash on Delivery?', answer: 'Yes! We support 100% Cash on Delivery nationwide. You can inspect your parcel before paying the courier rider.', category: 'Payment' },
    { id: 'f3', question: 'What is your return policy?', answer: 'We offer a hassle-free 15-day return and exchange policy on all unworn items with original tags intact.', category: 'Returns & Refunds' }
  ]);

  // Testimonials State
  const [testimonials, setTestimonials] = useState([
    { id: 't1', name: 'Nusrat Jahan', role: 'Fashion Enthusiast, Dhaka', quote: 'The Tokyo Talkies floral print dress exceeded my expectations! The fabric is so breathable in Dhaka heat.', rating: 5, status: 'Approved' },
    { id: 't2', name: 'Samira Rahman', role: 'Architect, Chittagong', quote: 'Fastest delivery ever. Ordered on Friday, received on Sunday morning with cash on delivery. 10/10 quality.', rating: 5, status: 'Approved' },
    { id: 't3', name: 'Farzana Haque', role: 'Teacher, Sylhet', quote: 'True to size chart. The stitching on the Anouk Kurta is very refined.', rating: 4, status: 'Approved' }
  ]);

  // Administrators State
  const [adminsList, setAdminsList] = useState([
    { id: 'a1', name: 'Super Admin', email: 'admin@womensfit.com', role: 'Super Admin', status: 'Active', lastLogin: 'Just now' },
    { id: 'a2', name: 'Tanzila Operations', email: 'tanzila@womensfit.com', role: 'Store Manager', status: 'Active', lastLogin: '2 hours ago' },
    { id: 'a3', name: 'Courier Dispatch Desk', email: 'dispatch@womensfit.com', role: 'Fulfillment Staff', status: 'Active', lastLogin: 'Yesterday' }
  ]);

  // Telegram Alerts State
  const [telegramBotToken, setTelegramBotToken] = useState('7182938192:AAHG...wfit_bot');
  const [telegramChatId, setTelegramChatId] = useState('-100293847291');
  const [telegramAlertsEnabled, setTelegramAlertsEnabled] = useState(true);

  // Feedback Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveBanner = (configToSave?: PromoBannerConfig) => {
    const target = configToSave || bannerForm;
    if (onUpdatePromoBanner) {
      onUpdatePromoBanner(target);
    }
    showToast(`Promo banner ${target.isVisible ? 'published & live' : 'hidden'} on storefront!`);
  };

  const handleToggleBannerVisibility = () => {
    const updated: PromoBannerConfig = { ...bannerForm, isVisible: !bannerForm.isVisible };
    setBannerForm(updated);
    if (onUpdatePromoBanner) {
      onUpdatePromoBanner(updated);
    }
    showToast(`Promo banner ${updated.isVisible ? 'turned ON (visible)' : 'turned OFF (hidden)'}!`);
  };

  // Handle Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    if ((cleanUser === 'admin@womensfit.com' || cleanUser === 'admin') && (password === 'WomensFit@2026' || password === 'admin')) {
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Invalid credentials. Use Username: admin@womensfit.com and Password: WomensFit@2026');
    }
  };

  // Image Upload handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setUploadedImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Product Save
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim() || !newProdSku.trim()) return;

    const regPrice = parseFloat(newProdRegPrice) || 1999;
    const salePrice = newProdSalePrice ? parseFloat(newProdSalePrice) : null;
    const catSlug = newProdCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const prodSlug = newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();

    const createdProduct: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      brand: newProdBrand.trim(),
      slug: prodSlug,
      baseSku: newProdSku.trim().toUpperCase(),
      category: newProdCategory,
      categorySlug: catSlug,
      shortDescription: newProdDesc.trim() || 'Premium fashion curated for Women\'s Fit collection.',
      description: newProdDesc.trim() || 'Designed with premium fabrications and expert contemporary stitching.',
      fabric: 'Fine Breathable Cotton Weave',
      fit: 'Regular Tailored Fit',
      care: 'Gentle hand wash cold or dry clean',
      regularPrice: regPrice,
      salePrice: salePrice,
      isFeatured: true,
      isTrending: true,
      rating: 4.8,
      reviewsCount: 1,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        {
          id: `col-${Date.now()}`,
          name: 'Primary Color',
          hex: '#EC4899',
          images: [uploadedImageUrl]
        }
      ],
      variants: [
        { id: `var-${Date.now()}-1`, productId: `prod-${Date.now()}`, colorId: `col-${Date.now()}`, colorName: 'Primary Color', colorHex: '#EC4899', sizeCode: 'S', sku: `${newProdSku}-S`, stock: 10 },
        { id: `var-${Date.now()}-2`, productId: `prod-${Date.now()}`, colorId: `col-${Date.now()}`, colorName: 'Primary Color', colorHex: '#EC4899', sizeCode: 'M', sku: `${newProdSku}-M`, stock: 15 },
        { id: `var-${Date.now()}-3`, productId: `prod-${Date.now()}`, colorId: `col-${Date.now()}`, colorName: 'Primary Color', colorHex: '#EC4899', sizeCode: 'L', sku: `${newProdSku}-L`, stock: 8 },
        { id: `var-${Date.now()}-4`, productId: `prod-${Date.now()}`, colorId: `col-${Date.now()}`, colorName: 'Primary Color', colorHex: '#EC4899', sizeCode: 'XL', sku: `${newProdSku}-XL`, stock: 4 }
      ]
    };

    onAddProduct(createdProduct);
    setIsAddProductOpen(false);
    setNewProdName('');
    setNewProdSku('');
    setImagePreview(null);
    showToast(`Product "${createdProduct.name}" and image published successfully!`);
  };

  // Flatten variants
  const allVariants: Array<{ product: Product; variant: ProductVariant }> = [];
  products.forEach(p => {
    p.variants.forEach(v => {
      allVariants.push({ product: p, variant: v });
    });
  });

  // Unique customers list extracted from orders
  const customersList = orders.map((o, idx) => ({
    id: `cust-${idx + 1}`,
    name: o.customerName,
    phone: o.customerPhone,
    email: o.customerEmail || 'N/A',
    city: o.city,
    ordersCount: 1,
    totalSpent: o.grandTotal,
    lastOrder: o.orderNumber
  }));

  // Download SQL Database snapshot
  const handleDownloadBackup = () => {
    const backupSql = `-- WOMEN'S FIT E-COMMERCE DATABASE SNAPSHOT
-- Generated: ${new Date().toISOString()}
-- Database: womens_fit_production
-- Currency: Bangladeshi Taka (৳)

SET FOREIGN_KEY_CHECKS = 0;
-- Complete production schema and live tables...
`;
    const blob = new Blob([backupSql], { type: 'application/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `womens_fit_backup_${new Date().toISOString().slice(0,10)}.sql`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database SQL snapshot generated and downloaded!');
  };

  // Standalone Individual Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-stone-200">
          
          <div className="text-center mb-6">
            <div className="text-3xl font-bold tracking-tight text-[#7C3AED] mb-1">
              Women's Fit
            </div>
            <div className="text-xs uppercase tracking-widest font-semibold text-stone-500">
              Administrator Access Portal
            </div>
          </div>

          {loginError && (
            <div className="p-3 mb-4 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
              {loginError}
            </div>
          )}

          <div className="p-3 mb-5 bg-[#FDF2F8] border border-[#FBCFE8] rounded-xl text-xs text-stone-700">
            <div className="font-bold text-[#BE185D] mb-1">Administrator Credentials:</div>
            <div>Username / Email: <code className="font-mono bg-white px-1.5 py-0.5 rounded border text-[#BE185D]">admin@womensfit.com</code></div>
            <div className="mt-1">Password: <code className="font-mono bg-white px-1.5 py-0.5 rounded border text-[#BE185D]">WomensFit@2026</code></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Username / Email</label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin@womensfit.com"
                className="w-full border border-stone-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full border border-stone-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-colors shadow-md"
            >
              Sign In to Management
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-100 text-center">
            <button
              onClick={onExitAdmin}
              className="text-xs text-stone-500 hover:text-stone-900 inline-flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row text-stone-800">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl flex items-center gap-2 border border-stone-700">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SIDEBAR MATCHING BOTH IMAGES EXACTLY */}
      <aside className="w-full md:w-64 bg-white border-r border-stone-200/90 flex flex-col justify-between shrink-0 shadow-sm">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              <div className="text-xl font-bold tracking-tight text-[#7C3AED]">
                Women's Fit
              </div>
              <div className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                Control Console
              </div>
            </div>
          </div>

          {/* Module Navigation Tree */}
          <nav className="p-3 space-y-4 text-xs overflow-y-auto max-h-[calc(100vh-140px)]">
            
            {/* GROUP 1: SALES & FULFILLMENT */}
            <div>
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#38BDF8]">
                Sales & Fulfillment
              </div>
              <div className="space-y-0.5 mt-1">
                <button
                  onClick={() => setActiveModule('orders')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'orders' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 text-[#FF3F6C]" />
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => setActiveModule('abandoned-checkouts')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'abandoned-checkouts' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-stone-500" />
                  <span>Abandoned Checkouts</span>
                </button>
                <button
                  onClick={() => setActiveModule('pos')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'pos' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Receipt className="w-4 h-4 text-stone-500" />
                  <span>Point of Sale</span>
                </button>
                <button
                  onClick={() => setActiveModule('shipping-methods')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'shipping-methods' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Truck className="w-4 h-4 text-stone-500" />
                  <span>Shipping Methods</span>
                </button>
              </div>
            </div>

            {/* GROUP 2: FINANCE & GATEWAYS */}
            <div>
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#38BDF8]">
                Finance & Gateways
              </div>
              <div className="space-y-0.5 mt-1">
                <button
                  onClick={() => setActiveModule('payments')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'payments' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-stone-500" />
                  <span>Payments & Transactions</span>
                </button>
              </div>
            </div>

            {/* GROUP 3: PRODUCT CATALOG */}
            <div>
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#38BDF8]">
                Product Catalog
              </div>
              <div className="space-y-0.5 mt-1">
                <button
                  onClick={() => setActiveModule('products')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'products' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Package className="w-4 h-4 text-stone-500" />
                  <span>Products</span>
                </button>
                <button
                  onClick={() => setActiveModule('variants')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'variants' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Layers className="w-4 h-4 text-stone-500" />
                  <span>Variants & Dimensions</span>
                </button>
                <button
                  onClick={() => setActiveModule('attributes')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'attributes' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <ListChecks className="w-4 h-4 text-stone-500" />
                  <span>Attributes</span>
                </button>
                <button
                  onClick={() => setActiveModule('categories')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'categories' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Tag className="w-4 h-4 text-stone-500" />
                  <span>Categories</span>
                </button>
                <button
                  onClick={() => setActiveModule('brands')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'brands' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Star className="w-4 h-4 text-stone-500" />
                  <span>Brands</span>
                </button>
                <button
                  onClick={() => setActiveModule('inventory')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'inventory' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Warehouse className="w-4 h-4 text-stone-500" />
                  <span>Inventory & SKUs</span>
                </button>
                <button
                  onClick={() => setActiveModule('reviews')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'reviews' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-stone-500" />
                  <span>Reviews Moderation</span>
                </button>
              </div>
            </div>

            {/* GROUP 4: MARKETING & PROMOTIONS */}
            <div>
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#38BDF8]">
                Marketing & Promotions
              </div>
              <div className="space-y-0.5 mt-1">
                <button
                  onClick={() => setActiveModule('coupons')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'coupons' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Ticket className="w-4 h-4 text-stone-500" />
                  <span>Coupons & Discounts</span>
                </button>
                <button
                  onClick={() => setActiveModule('popup-ads')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'popup-ads' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Megaphone className="w-4 h-4 text-stone-500" />
                  <span>Popup Ads</span>
                </button>
              </div>
            </div>

            {/* GROUP 5: STOREFRONT & VISUAL CMS */}
            <div>
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#38BDF8]">
                Storefront & Visual CMS
              </div>
              <div className="space-y-0.5 mt-1">
                <button
                  onClick={() => setActiveModule('promo-banner')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'promo-banner' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#FF3F6C]" />
                    <span>Promo & Seasonal Banner</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${bannerForm.isVisible ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                </button>
                <button
                  onClick={() => setActiveModule('hero-sliders')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'hero-sliders' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-stone-500" />
                  <span>Hero Sliders & Badges</span>
                </button>
                <button
                  onClick={() => setActiveModule('homepage-sections')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'homepage-sections' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 text-stone-500" />
                  <span>Homepage Sections</span>
                </button>
                <button
                  onClick={() => setActiveModule('landing-pages')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'landing-pages' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <FileText className="w-4 h-4 text-stone-500" />
                  <span>Landing Pages</span>
                </button>
                <button
                  onClick={() => setActiveModule('menus')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'menus' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Menu className="w-4 h-4 text-stone-500" />
                  <span>Menus & Navigation</span>
                </button>
                {/* NEW FROM IMAGE 2 */}
                <button
                  onClick={() => setActiveModule('pages-cms')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'pages-cms' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <FileText className="w-4 h-4 text-stone-500" />
                  <span>Pages / Policy CMS</span>
                </button>
                <button
                  onClick={() => setActiveModule('faqs')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'faqs' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-stone-500" />
                  <span>FAQs</span>
                </button>
                <button
                  onClick={() => setActiveModule('features')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'features' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 text-stone-500" />
                  <span>Features</span>
                </button>
                <button
                  onClick={() => setActiveModule('testimonials')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'testimonials' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Quote className="w-4 h-4 text-stone-500" />
                  <span>Testimonials</span>
                </button>
                <button
                  onClick={() => setActiveModule('footer-config')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'footer-config' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Footprints className="w-4 h-4 text-stone-500" />
                  <span>Footer Config</span>
                </button>
              </div>
            </div>

            {/* GROUP 6: CUSTOMERS & ACCESS (NEW FROM IMAGE 2) */}
            <div>
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#38BDF8]">
                Customers & Access
              </div>
              <div className="space-y-0.5 mt-1">
                <button
                  onClick={() => setActiveModule('customers')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'customers' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Users className="w-4 h-4 text-stone-500" />
                  <span>Customers</span>
                </button>
                <button
                  onClick={() => setActiveModule('administrators')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'administrators' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-stone-500" />
                  <span>Administrators</span>
                </button>
                <button
                  onClick={() => setActiveModule('roles-permissions')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'roles-permissions' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-stone-500" />
                  <span>Roles & Permissions</span>
                </button>
                <button
                  onClick={() => setActiveModule('profile-settings')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'profile-settings' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <UserCog className="w-4 h-4 text-stone-500" />
                  <span>Profile Settings</span>
                </button>
              </div>
            </div>

            {/* GROUP 7: SYSTEM & OPERATIONS (NEW FROM IMAGE 2) */}
            <div>
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#38BDF8]">
                System & Operations
              </div>
              <div className="space-y-0.5 mt-1">
                <button
                  onClick={() => setActiveModule('settings')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'settings' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Settings className="w-4 h-4 text-stone-500" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => setActiveModule('integrations-webhooks')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'integrations-webhooks' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Webhook className="w-4 h-4 text-stone-500" />
                  <span>Integrations & Webhooks</span>
                </button>
                <button
                  onClick={() => setActiveModule('telegram-alerts')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'telegram-alerts' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Send className="w-4 h-4 text-stone-500" />
                  <span>Telegram Alerts</span>
                </button>
                <button
                  onClick={() => setActiveModule('notifications')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'notifications' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Bell className="w-4 h-4 text-stone-500" />
                  <span>Notifications</span>
                </button>
                <button
                  onClick={() => setActiveModule('activity-logs')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'activity-logs' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <ClipboardList className="w-4 h-4 text-stone-500" />
                  <span>Activity Logs</span>
                </button>
                <button
                  onClick={() => setActiveModule('cache-management')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'cache-management' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Zap className="w-4 h-4 text-stone-500" />
                  <span>Cache Management</span>
                </button>
                <button
                  onClick={() => setActiveModule('database-backups')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === 'database-backups' ? 'bg-[#FFF1F2] text-[#FF3F6C] font-bold' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Database className="w-4 h-4 text-stone-500" />
                  <span>Database Backups</span>
                </button>
              </div>
            </div>

          </nav>
        </div>

        {/* Footer with Sign Out */}
        <div className="p-4 border-t border-stone-100 flex items-center justify-between">
          <div className="text-[11px] text-stone-500">
            <span>Logged in: <strong>admin</strong></span>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-stone-500 hover:text-red-600 p-1.5 rounded-lg hover:bg-stone-50 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* MAIN MODULE CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        
        {/* Top Bar inside admin */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-stone-200">
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
              Women's Fit Administrator Panel
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 capitalize">
              {activeModule.replace(/-/g, ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {activeModule === 'products' && (
              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product + Image</span>
              </button>
            )}
            {activeModule === 'database-backups' && (
              <button
                onClick={handleDownloadBackup}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Create SQL Backup Now</span>
              </button>
            )}
            <button
              onClick={onExitAdmin}
              className="px-3.5 py-2 bg-white border border-stone-300 hover:border-stone-400 rounded-lg text-xs font-semibold text-stone-700 flex items-center gap-1.5 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </button>
          </div>
        </div>

        {/* 1. ORDERS */}
        {activeModule === 'orders' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex justify-between items-center">
              <div className="font-bold text-sm text-stone-900">Customer Orders ({orders.length})</div>
              <span className="text-xs text-stone-500">All prices in Bangladeshi Taka (৳)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F8] text-stone-500 uppercase text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Destination</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total (৳)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-stone-50/60">
                      <td className="p-4 font-mono font-bold text-stone-900">{o.orderNumber}</td>
                      <td className="p-4 font-semibold text-stone-900">{o.customerName}</td>
                      <td className="p-4 text-stone-600">{o.customerPhone}</td>
                      <td className="p-4 text-stone-600">{o.city}</td>
                      <td className="p-4 text-stone-600">{o.items.length} items</td>
                      <td className="p-4 font-bold text-stone-900 tabular-nums">{formatTaka(o.grandTotal)}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          o.orderStatus === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.orderStatus === 'Cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => { setSelectedOrder(o); setNewStatus(o.orderStatus); }}
                          className="px-3 py-1 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
                        >
                          Fulfill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. ABANDONED CHECKOUTS */}
        {activeModule === 'abandoned-checkouts' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Abandoned Checkouts Recovery</h3>
            <p className="text-xs text-stone-500">Track and dispatch automated recovery messages to customers who left items in bag.</p>
            <div className="border border-stone-200 rounded-xl p-4 text-xs space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                <div>
                  <div className="font-bold text-stone-900">Farzana Haque (01911-223344)</div>
                  <div className="text-stone-500">2 items (Pink Floral Print Dress, Green Co-ord Set) · Subtotal: ৳2,398</div>
                </div>
                <button
                  onClick={() => showToast('Automated recovery SMS and 10% coupon sent to Farzana Haque!')}
                  className="px-3 py-1.5 bg-[#FF3F6C] text-white rounded-lg text-xs font-bold hover:bg-[#E11D48]"
                >
                  Send Recovery Discount
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. POINT OF SALE (POS) */}
        {activeModule === 'pos' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-stone-900">In-Store Point of Sale Cashier</h3>
                <p className="text-xs text-stone-500">Quick terminal for Banani retail store showroom walk-in sales.</p>
              </div>
              <button
                onClick={() => showToast('New retail counter bill initiated!')}
                className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-bold"
              >
                + New In-Store Bill
              </button>
            </div>
            <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl text-stone-500 text-xs">
              <Receipt className="w-8 h-8 mx-auto text-stone-300 mb-2" />
              <span>Barcode scanner ready. Scan any Women's Fit product hangtag.</span>
            </div>
          </div>
        )}

        {/* 4. SHIPPING METHODS */}
        {activeModule === 'shipping-methods' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-stone-900">Courier Shipping Rules (Bangladeshi Taka ৳)</h3>
            <div className="space-y-3 max-w-xl">
              <div className="p-3 border border-stone-200 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-bold text-stone-900">Inside Dhaka Express (24-48 Hours)</div>
                  <div className="text-stone-500">Fixed courier rider rate</div>
                </div>
                <div className="font-bold text-stone-900">৳80.00</div>
              </div>
              <div className="p-3 border border-stone-200 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-bold text-stone-900">Outside Dhaka Courier (All 64 Districts)</div>
                  <div className="text-stone-500">RedX / SteadFast Express partner delivery</div>
                </div>
                <div className="font-bold text-stone-900">৳150.00</div>
              </div>
              <div className="p-3 border border-stone-200 rounded-lg flex justify-between items-center">
                <div>
                  <div className="font-bold text-stone-900">Free Delivery Threshold</div>
                  <div className="text-stone-500">Automatically waives courier fee above this amount</div>
                </div>
                <div className="font-bold text-emerald-700">Orders &gt; ৳1,999.00</div>
              </div>
            </div>
          </div>
        )}

        {/* 5. PAYMENTS & TRANSACTIONS */}
        {activeModule === 'payments' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-stone-900">Payment Gateways & COD Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div className="p-4 border-2 border-emerald-500 rounded-xl bg-emerald-50/40">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-stone-900">Cash on Delivery (COD)</span>
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">ACTIVE</span>
                </div>
                <p className="text-stone-600 text-[11px]">Direct courier collection across Bangladesh.</p>
              </div>
              <div className="p-4 border border-stone-200 rounded-xl bg-stone-50">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-stone-900">bKash / Nagad Direct Pay</span>
                  <span className="bg-stone-300 text-stone-700 text-[10px] font-bold px-2 py-0.5 rounded">READY</span>
                </div>
                <p className="text-stone-500 text-[11px]">Merchant wallet integration support.</p>
              </div>
            </div>
          </div>
        )}

        {/* 6. PRODUCTS (With Image Upload) */}
        {activeModule === 'products' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-stone-100 flex justify-between items-center">
                <div className="font-bold text-sm text-stone-900">Catalog Products ({products.length})</div>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-3.5 py-1.5 bg-[#7C3AED] text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Product with Image
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F8] text-stone-500 uppercase text-[10px] border-b border-stone-200">
                    <tr>
                      <th className="p-4">Photo</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Brand</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Base SKU</th>
                      <th className="p-4">Regular Price</th>
                      <th className="p-4">Sale Price (৳)</th>
                      <th className="p-4">Variants</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-stone-50/50">
                        <td className="p-4">
                          <img
                            src={p.colors[0]?.images[0]}
                            alt={p.name}
                            className="w-12 h-14 object-cover rounded-lg bg-stone-100"
                          />
                        </td>
                        <td className="p-4 font-bold text-stone-900">{p.name}</td>
                        <td className="p-4 font-semibold text-stone-700">{p.brand}</td>
                        <td className="p-4"><span className="bg-stone-100 px-2 py-0.5 rounded text-[11px] font-medium">{p.category}</span></td>
                        <td className="p-4 font-mono text-stone-500">{p.baseSku}</td>
                        <td className="p-4 line-through text-stone-400 tabular-nums">{formatTaka(p.regularPrice)}</td>
                        <td className="p-4 font-bold text-[#FF3F6C] tabular-nums">{formatTaka(p.salePrice || p.regularPrice)}</td>
                        <td className="p-4 text-stone-600">{p.variants.length} combinations</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. VARIANTS & DIMENSIONS */}
        {activeModule === 'variants' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden text-xs">
            <div className="p-4 border-b border-stone-100 font-bold text-sm text-stone-900">
              Variant Dimensions & Inventory Table
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#FAF9F8] text-stone-500 uppercase text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Color</th>
                    <th className="p-4">Size</th>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Dimensions</th>
                    <th className="p-4">Weight</th>
                    <th className="p-4">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {allVariants.slice(0, 15).map(({ product, variant }) => (
                    <tr key={variant.id}>
                      <td className="p-4 font-semibold">{product.name}</td>
                      <td className="p-4 flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: variant.colorHex }} />
                        <span>{variant.colorName}</span>
                      </td>
                      <td className="p-4 font-bold">{variant.sizeCode}</td>
                      <td className="p-4 font-mono text-stone-500">{variant.sku}</td>
                      <td className="p-4 text-stone-500">{variant.dimensions || '30 × 22 × 4 cm'}</td>
                      <td className="p-4 text-stone-500">{variant.weight || '380g'}</td>
                      <td className="p-4 font-bold text-stone-900">{variant.stock} units</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. ATTRIBUTES */}
        {activeModule === 'attributes' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-stone-900">Standard Product Attributes</h3>
            <div className="space-y-4 max-w-xl">
              <div>
                <label className="font-bold text-stone-800 block mb-1">Color Palette Swatches</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: 'Pink Floral', hex: '#F472B6' },
                    { name: 'Olive Sage', hex: '#5E6B4B' },
                    { name: 'Jet Black', hex: '#18181B' },
                    { name: 'Pastel Blue', hex: '#93C5FD' },
                    { name: 'Rose Floral', hex: '#FDA4AF' },
                    { name: 'Soft Lavender', hex: '#C4B5FD' },
                    { name: 'Mustard Yellow', hex: '#FBBF24' },
                    { name: 'Forest Green', hex: '#2D5A27' },
                  ].map(c => (
                    <span key={c.name} className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg flex items-center gap-1.5 font-medium">
                      <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-bold text-stone-800 block mb-1">Standard Size Codes</label>
                <div className="flex gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'].map(s => (
                    <span key={s} className="px-3 py-1 bg-stone-100 rounded font-bold text-stone-800">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. CATEGORIES */}
        {activeModule === 'categories' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-3">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-stone-900">Categories (9 Live on Storefront)</h3>
              <button onClick={() => showToast('New category editor opened!')} className="px-3 py-1 bg-stone-900 text-white rounded text-xs font-bold">+ Add Category</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {['Kurtis', 'Dresses', 'Tops', 'Co-ord Sets', 'Sarees', 'Ethnic Wear', 'Western Wear', 'Accessories', 'Footwear'].map((cat, idx) => (
                <div key={cat} className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-stone-900">{idx + 1}. {cat}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Active</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. BRANDS */}
        {activeModule === 'brands' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900">Verified Brand Partners</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Tokyo Talkies', 'Stylecast X Slyck', 'Roadster', 'Anouk', 'KALINI', 'SASSAFRAS', 'Berrylush', 'Libas', 'Vishudh', 'Kook N Keech', 'Biba', 'Harpa', 'Sangria', 'Zaveri Pearls'].map(b => (
                <div key={b} className="p-3 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900">
                  {b}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. INVENTORY & SKUS */}
        {activeModule === 'inventory' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden text-xs">
            <div className="p-4 border-b border-stone-100 font-bold text-sm text-stone-900 flex justify-between">
              <span>Inventory & Live Stock Levels</span>
              <span className="text-stone-500 font-normal">Atomic decrement upon COD checkout</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#FAF9F8] text-stone-500 uppercase text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="p-4">SKU</th>
                    <th className="p-4">Product Name</th>
                    <th className="p-4">Color</th>
                    <th className="p-4">Size</th>
                    <th className="p-4">Stock Level</th>
                    <th className="p-4 text-right">Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {allVariants.map(({ product, variant }) => (
                    <tr key={variant.id}>
                      <td className="p-4 font-mono font-bold text-stone-900">{variant.sku}</td>
                      <td className="p-4 font-semibold">{product.name}</td>
                      <td className="p-4">{variant.colorName}</td>
                      <td className="p-4 font-bold">{variant.sizeCode}</td>
                      <td className="p-4">
                        {variant.stock === 0 ? (
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">Sold Out</span>
                        ) : variant.stock <= 5 ? (
                          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">Low ({variant.stock})</span>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-bold">Healthy ({variant.stock})</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => onUpdateVariantStock(product.id, variant.id, Math.max(0, variant.stock - 1))}
                            className="w-7 h-7 bg-stone-100 hover:bg-stone-200 rounded font-bold text-stone-800"
                          >
                            −
                          </button>
                          <span className="w-10 text-center font-bold">{variant.stock}</span>
                          <button
                            onClick={() => onUpdateVariantStock(product.id, variant.id, variant.stock + 1)}
                            className="w-7 h-7 bg-stone-100 hover:bg-stone-200 rounded font-bold text-stone-800"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 12. REVIEWS MODERATION */}
        {activeModule === 'reviews' && (() => {
          const allReviews = products.flatMap(p => 
            (p.reviews || []).map(r => ({ ...r, productName: p.name, productId: p.id }))
          );

          return (
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-stone-100">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif">Customer Reviews & Ratings Moderation</h3>
                  <p className="text-stone-500 mt-0.5">
                    Audit customer 5-star ratings, verify buyer feedback, and monitor product satisfaction ({allReviews.length} total reviews).
                  </p>
                </div>
              </div>

              {allReviews.length === 0 ? (
                <div className="p-8 bg-stone-50 rounded-xl text-center text-stone-500 border border-stone-200">
                  No customer reviews have been submitted yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {allReviews.map(r => (
                    <div key={r.id} className="border border-stone-200 rounded-xl p-4 space-y-2 bg-stone-50/50 hover:bg-stone-50 transition-colors">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="font-bold text-stone-900">{r.customerName}</div>
                          <div className="text-[11px] text-[#7C3AED] font-medium">{r.productName}</div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold text-stone-900">
                          <span>{r.rating}.0</span>
                          <span className="text-amber-500">★</span>
                        </div>
                      </div>

                      <p className="text-stone-700 text-xs italic">"{r.comment}"</p>

                      <div className="flex justify-between items-center text-[10px] text-stone-400 pt-1 border-t border-stone-200/60">
                        <span>Posted on: {r.date}</span>
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* 13. COUPONS & DISCOUNTS */}
        {activeModule === 'coupons' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Active Coupons & Discounts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {coupons.map(c => (
                <div key={c.id} className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                  <div className="font-mono font-bold text-stone-900 text-sm">{c.code}</div>
                  <div className="text-stone-600">{c.discountPercent}% Off (Min: {formatTaka(c.minSpend)})</div>
                  <div className="text-stone-400 text-[10px]">Used {c.usageCount} times · Valid to {c.expiryDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 14. PROMO & SEASONAL BANNER CMS */}
        {activeModule === 'promo-banner' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-6">
            
            {/* Header & Status Indicator */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-stone-900 font-serif">Homepage Promo Banner CMS</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    bannerForm.isVisible 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-stone-100 text-stone-600 border border-stone-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${bannerForm.isVisible ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                    <span>{bannerForm.isVisible ? 'Live on Storefront' : 'Hidden / Inactive'}</span>
                  </span>
                </div>
                <p className="text-stone-500 mt-1">
                  Control the promotional announcement banner that sits immediately above the storefront Navbar on the homepage.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleBannerVisibility}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-2 ${
                    bannerForm.isVisible
                      ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <span>{bannerForm.isVisible ? 'Turn OFF Banner' : 'Turn ON Banner'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveBanner()}
                  className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Save & Publish</span>
                </button>
              </div>
            </div>

            {/* REAL-TIME LIVE PREVIEW */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-stone-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Live Storefront Preview</span>
                </label>
                <span className="text-[11px] text-stone-400">
                  {bannerForm.isVisible ? 'Simulating visible state above Navbar' : '⚠️ Banner is currently toggled OFF'}
                </span>
              </div>

              <div className="border border-stone-300 rounded-2xl overflow-hidden shadow-xs bg-stone-100">
                {/* Banner Strip */}
                {bannerForm.isVisible ? (
                  <div
                    className="py-2.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                    style={{
                      backgroundColor: bannerForm.backgroundColor || '#FF3F6C',
                      color: bannerForm.textColor || '#FFFFFF'
                    }}
                  >
                    {bannerForm.badgeText && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 border border-white/30 text-white shrink-0">
                        <Sparkles className="w-3 h-3" />
                        <span>{bannerForm.badgeText}</span>
                      </span>
                    )}
                    <span>{bannerForm.text || 'Enter your announcement text below...'}</span>
                    {bannerForm.linkText && (
                      <span className="font-bold underline cursor-pointer ml-1 inline-flex items-center gap-0.5">
                        <span>{bannerForm.linkText}</span>
                        <span>→</span>
                      </span>
                    )}
                    {bannerForm.allowDismiss && (
                      <span className="ml-auto text-white/70 text-xs px-1">✕</span>
                    )}
                  </div>
                ) : (
                  <div className="py-2.5 px-4 text-center text-xs font-semibold bg-stone-200 text-stone-500 italic">
                    [Promo Banner is Hidden — No banner will appear above the Navbar]
                  </div>
                )}

                {/* Miniature Mock Navbar to show positioning context */}
                <div className="bg-white border-t border-stone-200 px-6 py-3 flex items-center justify-between text-stone-700">
                  <div className="font-bold text-base text-[#7C3AED]">Women's Fit</div>
                  <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-stone-500">
                    <span>WOMEN</span>
                    <span>KURTIS</span>
                    <span>DRESSES</span>
                    <span className="text-[#FF3F6C]">SALE</span>
                  </div>
                  <div className="text-xs text-stone-400">Mock Storefront Header</div>
                </div>
              </div>
            </div>

            {/* QUICK 1-CLICK SEASONAL PRESETS */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <span className="font-bold text-stone-700 uppercase tracking-wider text-[11px] block">
                Quick Seasonal Presets (1-Click Apply)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const preset: PromoBannerConfig = {
                      isVisible: true,
                      text: '✨ SUMMER SALE IS LIVE — UP TO 60% OFF ON BESTSELLERS!',
                      badgeText: 'SUMMER SALE',
                      linkText: 'Shop Now',
                      linkView: 'shop',
                      linkParam: 'sale',
                      backgroundColor: '#FF3F6C',
                      textColor: '#FFFFFF',
                      allowDismiss: true,
                      displayScope: 'home_only'
                    };
                    setBannerForm(preset);
                    handleSaveBanner(preset);
                  }}
                  className="p-2.5 text-left bg-white hover:bg-purple-50 hover:border-purple-300 border border-stone-200 rounded-lg transition-all"
                >
                  <div className="font-bold text-stone-900">Summer Sale</div>
                  <div className="text-[11px] text-stone-500 truncate">60% Off Bestsellers</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const preset: PromoBannerConfig = {
                      isVisible: true,
                      text: '🌙 EID SPECIAL: FLAT 20% OFF ON ALL ETHNIC WEAR & SILKS!',
                      badgeText: 'EID COLLECTION',
                      linkText: 'Use Code: FESTIVE20',
                      linkView: 'shop',
                      linkParam: 'kurtis',
                      backgroundColor: '#7C3AED',
                      textColor: '#FFFFFF',
                      allowDismiss: true,
                      displayScope: 'home_only'
                    };
                    setBannerForm(preset);
                    handleSaveBanner(preset);
                  }}
                  className="p-2.5 text-left bg-white hover:bg-purple-50 hover:border-purple-300 border border-stone-200 rounded-lg transition-all"
                >
                  <div className="font-bold text-stone-900">Eid Festive Special</div>
                  <div className="text-[11px] text-stone-500 truncate">20% Off Ethnic & Silks</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const preset: PromoBannerConfig = {
                      isVisible: true,
                      text: '🚚 FREE NATIONWIDE EXPRESS DELIVERY ON ORDERS OVER ৳1,000!',
                      badgeText: 'FREE SHIPPING',
                      linkText: 'Start Shopping',
                      linkView: 'shop',
                      linkParam: 'all',
                      backgroundColor: '#059669',
                      textColor: '#FFFFFF',
                      allowDismiss: true,
                      displayScope: 'all_pages'
                    };
                    setBannerForm(preset);
                    handleSaveBanner(preset);
                  }}
                  className="p-2.5 text-left bg-white hover:bg-purple-50 hover:border-purple-300 border border-stone-200 rounded-lg transition-all"
                >
                  <div className="font-bold text-stone-900">Free Express Shipping</div>
                  <div className="text-[11px] text-stone-500 truncate">Threshold over ৳1,000</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const preset: PromoBannerConfig = {
                      isVisible: true,
                      text: '⚡ FLASH 48-HOUR CLEARANCE: EXTRA 15% OFF AT CHECKOUT!',
                      badgeText: 'LIMITED TIME',
                      linkText: 'Explore Now',
                      linkView: 'shop',
                      linkParam: 'sale',
                      backgroundColor: '#D97706',
                      textColor: '#FFFFFF',
                      allowDismiss: true,
                      displayScope: 'home_only'
                    };
                    setBannerForm(preset);
                    handleSaveBanner(preset);
                  }}
                  className="p-2.5 text-left bg-white hover:bg-purple-50 hover:border-purple-300 border border-stone-200 rounded-lg transition-all"
                >
                  <div className="font-bold text-stone-900">Flash Clearance</div>
                  <div className="text-[11px] text-stone-500 truncate">Extra 15% Off</div>
                </button>
              </div>
            </div>

            {/* FORM CONFIGURATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Text & Content */}
              <div className="space-y-4">
                
                {/* Visibility Toggle Switch */}
                <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                  <div>
                    <span className="font-bold text-stone-900 block">Banner Visibility</span>
                    <span className="text-[11px] text-stone-500">Toggle whether this announcement is displayed</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBannerForm(prev => ({ ...prev, isVisible: !prev.isVisible }))}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      bannerForm.isVisible ? 'bg-[#7C3AED]' : 'bg-stone-300'
                    }`}
                  >
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      bannerForm.isVisible ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Banner Text Content */}
                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Announcement Offer Text <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={bannerForm.text}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="e.g. ✨ SUMMER SALE IS LIVE — UP TO 60% OFF ON BESTSELLERS!"
                    className="w-full bg-white border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                  />
                  <span className="text-[10px] text-stone-400">
                    Characters: {bannerForm.text.length}. Keep under 100 characters for optimal single-line mobile rendering.
                  </span>
                </div>

                {/* Badge Tag Text */}
                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Offer Badge Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={bannerForm.badgeText || ''}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, badgeText: e.target.value }))}
                    placeholder="e.g. SUMMER SALE, LIMITED TIME, EID SPECIAL"
                    className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                {/* Action Link Text */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-800 block mb-1">
                      Action Link Label
                    </label>
                    <input
                      type="text"
                      value={bannerForm.linkText || ''}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, linkText: e.target.value }))}
                      placeholder="e.g. Shop Now"
                      className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-800 block mb-1">
                      Link Destination
                    </label>
                    <select
                      value={bannerForm.linkParam || 'sale'}
                      onChange={(e) => setBannerForm(prev => ({ 
                        ...prev, 
                        linkView: 'shop', 
                        linkParam: e.target.value 
                      }))}
                      className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#7C3AED]"
                    >
                      <option value="sale">Sale Collection (Discounted)</option>
                      <option value="women">Women's Collection</option>
                      <option value="kurtis">Kurtis & Ethnic</option>
                      <option value="dresses">Dresses</option>
                      <option value="co-ord-sets">Co-ord Sets</option>
                      <option value="sarees">Sarees</option>
                      <option value="all">Full Catalog (All)</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Right Column: Visual Styling & Settings */}
              <div className="space-y-4">
                
                {/* Background Color Presets */}
                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Banner Background Color
                  </label>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {[
                      { name: 'Coral Pink', hex: '#FF3F6C' },
                      { name: 'Royal Violet', hex: '#7C3AED' },
                      { name: 'Emerald', hex: '#059669' },
                      { name: 'Warm Amber', hex: '#D97706' },
                      { name: 'Midnight', hex: '#18181B' },
                      { name: 'Vibrant Indigo', hex: '#4F46E5' }
                    ].map(c => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setBannerForm(prev => ({ ...prev, backgroundColor: c.hex }))}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all ${
                          bannerForm.backgroundColor?.toLowerCase() === c.hex.toLowerCase()
                            ? 'ring-2 ring-stone-900 font-bold'
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bannerForm.backgroundColor || '#FF3F6C'}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-10 h-9 p-0.5 border border-stone-300 rounded-lg cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={bannerForm.backgroundColor || '#FF3F6C'}
                      onChange={(e) => setBannerForm(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      placeholder="#FF3F6C"
                      className="flex-1 bg-white border border-stone-300 rounded-xl p-2 font-mono text-xs text-stone-900"
                    />
                  </div>
                </div>

                {/* Text Color */}
                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Banner Text Color
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setBannerForm(prev => ({ ...prev, textColor: '#FFFFFF' }))}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 ${
                        bannerForm.textColor?.toLowerCase() === '#ffffff'
                          ? 'border-stone-900 bg-stone-100 font-bold'
                          : 'border-stone-200'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white border border-stone-400" />
                      <span>White (#FFFFFF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerForm(prev => ({ ...prev, textColor: '#18181B' }))}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 ${
                        bannerForm.textColor?.toLowerCase() === '#18181b'
                          ? 'border-stone-900 bg-stone-100 font-bold'
                          : 'border-stone-200'
                      }`}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-stone-900" />
                      <span>Dark (#18181B)</span>
                    </button>
                  </div>
                </div>

                {/* Display Scope Selector */}
                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Display Scope
                  </label>
                  <select
                    value={bannerForm.displayScope || 'home_only'}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, displayScope: e.target.value as 'home_only' | 'all_pages' }))}
                    className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#7C3AED]"
                  >
                    <option value="home_only">Homepage Only (Sits above Navbar on Home)</option>
                    <option value="all_pages">All Storefront Pages (Sit above Navbar everywhere)</option>
                  </select>
                </div>

                {/* Allow Customer to Dismiss */}
                <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                  <div>
                    <span className="font-bold text-stone-900 block">Close Button</span>
                    <span className="text-[11px] text-stone-500">Allow customers to dismiss banner with 'X'</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={bannerForm.allowDismiss !== false}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, allowDismiss: e.target.checked }))}
                    className="w-4 h-4 text-[#7C3AED] rounded"
                  />
                </div>

              </div>

            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setBannerForm(DEFAULT_PROMO_BANNER);
                  handleSaveBanner(DEFAULT_PROMO_BANNER);
                }}
                className="text-stone-500 hover:text-stone-800 underline text-xs cursor-pointer"
              >
                Reset to Default Preset
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleBannerVisibility}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 hover:bg-stone-50 font-semibold text-xs cursor-pointer"
                >
                  {bannerForm.isVisible ? 'Hide from Store' : 'Make Active'}
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveBanner()}
                  className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Save & Publish Changes
                </button>
              </div>
            </div>

          </div>
        )}

        {/* 14. POPUP ADS */}
        {activeModule === 'popup-ads' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900">Storefront Promotional Popups</h3>
            <div className="p-4 border border-stone-200 rounded-xl max-w-md bg-stone-50">
              <div className="font-bold text-stone-900">Summer Sale Announcement Banner</div>
              <div className="text-stone-500 mt-1">Status: <strong className="text-emerald-600">Active on top bar</strong></div>
              <div className="mt-2 text-[11px] bg-white p-2 rounded border border-stone-200">
                ✨ SUMMER SALE IS LIVE — UP TO 60% OFF ON BESTSELLERS!
              </div>
            </div>
          </div>
        )}

        {/* 15. HERO SLIDERS & BADGES */}
        {activeModule === 'hero-sliders' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900">Hero Slide Content & Discount Tags</h3>
            <div className="p-4 border border-stone-200 rounded-xl max-w-lg space-y-2 bg-stone-50">
              <div>Headline: <strong>Elevated Styles For Every You</strong></div>
              <div>Subtitle: <strong>Fresh fits, trending now!</strong></div>
              <div>Offer Tag: <strong className="text-[#FF3F6C]">Up to 50% OFF</strong></div>
              <div>Buttons: <strong>[SHOP NOW] [EXPLORE]</strong></div>
            </div>
          </div>
        )}

        {/* 16. HOMEPAGE SECTIONS */}
        {activeModule === 'homepage-sections' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900">Homepage Layout Section Ordering</h3>
            <div className="space-y-2 max-w-md">
              {['1. Top Announcement Bar', '2. Header & Main Navigation', '3. Hero Campaign Slider', '4. 9 Category Badges Strip', '5. 3 Promotional Editorial Banners', '6. Trending Now Product Grid', '7. 5-Column Value Proposition Bar', '8. Best Sellers Product Grid', '9. Follow Us on Instagram @womensfit', '10. Stay in the Loop Newsletter', '11. 4-Column Footer'].map(sec => (
                <div key={sec} className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg font-medium text-stone-800">
                  {sec}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 17. LANDING PAGES */}
        {activeModule === 'landing-pages' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900">Landing Pages Manager</h3>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {['Summer Festive Edit', 'Festive Silk Collection', 'Athleisure & Fitness Lookbook'].map(pg => (
                <div key={pg} className="p-3 bg-stone-50 border border-stone-200 rounded-lg font-bold text-stone-800 flex justify-between items-center">
                  <span>{pg}</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Published</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 18. MENUS & NAVIGATION */}
        {activeModule === 'menus' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-3">
            <h3 className="text-sm font-bold text-stone-900">Header Navigation Menu Items</h3>
            <div className="flex flex-wrap gap-2 max-w-xl">
              {['WOMEN', 'MEN', 'KIDS', 'BEAUTY', 'HOME & LIVING', 'NEW IN', 'SALE'].map(m => (
                <span key={m} className="px-3 py-1.5 bg-stone-100 rounded-lg font-bold text-stone-800 border border-stone-200">
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 19. PAGES / POLICY CMS (NEW MODULE) */}
        {activeModule === 'pages-cms' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Pages / Policy CMS</h3>
                <p className="text-stone-500">Manage legal, terms, and customer care policy contents.</p>
              </div>
              <button onClick={() => showToast('New policy article template initialized!')} className="px-3 py-1.5 bg-stone-900 text-white rounded-lg font-bold">+ New Policy Page</button>
            </div>
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
              {[
                { title: '15 Days Doorstep Return & Exchange Policy', slug: '/policies/return-policy', updated: 'Yesterday' },
                { title: 'Nationwide Courier & Shipping Terms', slug: '/policies/shipping-policy', updated: '3 days ago' },
                { title: 'Privacy Policy & Customer Data Protection', slug: '/policies/privacy-policy', updated: '1 week ago' },
                { title: 'Terms & Conditions of Service', slug: '/policies/terms-conditions', updated: '2 weeks ago' },
                { title: 'About Women\'s Fit Brand Heritage', slug: '/about-us', updated: '1 month ago' },
              ].map(p => (
                <div key={p.slug} className="p-3.5 flex justify-between items-center hover:bg-stone-50">
                  <div>
                    <div className="font-bold text-stone-900">{p.title}</div>
                    <div className="font-mono text-stone-400 text-[10px]">{p.slug}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-stone-400 text-[11px]">Updated {p.updated}</span>
                    <button onClick={() => showToast(`Loaded ${p.title} in visual editor.`)} className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded text-stone-700 font-semibold">Edit Content</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 20. FAQS (NEW MODULE) */}
        {activeModule === 'faqs' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Frequently Asked Questions (FAQ)</h3>
                <p className="text-stone-500">Live questions answered on customer care pages.</p>
              </div>
              <button 
                onClick={() => {
                  const q = prompt('Enter FAQ Question:');
                  if (q) {
                    setFaqs(prev => [...prev, { id: `f-${Date.now()}`, question: q, answer: 'Answer under review.', category: 'General' }]);
                    showToast('New FAQ added successfully!');
                  }
                }}
                className="px-3 py-1.5 bg-[#7C3AED] text-white rounded-lg font-bold"
              >
                + Add FAQ
              </button>
            </div>
            <div className="space-y-3">
              {faqs.map(f => (
                <div key={f.id} className="p-4 border border-stone-200 rounded-xl space-y-1 bg-stone-50/50">
                  <div className="flex justify-between">
                    <span className="font-bold text-stone-900">{f.question}</span>
                    <span className="bg-stone-200 px-2 py-0.5 rounded text-[10px] font-semibold text-stone-700">{f.category}</span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 21. FEATURES (NEW MODULE) */}
        {activeModule === 'features' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Value Proposition Features</h3>
            <p className="text-stone-500">Configure the 5 prominent trust markers displayed across the storefront.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: '100% Original Products', sub: 'Verified premium fabrications', icon: 'ShieldCheck' },
                { title: 'Easy Returns', sub: '15 Days Doorstep Return Policy', icon: 'RotateCcw' },
                { title: 'Free Delivery', sub: 'On Orders Above ৳1,999 Nationwide', icon: 'Truck' },
                { title: 'Secure Payments', sub: '100% Safe Cash on Delivery', icon: 'Lock' },
                { title: '24x7 Support', sub: 'Dedicated Phone & WhatsApp Assistance', icon: 'Headphones' },
              ].map(ft => (
                <div key={ft.title} className="p-3.5 border border-stone-200 rounded-xl bg-stone-50 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-stone-900">{ft.title}</div>
                    <div className="text-stone-500 text-[11px]">{ft.sub}</div>
                  </div>
                  <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px]">Active</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 22. TESTIMONIALS (NEW MODULE) */}
        {activeModule === 'testimonials' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Customer Testimonials & Proof</h3>
                <p className="text-stone-500">Verified shopper quotes displayed on product and campaign pages.</p>
              </div>
              <button onClick={() => showToast('New testimonial draft form ready.')} className="px-3 py-1.5 bg-stone-900 text-white rounded-lg font-bold">+ Add Testimonial</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {testimonials.map(t => (
                <div key={t.id} className="p-4 border border-stone-200 rounded-xl bg-stone-50 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-stone-900">{t.name}</span>
                      <span className="text-amber-500 font-bold">★★★★★</span>
                    </div>
                    <div className="text-[10px] text-stone-400 mb-2">{t.role}</div>
                    <p className="text-stone-700 italic">"{t.quote}"</p>
                  </div>
                  <div className="pt-2 border-t border-stone-200/60 flex justify-between items-center">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">{t.status}</span>
                    <button onClick={() => showToast(`Toggled visibility for ${t.name}`)} className="text-stone-500 hover:text-stone-900 text-[11px]">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 23. FOOTER CONFIG (NEW MODULE) */}
        {activeModule === 'footer-config' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Footer Configuration & Social Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="font-bold text-stone-800 block mb-1">Instagram Handle</label>
                <input type="text" readOnly value="@womensfit" className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="font-bold text-stone-800 block mb-1">Customer Support Hotline</label>
                <input type="text" readOnly value="+880 1711-000000" className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="font-bold text-stone-800 block mb-1">Copyright Line</label>
                <input type="text" readOnly value={`© ${new Date().getFullYear()} Women's Fit. All Rights Reserved.`} className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="font-bold text-stone-800 block mb-1">Accepted Payment Icons</label>
                <div className="p-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-700">
                  VISA, Mastercard, bKash, Nagad, Cash on Delivery
                </div>
              </div>
            </div>
            <button onClick={() => showToast('Footer configuration saved.')} className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg font-bold">Save Footer Configuration</button>
          </div>
        )}

        {/* 24. CUSTOMERS (NEW MODULE) */}
        {activeModule === 'customers' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden text-xs">
            <div className="p-4 border-b border-stone-100 flex justify-between items-center">
              <div className="font-bold text-sm text-stone-900">Registered & Guest Customers ({customersList.length})</div>
              <span className="text-stone-500">Auto-created upon order placement</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#FAF9F8] text-stone-500 uppercase text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Contact Phone</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">City</th>
                    <th className="p-4">Orders</th>
                    <th className="p-4">Total Spent</th>
                    <th className="p-4">Last Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customersList.map(c => (
                    <tr key={c.id}>
                      <td className="p-4 font-bold text-stone-900">{c.name}</td>
                      <td className="p-4 font-mono text-stone-600">{c.phone}</td>
                      <td className="p-4 text-stone-600">{c.email}</td>
                      <td className="p-4 text-stone-600">{c.city}</td>
                      <td className="p-4 font-bold">{c.ordersCount}</td>
                      <td className="p-4 font-bold text-stone-900 tabular-nums">{formatTaka(c.totalSpent)}</td>
                      <td className="p-4 font-mono text-stone-500">{c.lastOrder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 25. ADMINISTRATORS (NEW MODULE) */}
        {activeModule === 'administrators' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Administrator Accounts & Access</h3>
                <p className="text-stone-500">Authorized personnel who can access this management console.</p>
              </div>
              <button 
                onClick={() => {
                  const email = prompt('Enter staff email to invite:');
                  if (email) {
                    setAdminsList(prev => [...prev, { id: `a-${Date.now()}`, name: email.split('@')[0], email, role: 'Store Manager', status: 'Invited', lastLogin: 'Never' }]);
                    showToast(`Invitation sent to ${email}`);
                  }
                }}
                className="px-3 py-1.5 bg-[#7C3AED] text-white rounded-lg font-bold"
              >
                + Add Administrator
              </button>
            </div>
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#FAF9F8] text-stone-500 uppercase text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {adminsList.map(a => (
                    <tr key={a.id}>
                      <td className="p-3.5 font-bold text-stone-900">{a.name}</td>
                      <td className="p-3.5 text-stone-600">{a.email}</td>
                      <td className="p-3.5"><span className="bg-stone-100 px-2 py-0.5 rounded font-semibold text-stone-700">{a.role}</span></td>
                      <td className="p-3.5"><span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">{a.status}</span></td>
                      <td className="p-3.5 text-stone-500">{a.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 26. ROLES & PERMISSIONS (NEW MODULE) */}
        {activeModule === 'roles-permissions' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Roles & Access Control Matrix (RBAC)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { role: 'Super Admin', desc: 'Full unfettered access across products, orders, settings, and database backups.', members: 1 },
                { role: 'Store Manager', desc: 'Can manage catalog products, variant inventory, and process orders.', members: 1 },
                { role: 'Fulfillment Staff', desc: 'Restricted strictly to order status transitions, shipping packing slips, and stock updates.', members: 1 }
              ].map(r => (
                <div key={r.role} className="p-4 border border-stone-200 rounded-xl bg-stone-50 space-y-2">
                  <div className="font-bold text-stone-900 text-sm">{r.role}</div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">{r.desc}</p>
                  <div className="text-[10px] text-stone-400 font-semibold">{r.members} Active User(s)</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 27. PROFILE SETTINGS (NEW MODULE) */}
        {activeModule === 'profile-settings' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Administrator Profile Credentials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              <div>
                <label className="font-bold text-stone-800 block mb-1">Admin Email</label>
                <input type="email" readOnly value="admin@womensfit.com" className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="font-bold text-stone-800 block mb-1">Full Name</label>
                <input type="text" readOnly value="Store Director" className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="font-bold text-stone-800 block mb-1">Current Password</label>
                <input type="password" readOnly value="WomensFit@2026" className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono" />
              </div>
              <div>
                <label className="font-bold text-stone-800 block mb-1">Two-Factor Authentication (2FA)</label>
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-bold">Enabled (App Authenticator)</div>
              </div>
            </div>
            <button onClick={() => showToast('Profile settings saved.')} className="px-4 py-2 bg-stone-900 text-white rounded-lg font-bold">Save Profile Changes</button>
          </div>
        )}

        {/* 28. SETTINGS */}
        {activeModule === 'settings' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-6 text-xs">
            <div>
              <h3 className="text-sm font-bold text-stone-900">General Store Configuration</h3>
              <p className="text-stone-500 mt-0.5">Global parameters, contact details, and seasonal promotional banner display.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Store Brand Name</label>
                <input type="text" readOnly value="Women's Fit" className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-bold" />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Currency Standard</label>
                <input type="text" readOnly value="Bangladeshi Taka (৳) - BDT" className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-bold" />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Support Email</label>
                <input type="email" readOnly value="concierge@womensfit.com" className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Hotline</label>
                <input type="text" readOnly value="+880 1711-000000" className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2" />
              </div>
            </div>

            {/* Promo Banner Quick Toggle in Settings */}
            <div className="pt-6 border-t border-stone-200 max-w-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF3F6C]" />
                    <span>Homepage Seasonal Promo Banner</span>
                  </h4>
                  <p className="text-stone-500 text-[11px] mt-0.5">
                    Controls the seasonal promotion banner sitting above the Navbar on the homepage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleToggleBannerVisibility}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    bannerForm.isVisible
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {bannerForm.isVisible ? '✓ Visible on Homepage' : 'Hidden'}
                </button>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Banner Announcement Text
                  </label>
                  <input
                    type="text"
                    value={bannerForm.text}
                    onChange={(e) => setBannerForm(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Enter seasonal offer text..."
                    className="w-full bg-white border border-stone-300 rounded-lg p-2 text-xs text-stone-900 font-medium"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveModule('promo-banner')}
                    className="text-xs font-bold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Full Promo Banner Studio (Colors, Badges & Links)</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveBanner()}
                    className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Save Banner Settings
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 29. INTEGRATIONS & WEBHOOKS (NEW MODULE) */}
        {activeModule === 'integrations-webhooks' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Courier Webhooks & API Keys</h3>
            <div className="space-y-3 max-w-xl">
              <div className="p-3 border border-stone-200 rounded-lg bg-stone-50">
                <div className="font-bold text-stone-900">RedX Logistics Webhook</div>
                <div className="font-mono text-stone-500 text-[10px]">https://womensfit.com/api/webhooks/redx</div>
                <div className="text-[10px] text-emerald-700 font-bold mt-1">● Connected (Live Sync)</div>
              </div>
              <div className="p-3 border border-stone-200 rounded-lg bg-stone-50">
                <div className="font-bold text-stone-900">SteadFast Courier API</div>
                <div className="font-mono text-stone-500 text-[10px]">API Key: stdf_live_89182390192</div>
                <div className="text-[10px] text-emerald-700 font-bold mt-1">● Connected (Live Tracking)</div>
              </div>
            </div>
            <button onClick={() => showToast('Sent ping to courier webhook: Status 200 OK')} className="px-4 py-2 bg-stone-900 text-white rounded-lg font-bold">Test Webhook Ping</button>
          </div>
        )}

        {/* 30. TELEGRAM ALERTS (NEW MODULE) */}
        {activeModule === 'telegram-alerts' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Telegram Bot Order Notifications</h3>
            <p className="text-stone-500">Receive instant push notifications on your phone whenever a customer places an order.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
              <div>
                <label className="font-bold text-stone-800 block mb-1">Telegram Bot Token</label>
                <input type="text" value={telegramBotToken} onChange={e => setTelegramBotToken(e.target.value)} className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono" />
              </div>
              <div>
                <label className="font-bold text-stone-800 block mb-1">Telegram Chat ID</label>
                <input type="text" value={telegramChatId} onChange={e => setTelegramChatId(e.target.value)} className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => showToast('Test Telegram notification dispatched: "New Order WF-20261003-9182 for ৳2,499"')} className="px-4 py-2 bg-[#7C3AED] text-white rounded-lg font-bold">Send Test Telegram Alert</button>
            </div>
          </div>
        )}

        {/* 31. NOTIFICATIONS (NEW MODULE) */}
        {activeModule === 'notifications' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">System Activity & Operational Alerts</h3>
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
              {[
                { title: 'New Order Received', desc: 'Order WF-20261003-1042 placed by Tanzila Ahmed (৳2,398 COD)', time: '10 mins ago', type: 'order' },
                { title: 'Low Stock Alert', desc: 'Variant Pink Floral Print Dress (Size XXL) is sold out (0 units remaining).', time: '1 hour ago', type: 'stock' },
                { title: 'Courier Handover Complete', desc: 'Parcel WF-20261003-8821 dispatched with RedX tracking RDX-88291.', time: '3 hours ago', type: 'shipping' },
                { title: 'New Customer Review', desc: 'Nazia Khan rated 5.0 stars for Tokyo Talkies Dress.', time: 'Yesterday', type: 'review' }
              ].map((n, i) => (
                <div key={i} className="p-3.5 flex justify-between items-center hover:bg-stone-50">
                  <div>
                    <div className="font-bold text-stone-900">{n.title}</div>
                    <div className="text-stone-600 text-[11px]">{n.desc}</div>
                  </div>
                  <span className="text-[10px] text-stone-400">{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 32. ACTIVITY LOGS (NEW MODULE) */}
        {activeModule === 'activity-logs' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Audit Trail & Staff Activity Logs</h3>
            <div className="border border-stone-200 rounded-xl overflow-hidden font-mono text-[11px]">
              {[
                { time: '2026-10-03 11:45:12', user: 'admin@womensfit.com', action: 'ORDER_STATUS_UPDATE', detail: 'Order WF-20261003-1042 updated to Confirmed' },
                { time: '2026-10-03 11:20:04', user: 'Customer (Tanzila)', action: 'CHECKOUT_ORDER_CREATE', detail: 'Created order WF-20261003-1042 for ৳2,398' },
                { time: '2026-10-03 09:30:15', user: 'admin@womensfit.com', action: 'DISPATCH_TRACKING', detail: 'Set RedX tracking RDX-88291 for order WF-20261003-8821' },
                { time: '2026-10-03 08:15:00', user: 'admin@womensfit.com', action: 'ADMIN_LOGIN_SUCCESS', detail: 'Session authenticated from IP 103.112.44.12' }
              ].map((log, idx) => (
                <div key={idx} className="p-3 flex justify-between border-b border-stone-100 last:border-b-0 hover:bg-stone-50">
                  <div>
                    <span className="text-stone-400">[{log.time}]</span> <strong className="text-stone-800">{log.user}</strong>: <span className="text-[#7C3AED] font-bold">{log.action}</span> — {log.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 33. CACHE MANAGEMENT (NEW MODULE) */}
        {activeModule === 'cache-management' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Server & Application Cache Controls</h3>
            <p className="text-stone-500">Purge stale in-memory cached files and rebuild dynamic queries for high-traffic campaigns.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              <div className="p-4 border border-stone-200 rounded-xl bg-stone-50 space-y-2">
                <div className="font-bold text-stone-900">Catalog & Query Cache</div>
                <div className="text-[11px] text-stone-500">Cached product variations and category trees.</div>
                <button onClick={() => showToast('Product catalog cache cleared successfully!')} className="px-3 py-1.5 bg-stone-900 text-white rounded font-bold">Clear Catalog Cache</button>
              </div>
              <div className="p-4 border border-stone-200 rounded-xl bg-stone-50 space-y-2">
                <div className="font-bold text-stone-900">Image Thumbnail Cache</div>
                <div className="text-[11px] text-stone-500">Resized WebP and JPEG thumbnail buffers.</div>
                <button onClick={() => showToast('Thumbnail cache rebuilt!')} className="px-3 py-1.5 bg-stone-900 text-white rounded font-bold">Purge Thumbnails</button>
              </div>
            </div>
          </div>
        )}

        {/* 34. DATABASE BACKUPS (NEW MODULE) */}
        {activeModule === 'database-backups' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 text-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Database Snapshots & SQL Backups</h3>
                <p className="text-stone-500">Automated daily backups and on-demand SQL dump exports.</p>
              </div>
              <button onClick={handleDownloadBackup} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow">
                <Download className="w-4 h-4" /> Download Live SQL Backup
              </button>
            </div>
            <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 max-w-xl space-y-2">
              <div className="flex justify-between">
                <span>Last Automated Backup:</span>
                <strong className="text-stone-900">Today at 04:00 AM (2.4 MB)</strong>
              </div>
              <div className="flex justify-between">
                <span>Backup Storage:</span>
                <strong className="text-stone-900">Secure Private Cloud Storage (Banani Datacenter)</strong>
              </div>
              <div className="flex justify-between">
                <span>Integrity Verification:</span>
                <strong className="text-emerald-700 font-bold">✓ SHA-256 Checksum Verified</strong>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MANAGE ORDER MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex justify-between items-start border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900">Order {selectedOrder.orderNumber}</h3>
                <div className="text-xs text-stone-500">Placed on {selectedOrder.createdAt}</div>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-stone-400 hover:text-stone-900 text-sm font-bold">✕</button>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
              <div><strong>Recipient:</strong> {selectedOrder.customerName} ({selectedOrder.customerPhone})</div>
              <div><strong>Address:</strong> {selectedOrder.deliveryAddress}, {selectedOrder.area}, {selectedOrder.city}</div>
              <div><strong>Payment:</strong> {selectedOrder.paymentMethod} — Total: <strong className="text-stone-900">{formatTaka(selectedOrder.grandTotal)}</strong></div>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto">
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2 bg-stone-50/70 rounded-lg border border-stone-100">
                  <div className="flex items-center gap-2">
                    <img src={it.image} alt={it.name} className="w-10 h-12 object-cover rounded" />
                    <div>
                      <div className="font-semibold text-stone-900">{it.name}</div>
                      <div className="text-stone-500 text-[11px]">{it.colorName} · Size {it.sizeCode} (Qty: {it.quantity})</div>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900">{formatTaka(it.subtotal)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Update Status</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full border border-stone-300 rounded-lg p-2 text-xs font-semibold text-stone-900"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Status Audit Note</label>
                  <input
                    type="text"
                    value={statusComment}
                    onChange={e => setStatusComment(e.target.value)}
                    placeholder="e.g. Courier RedX Tracking: RDX-9021"
                    className="w-full border border-stone-300 rounded-lg p-2 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setSelectedOrder(null)} className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg text-xs">Cancel</button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateOrderStatus(selectedOrder.id, newStatus, statusComment || `Status updated to ${newStatus}`);
                    setSelectedOrder(null);
                    showToast(`Order status updated to ${newStatus}`);
                  }}
                  className="px-5 py-2 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800"
                >
                  Save Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL WITH IMAGE UPLOAD */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h3 className="font-bold text-base text-stone-900">Add New Product & Upload Image</h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-stone-400 hover:text-stone-900 text-sm font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-stone-800 mb-1">Product Photo Upload *</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-24 rounded-lg border-2 border-dashed border-stone-300 bg-stone-50 flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview || uploadedImageUrl ? (
                      <img src={imagePreview || uploadedImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-stone-400" />
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="block w-full text-xs text-stone-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#7C3AED] file:text-white hover:file:bg-[#6D28D9] cursor-pointer"
                    />
                    <input
                      type="url"
                      value={uploadedImageUrl}
                      onChange={e => setUploadedImageUrl(e.target.value)}
                      placeholder="Or paste external image URL..."
                      className="w-full border border-stone-300 rounded p-1.5 text-xs text-stone-800"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Product Title *</label>
                  <input type="text" required value={newProdName} onChange={e => setNewProdName(e.target.value)} placeholder="e.g. Lavender Georgette Anarkali" className="w-full border border-stone-300 rounded p-2 text-xs" />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Brand *</label>
                  <input type="text" required value={newProdBrand} onChange={e => setNewProdBrand(e.target.value)} placeholder="e.g. Tokyo Talkies, Libas" className="w-full border border-stone-300 rounded p-2 text-xs" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                  <select value={newProdCategory} onChange={e => setNewProdCategory(e.target.value)} className="w-full border border-stone-300 rounded p-2 text-xs">
                    <option value="Kurtis">Kurtis</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Tops">Tops</option>
                    <option value="Co-ord Sets">Co-ord Sets</option>
                    <option value="Sarees">Sarees</option>
                    <option value="Ethnic Wear">Ethnic Wear</option>
                    <option value="Western Wear">Western Wear</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Base SKU *</label>
                  <input type="text" required value={newProdSku} onChange={e => setNewProdSku(e.target.value)} placeholder="WF-KRT-10" className="w-full border border-stone-300 rounded p-2 text-xs font-mono" />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Sale Price (৳) *</label>
                  <input type="number" required value={newProdSalePrice} onChange={e => setNewProdSalePrice(e.target.value)} placeholder="1299" className="w-full border border-stone-300 rounded p-2 text-xs" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Description</label>
                <textarea rows={2} value={newProdDesc} onChange={e => setNewProdDesc(e.target.value)} placeholder="Fabric composition, fit and care notes..." className="w-full border border-stone-300 rounded p-2 text-xs" />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
                <button type="button" onClick={() => setIsAddProductOpen(false)} className="px-4 py-2 border border-stone-300 rounded text-xs font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded text-xs font-bold">Save & Publish Product</button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
