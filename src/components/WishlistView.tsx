import React, { useState } from 'react';
import { Product, ProductVariant } from '../types/ecommerce';
import { formatTaka } from '../utils/format';
import { 
  Heart, ShoppingBag, Trash2, ArrowLeft, Check, AlertCircle, 
  Sparkles, Star, ChevronRight, ArrowRight 
} from 'lucide-react';

interface WishlistViewProps {
  wishlist: string[];
  products: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onClearWishlist: () => void;
  onAddToCart: (variant: ProductVariant, quantity: number, colorImage: string) => void;
  onSelectProduct: (product: Product, preselectedColorId?: string) => void;
  onContinueShopping: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlist,
  products,
  onRemoveFromWishlist,
  onClearWishlist,
  onAddToCart,
  onSelectProduct,
  onContinueShopping
}) => {
  // Map wishlist product IDs to product objects
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  // Selected size per product card: map of productId -> sizeCode
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    wishlistedProducts.forEach(p => {
      // Find first in-stock variant size, or default to first size
      const inStockVar = p.variants.find(v => v.stock > 0);
      initial[p.id] = inStockVar ? inStockVar.sizeCode : (p.sizes[0] || 'M');
    });
    return initial;
  });

  // Selected color per product card: map of productId -> colorId
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    wishlistedProducts.forEach(p => {
      initial[p.id] = p.colors[0]?.id || '';
    });
    return initial;
  });

  // Success message toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Move single item to cart
  const handleMoveToCart = (product: Product) => {
    const colorId = selectedColors[product.id] || product.colors[0]?.id;
    const sizeCode = selectedSizes[product.id] || product.sizes[0];

    // Find the specific matching variant
    let variant = product.variants.find(
      v => v.colorId === colorId && v.sizeCode === sizeCode
    );

    // Fallback if specific color+size combination isn't found
    if (!variant) {
      variant = product.variants.find(v => v.stock > 0) || product.variants[0];
    }

    if (!variant || variant.stock <= 0) {
      showToast(`Selected size (${sizeCode}) is currently out of stock.`);
      return;
    }

    const matchedColor = product.colors.find(c => c.id === variant?.colorId) || product.colors[0];
    const image = matchedColor?.images[0] || product.colors[0]?.images[0] || '';

    // Add to cart
    onAddToCart(variant, 1, image);

    // Remove from wishlist (standard fashion e-commerce "Move to Cart" workflow)
    onRemoveFromWishlist(product.id);

    showToast(`Moved "${product.name}" (${variant.sizeCode}) to your cart!`);
  };

  // Move all available in-stock items to cart
  const handleMoveAllToBag = () => {
    let movedCount = 0;

    wishlistedProducts.forEach(product => {
      const inStockVar = product.variants.find(v => v.stock > 0);
      if (inStockVar) {
        const matchedColor = product.colors.find(c => c.id === inStockVar.colorId) || product.colors[0];
        const image = matchedColor?.images[0] || '';
        onAddToCart(inStockVar, 1, image);
        onRemoveFromWishlist(product.id);
        movedCount++;
      }
    });

    if (movedCount > 0) {
      showToast(`Successfully moved ${movedCount} item${movedCount > 1 ? 's' : ''} to your cart!`);
    } else {
      showToast('No items are currently in stock to move.');
    }
  };

  return (
    <div className="bg-[#FAF9F8] min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Floating Notification Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1E293B] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold animate-fade-in border border-stone-700">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 stroke-[3]" />
            </span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <button 
            onClick={onContinueShopping} 
            className="hover:text-stone-900 transition-colors flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <span>/</span>
          <span className="text-stone-900 font-semibold">My Wishlist</span>
        </div>

        {/* View Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFF1F2] text-[#FF3F6C] flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 fill-[#FF3F6C]" />
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  My Wishlist
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  {wishlistedProducts.length} saved item{wishlistedProducts.length === 1 ? '' : 's'} stored across sessions
                </p>
              </div>
            </div>
          </div>

          {/* Bulk Action Controls */}
          {wishlistedProducts.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleMoveAllToBag}
                className="px-4 py-2.5 bg-[#FF3F6C] hover:bg-[#E11D48] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-2 transition-colors"
                aria-label="Move all to cart"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All To Cart</span>
              </button>

              <button
                type="button"
                onClick={onClearWishlist}
                className="px-3.5 py-2.5 border border-stone-300 hover:border-stone-400 text-stone-700 hover:text-stone-900 bg-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Clear all wishlist items"
              >
                <Trash2 className="w-3.5 h-3.5 text-stone-400" />
                <span>Clear All</span>
              </button>
            </div>
          )}
        </div>

        {/* EMPTY STATE */}
        {wishlistedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8 sm:p-16 text-center max-w-xl mx-auto my-8">
            <div className="w-20 h-20 rounded-full bg-[#FFF1F2] text-[#FF3F6C] flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Heart className="w-10 h-10 fill-[#FF3F6C]" />
            </div>
            
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-8 leading-relaxed">
              Your wishlist is currently empty. Explore our catalog to find pieces you love and save them for later!
            </p>

            <button
              onClick={onContinueShopping}
              aria-label="Browse catalog"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FF3F6C] hover:bg-[#E11D48] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors group"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          /* PRODUCT GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistedProducts.map(product => {
              const activeColorId = selectedColors[product.id] || product.colors[0]?.id;
              const activeColor = product.colors.find(c => c.id === activeColorId) || product.colors[0];
              const activeImage = activeColor?.images[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800';

              const activeSize = selectedSizes[product.id] || product.sizes[0];
              const activeVariant = product.variants.find(
                v => v.colorId === activeColor.id && v.sizeCode === activeSize
              );

              const isInStock = activeVariant ? activeVariant.stock > 0 : product.variants.some(v => v.stock > 0);
              const remainingStock = activeVariant?.stock ?? 0;

              const discountPercent = product.salePrice
                ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
                : null;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300 group"
                >
                  {/* Top Image Frame */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-50">
                    <img
                      src={activeImage}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      onClick={() => onSelectProduct(product, activeColor.id)}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                    />

                    {/* Discount Badge */}
                    {discountPercent && (
                      <span className="absolute top-3 left-3 bg-[#FF3F6C] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                        {discountPercent}% OFF
                      </span>
                    )}

                    {/* Remove from Wishlist (X button at top-right) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWishlist(product.id);
                        showToast(`Removed "${product.name}" from your wishlist`);
                      }}
                      className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/95 text-stone-500 hover:text-red-600 hover:bg-white shadow-sm flex items-center justify-center transition-colors"
                      title="Remove from Wishlist"
                      aria-label="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Stock Status Badge */}
                    {!isInStock && (
                      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Brand & Category */}
                      <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 mb-1">
                        <span className="text-[#7C3AED] uppercase tracking-wider">
                          {product.brand || "Women's Fit"}
                        </span>
                        <span>{product.category}</span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => onSelectProduct(product, activeColor.id)}
                        className="text-xs sm:text-sm font-semibold text-stone-900 hover:text-[#7C3AED] line-clamp-1 cursor-pointer transition-colors"
                        title={product.name}
                      >
                        {product.name}
                      </h3>

                      {/* Pricing Row */}
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-sm sm:text-base font-bold text-stone-900 tabular-nums">
                          {formatTaka(product.salePrice || product.regularPrice)}
                        </span>
                        {product.salePrice && (
                          <span className="text-xs text-stone-400 line-through tabular-nums">
                            {formatTaka(product.regularPrice)}
                          </span>
                        )}
                      </div>

                      {/* Color Selector Swatches if multiple colors exist */}
                      {product.colors.length > 1 && (
                        <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center gap-1.5">
                          <span className="text-[10px] text-stone-500 font-semibold mr-1">Color:</span>
                          {product.colors.map(col => (
                            <button
                              key={col.id}
                              type="button"
                              onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: col.id }))}
                              className={`w-5 h-5 rounded-full border-2 transition-all ${
                                activeColor.id === col.id ? 'border-stone-900 scale-110' : 'border-stone-200 hover:border-stone-400'
                              }`}
                              style={{ backgroundColor: col.hex }}
                              title={col.name}
                            />
                          ))}
                        </div>
                      )}

                      {/* Size Selector Pills */}
                      <div className="mt-3 pt-2.5 border-t border-stone-100">
                        <div className="flex justify-between items-center text-[10px] text-stone-500 font-semibold mb-1.5">
                          <span>Select Size:</span>
                          {remainingStock > 0 && remainingStock <= 3 && (
                            <span className="text-amber-600 font-bold">Only {remainingStock} left!</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {product.sizes.map(size => {
                            const variantForSize = product.variants.find(
                              v => v.colorId === activeColor.id && v.sizeCode === size
                            );
                            const hasStock = variantForSize ? variantForSize.stock > 0 : false;
                            const isSelected = activeSize === size;

                            return (
                              <button
                                key={size}
                                type="button"
                                disabled={!hasStock}
                                onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: size }))}
                                className={`px-2.5 py-1 rounded text-[11px] font-semibold border transition-all ${
                                  !hasStock
                                    ? 'border-stone-200 text-stone-300 line-through cursor-not-allowed bg-stone-50'
                                    : isSelected
                                    ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                                    : 'border-stone-200 text-stone-700 bg-white hover:border-stone-400'
                                }`}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Action Button: Move to Cart */}
                    <div className="mt-4 pt-3 border-t border-stone-100">
                      <button
                        type="button"
                        disabled={!isInStock}
                        onClick={() => handleMoveToCart(product)}
                        className="w-full py-2.5 px-3 bg-[#FF3F6C] hover:bg-[#E11D48] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label="Move to cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Move To Cart</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
