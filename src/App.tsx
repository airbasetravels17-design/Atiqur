import React, { useState, useEffect } from 'react';
import { Product, ProductVariant, CartItem, Order, OrderStatus, ProductReview, PromoBannerConfig, DEFAULT_PROMO_BANNER } from './types/ecommerce';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/products';
import { PromoBanner } from './components/PromoBanner';
import { Navbar } from './components/Navbar';
import { HeroCampaign } from './components/HeroCampaign';
import { FeaturedSections } from './components/FeaturedSections';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { ShopCatalogView } from './components/ShopCatalogView';
import { WishlistView } from './components/WishlistView';
import { MyOrdersView } from './components/MyOrdersView';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';

export function App() {
  // Global catalog & variant state
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('_wf_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map(p => {
          const init = INITIAL_PRODUCTS.find(ip => ip.id === p.id);
          if ((!p.reviews || p.reviews.length === 0) && init?.reviews && init.reviews.length > 0) {
            return { ...p, reviews: init.reviews };
          }
          return p;
        });
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('_wf_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('_wf_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Persistent Wishlist state using localStorage
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('_wf_wishlist');
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse wishlist from localStorage:', e);
    }
    return [];
  });

  // Promotional Seasonal Banner configuration state
  const [promoBanner, setPromoBanner] = useState<PromoBannerConfig>(() => {
    try {
      const saved = localStorage.getItem('_wf_promo_banner');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.isVisible === 'boolean') {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse promo banner from localStorage:', e);
    }
    return DEFAULT_PROMO_BANNER;
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('_wf_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('_wf_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('_wf_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('_wf_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to persist wishlist to localStorage:', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('_wf_promo_banner', JSON.stringify(promoBanner));
    } catch (e) {
      console.error('Failed to persist promo banner to localStorage:', e);
    }
  }, [promoBanner]);

  // Wishlist toggle handler
  const handleToggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Explicit remove from wishlist handler
  const handleRemoveFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(id => id !== productId));
  };

  const handleClearWishlist = () => {
    setWishlist([]);
  };

  // Current view navigation: 'home' | 'shop' | 'checkout' | 'confirmation' | 'track' | 'wishlist' | 'admin'
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.pathname.includes('/admin') || url.searchParams.get('view') === 'admin' || window.location.hash === '#admin') {
        return 'admin';
      }
      if (url.searchParams.get('view') === 'wishlist' || window.location.hash === '#wishlist') {
        return 'wishlist';
      }
      if (url.searchParams.get('view') === 'my-orders' || url.searchParams.get('view') === 'orders' || window.location.hash === '#my-orders' || window.location.hash === '#orders') {
        return 'my-orders';
      }
    }
    return 'home';
  });

  const [viewParam, setViewParam] = useState<string | undefined>(undefined);

  // Secret admin route listener & keyboard shortcut (Alt+A or Ctrl+Shift+A) for admin individual access
  useEffect(() => {
    const handleHashOrPop = () => {
      const url = new URL(window.location.href);
      if (url.pathname.includes('/admin') || url.searchParams.get('view') === 'admin' || window.location.hash === '#admin') {
        setCurrentView('admin');
      }
    };

    const handleKeyShortcut = (e: KeyboardEvent) => {
      // Secret key for admin login: Ctrl + Shift + A or Alt + A
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        setCurrentView('admin');
        window.history.pushState(null, '', '#admin');
      }
    };

    window.addEventListener('hashchange', handleHashOrPop);
    window.addEventListener('popstate', handleHashOrPop);
    window.addEventListener('keydown', handleKeyShortcut);

    return () => {
      window.removeEventListener('hashchange', handleHashOrPop);
      window.removeEventListener('popstate', handleHashOrPop);
      window.removeEventListener('keydown', handleKeyShortcut);
    };
  }, []);

  // Active PDP Modal
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const [modalColorId, setModalColorId] = useState<string | undefined>(undefined);

  // Deep-linking: auto-open PDP if URL has ?product=... or #product=... (from WhatsApp/Facebook shared links)
  useEffect(() => {
    const handleUrlProductCheck = () => {
      if (typeof window === 'undefined') return;
      try {
        const url = new URL(window.location.href);
        const prodParam = url.searchParams.get('product') || 
          (window.location.hash.startsWith('#product=') ? window.location.hash.replace('#product=', '') : null);
        const colorParam = url.searchParams.get('color');

        if (prodParam) {
          const match = products.find(p => p.id === prodParam || p.slug === prodParam);
          if (match) {
            setModalProduct(match);
            if (colorParam) {
              setModalColorId(colorParam);
            }
          }
        }
      } catch (e) {
        console.error('Error parsing product URL param:', e);
      }
    };

    handleUrlProductCheck();
    window.addEventListener('popstate', handleUrlProductCheck);
    window.addEventListener('hashchange', handleUrlProductCheck);

    return () => {
      window.removeEventListener('popstate', handleUrlProductCheck);
      window.removeEventListener('hashchange', handleUrlProductCheck);
    };
  }, [products]);

  // Cart Drawer State
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);

  // Newly placed order for confirmation screen
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Tracking query state
  const [trackQuery, setTrackQuery] = useState<{ orderNumber: string; phone: string }>({ orderNumber: '', phone: '' });

  // Cart count
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Handlers
  const handleOpenProduct = (product: Product, preselectedColorId?: string) => {
    setModalProduct(product);
    setModalColorId(preselectedColorId);
  };

  const handleAddToCart = (variant: ProductVariant, quantity: number, colorImage: string) => {
    const product = products.find(p => p.id === variant.productId);
    if (!product) return;

    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => item.variantId === variant.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const newQty = Math.min(variant.stock, updated[existingIdx].quantity + quantity);
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          image: colorImage || updated[existingIdx].image
        };
        return updated;
      } else {
        const newItem: CartItem = {
          variantId: variant.id,
          productId: product.id,
          name: product.name,
          brand: product.brand,
          slug: product.slug,
          colorName: variant.colorName,
          colorHex: variant.colorHex,
          sizeCode: variant.sizeCode,
          unitPrice: variant.priceOverride || product.salePrice || product.regularPrice,
          quantity: Math.min(variant.stock, quantity),
          maxStock: variant.stock,
          image: colorImage || product.colors[0]?.images[0] || ''
        };
        return [...prev, newItem];
      }
    });
  };

  const handleBuyNow = (variant: ProductVariant, quantity: number, colorImage: string) => {
    handleAddToCart(variant, quantity, colorImage);
    setCurrentView('checkout');
  };

  const handleUpdateCartQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(variantId);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.variantId === variantId) {
        return { ...item, quantity: Math.min(item.maxStock, quantity) };
      }
      return item;
    }));
  };

  const handleRemoveCartItem = (variantId: string) => {
    setCartItems(prev => prev.filter(item => item.variantId !== variantId));
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);

    setProducts(prevProducts => {
      return prevProducts.map(prod => {
        const updatedVariants = prod.variants.map(v => {
          const orderedItem = newOrder.items.find(i => i.variantId === v.id);
          if (orderedItem) {
            return {
              ...v,
              stock: Math.max(0, v.stock - orderedItem.quantity)
            };
          }
          return v;
        });
        return {
          ...prod,
          variants: updatedVariants
        };
      });
    });

    setCartItems([]);
    setLastPlacedOrder(newOrder);
    try {
      if (newOrder.customerPhone) {
        localStorage.setItem('_wf_customer_phone', newOrder.customerPhone);
      }
    } catch {
      // ignore
    }
    setCurrentView('confirmation');
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleAddProductReview = (productId: string, reviewData: { customerName: string; rating: number; comment: string }) => {
    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      customerName: reviewData.customerName,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Approved'
    };

    setProducts(prevProducts => prevProducts.map(p => {
      if (p.id === productId) {
        const existingReviews = p.reviews || [];
        const updatedReviews = [newReview, ...existingReviews];
        
        // Calculate new average rating based on all reviews
        const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
        const newAverage = Number((totalRating / updatedReviews.length).toFixed(1));
        const newCount = (p.reviewsCount || 0) + 1;

        return {
          ...p,
          rating: newAverage,
          reviewsCount: newCount,
          reviews: updatedReviews
        };
      }
      return p;
    }));
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, comment: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          orderStatus: status,
          history: [
            ...o.history,
            {
              status,
              comment,
              timestamp: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' }),
              by: 'Admin'
            }
          ]
        };
      }
      return o;
    }));
  };

  const handleUpdateVariantStock = (productId: string, variantId: string, newStock: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          variants: p.variants.map(v => {
            if (v.id === variantId) {
              return { ...v, stock: newStock };
            }
            return v;
          })
        };
      }
      return p;
    }));
  };

  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setViewParam(param);
    if (view === 'home' && window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#1E293B]">
      
      {/* PUBLIC STOREFRONT OR STANDALONE ADMIN ROUTE */}
      {currentView === 'admin' ? (
        <AdminPortal
          orders={orders}
          products={products}
          promoBanner={promoBanner}
          onUpdatePromoBanner={setPromoBanner}
          onAddProduct={handleAddProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateVariantStock={handleUpdateVariantStock}
          onExitAdmin={() => handleNavigate('home')}
        />
      ) : (
        <>
          {/* PromoBanner component sitting above the Navbar on the homepage to display current seasonal offers */}
          {(promoBanner.displayScope === 'all_pages' || currentView === 'home') && (
            <PromoBanner
              config={promoBanner}
              onAction={(view, param) => handleNavigate(view, param)}
            />
          )}

          {/* Public Storefront Header (Strictly NO admin links in public UI!) */}
          <Navbar
            cartCount={cartCount}
            wishlistCount={wishlist.length}
            onOpenCart={() => setCartDrawerOpen(true)}
            onNavigate={handleNavigate}
            currentView={currentView}
          />

          <main className="flex-1">
            {currentView === 'home' && (
              <>
                <HeroCampaign
                  onShopClick={() => handleNavigate('shop', 'all')}
                  onCategoryClick={(catSlug) => handleNavigate('shop', catSlug)}
                />
                <FeaturedSections
                  products={products}
                  wishlist={wishlist}
                  onToggleWishlist={handleToggleWishlist}
                  onSelectProduct={handleOpenProduct}
                  onShopClick={() => handleNavigate('shop', 'all')}
                  onCategoryClick={(catSlug) => handleNavigate('shop', catSlug)}
                />
              </>
            )}

            {currentView === 'shop' && (
              <ShopCatalogView
                products={products}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                initialCategory={viewParam?.startsWith('search:') ? 'all' : viewParam}
                initialSearch={viewParam?.startsWith('search:') ? viewParam.replace('search:', '') : ''}
                onSelectProduct={handleOpenProduct}
              />
            )}

            {currentView === 'checkout' && (
              <CheckoutView
                items={cartItems}
                onOrderPlaced={handleOrderPlaced}
                onBackToShop={() => handleNavigate('shop')}
              />
            )}

            {currentView === 'confirmation' && lastPlacedOrder && (
              <OrderConfirmationView
                order={lastPlacedOrder}
                onTrackOrder={(num, phone) => {
                  setTrackQuery({ orderNumber: num, phone: phone });
                  handleNavigate('track');
                }}
                onViewMyOrders={(phone) => handleNavigate('my-orders', phone)}
                onContinueShopping={() => handleNavigate('home')}
              />
            )}

            {currentView === 'track' && (
              <OrderTrackingView
                orders={orders}
                initialOrderNumber={trackQuery.orderNumber}
                initialPhone={trackQuery.phone}
                onBackToShop={() => handleNavigate('home')}
              />
            )}

            {currentView === 'my-orders' && (
              <MyOrdersView
                orders={orders}
                initialPhone={viewParam || undefined}
                onTrackOrder={(num, phone) => {
                  setTrackQuery({ orderNumber: num, phone: phone });
                  handleNavigate('track');
                }}
                onReorderItems={(reorderItems) => {
                  reorderItems.forEach(item => {
                    const product = products.find(p => p.id === item.productId);
                    const variant = product?.variants.find(v => v.id === item.variantId);
                    if (variant) {
                      handleAddToCart(variant, item.quantity, item.image);
                    }
                  });
                  setCartDrawerOpen(true);
                }}
                onBackToShop={() => handleNavigate('shop', 'all')}
              />
            )}

            {currentView === 'wishlist' && (
              <WishlistView
                wishlist={wishlist}
                products={products}
                onRemoveFromWishlist={handleRemoveFromWishlist}
                onClearWishlist={handleClearWishlist}
                onAddToCart={(variant, quantity, colorImage) => {
                  handleAddToCart(variant, quantity, colorImage);
                  setCartDrawerOpen(true);
                }}
                onSelectProduct={handleOpenProduct}
                onContinueShopping={() => handleNavigate('shop', 'all')}
              />
            )}
          </main>

          {/* Public Storefront Footer with Newsletter Subscription */}
          {currentView !== 'checkout' && (
            <Footer
              onCategoryClick={(catSlug) => handleNavigate('shop', catSlug)}
              onNavigate={handleNavigate}
            />
          )}
        </>
      )}

      {/* Color-Specific Product Detail Modal (PDP) */}
      {modalProduct && (() => {
        const liveProduct = products.find(p => p.id === modalProduct.id) || modalProduct;
        return (
          <ProductDetailModal
            product={liveProduct}
            initialColorId={modalColorId}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            onClose={() => setModalProduct(null)}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onAddReview={handleAddProductReview}
          />
        );
      })()}

      {/* Variant-Aware Shopping Bag Drawer */}
      {cartDrawerOpen && (
        <CartDrawer
          isOpen={cartDrawerOpen}
          onClose={() => setCartDrawerOpen(false)}
          items={cartItems}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onProceedToCheckout={() => {
            setCartDrawerOpen(false);
            handleNavigate('checkout');
          }}
        />
      )}

    </div>
  );
}
export default App;
