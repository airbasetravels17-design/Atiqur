import React, { useState, useEffect } from 'react';
import { Product, ProductColor, ProductVariant } from '../types/ecommerce';
import { formatTaka } from '../utils/format';
import { ProductReviewsSection } from './ProductReviewsSection';
import { ProductShareModal } from './ProductShareModal';
import { X, Check, ShieldCheck, Truck, RotateCcw, AlertCircle, ShoppingBag, Heart, Star, Share2, Copy } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  initialColorId?: string;
  wishlist?: string[];
  onToggleWishlist?: (productId: string) => void;
  onClose: () => void;
  onAddToCart: (variant: ProductVariant, quantity: number, colorImage: string) => void;
  onBuyNow: (variant: ProductVariant, quantity: number, colorImage: string) => void;
  onAddReview?: (productId: string, review: { customerName: string; rating: number; comment: string }) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = (props) => {
  if (!props.product) return null;
  return (
    <ProductDetailModalContent
      {...props}
      product={props.product}
      key={`${props.product.id}-${props.initialColorId || ''}`}
    />
  );
};

const ProductDetailModalContent: React.FC<Omit<ProductDetailModalProps, 'product'> & { product: Product }> = ({
  product,
  initialColorId,
  wishlist = [],
  onToggleWishlist,
  onClose,
  onAddToCart,
  onBuyNow,
  onAddReview
}) => {
  // Selected Color state
  const [selectedColor, setSelectedColor] = useState<ProductColor>(() => {
    if (initialColorId) {
      const match = product.colors.find(c => c.id === initialColorId);
      if (match) return match;
    }
    return product.colors[0];
  });

  // Selected Size state
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');

  // Active Main Image in gallery (defaults to first image of current color)
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);

  // Quantity
  const [quantity, setQuantity] = useState<number>(1);

  // Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Social share states
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [quickCopied, setQuickCopied] = useState(false);

  // When selected color changes: AUTOMATICALLY switch gallery to this color's images!
  useEffect(() => {
    setActiveImageIdx(0);
  }, [selectedColor]);

  // Find exact variant for selected (Color + Size)
  const currentVariant = product.variants.find(
    v => v.colorId === selectedColor.id && v.sizeCode === selectedSize
  );

  const isAvailable = currentVariant ? currentVariant.stock > 0 : false;
  const currentStock = currentVariant ? currentVariant.stock : 0;

  // Price determination (checking variant price override or product sale price)
  const effectivePrice = currentVariant?.priceOverride || product.salePrice || product.regularPrice;
  const originalPrice = product.regularPrice;
  const discountPercent = product.salePrice
    ? Math.round(((originalPrice - effectivePrice) / originalPrice) * 100)
    : null;

  const currentGalleryImages = selectedColor.images.length > 0 ? selectedColor.images : [product.colors[0]?.images[0] || ''];
  const activeMainImage = currentGalleryImages[activeImageIdx] || currentGalleryImages[0];

  const handleAddToCart = () => {
    if (!currentVariant || !isAvailable) return;
    onAddToCart(currentVariant, quantity, activeMainImage);
    setToastMessage(`Added ${product.name} (${selectedColor.name} · ${selectedSize}) to bag!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleBuyNow = () => {
    if (!currentVariant || !isAvailable) return;
    onBuyNow(currentVariant, quantity, activeMainImage);
    onClose();
  };

  const handleQuickCopy = async () => {
    const url = `${window.location.origin}${window.location.pathname}?product=${product.slug || product.id}&color=${selectedColor.id}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setQuickCopied(true);
      setTimeout(() => setQuickCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div 
        className="relative bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Header Actions: Share & Close */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="p-2 text-stone-600 hover:text-stone-900 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white transition-all cursor-pointer"
            aria-label="Share product"
            title="Share on WhatsApp, Facebook & more"
          >
            <Share2 className="w-5 h-5 text-stone-700" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-stone-600 hover:text-stone-900 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-white transition-all cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* LEFT COLUMN: Color-Specific Product Gallery */}
        <div className="md:w-1/2 p-4 sm:p-6 bg-stone-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200 overflow-y-auto">
          {/* Main Hero Photo for Selected Color */}
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-200 mb-4 shadow-sm">
            <img
              src={activeMainImage}
              alt={`${product.name} - ${selectedColor.name}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-300"
            />
            {discountPercent && (
              <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded tracking-wider">
                {discountPercent}% OFF
              </span>
            )}
            {/* Color watermark reminder */}
            <div className="absolute bottom-3 left-3 bg-stone-900/70 text-white text-[11px] font-medium px-2.5 py-1 rounded-md backdrop-blur">
              Showing Color: <span className="font-bold">{selectedColor.name}</span>
            </div>
          </div>

          {/* Color-specific Thumbnails Strip */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {currentGalleryImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-16 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${activeImageIdx === idx ? 'border-stone-900 ring-2 ring-stone-900/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt={`Angle ${idx + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Contiguous Purchase Module & Variant Controls */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Brand, Category & Title */}
            <div className="text-xs uppercase tracking-widest text-[#7C3AED] font-bold mb-1">
              {product.brand || "Women's Fit"} · <span className="text-stone-500 font-semibold">{product.category}</span> · <span className="font-mono text-stone-400">SKU: {currentVariant ? currentVariant.sku : product.baseSku}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-1">
              {product.name}
            </h1>

            {/* Average 5-Star Rating & Review Count Header */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                <span className="text-xs font-bold text-stone-900">
                  {product.rating > 0 ? product.rating.toFixed(1) : '5.0'}
                </span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
              </div>

              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(product.rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-stone-300'
                    }`}
                  />
                ))}
              </div>

              <a
                href="#reviews-section"
                className="text-xs text-stone-500 hover:text-[#7C3AED] underline"
              >
                ({product.reviewsCount || (product.reviews?.length || 0)} customer ratings)
              </a>

              <span className="text-stone-300">•</span>

              <a
                href="#reviews-section"
                className="text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer"
              >
                Write a review
              </a>
            </div>

            {/* Price in Bangladeshi Taka (৳) */}
            <div className="flex items-baseline gap-3 my-3">
              <span className="text-2xl font-bold text-stone-900 tabular-nums">
                {formatTaka(effectivePrice)}
              </span>
              {product.salePrice && (
                <span className="text-stone-400 line-through text-base tabular-nums">
                  {formatTaka(originalPrice)}
                </span>
              )}
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Inclusive of all taxes
              </span>
            </div>

            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* COLOR SELECTION (Switches gallery immediately) */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-stone-900">
                  Color: <span className="text-stone-600 font-normal">{selectedColor.name}</span>
                </span>
                <span className="text-stone-400 text-[11px]">(Click color to switch gallery)</span>
              </div>
              <div className="flex items-center gap-3">
                {product.colors.map((color) => {
                  const isSelected = selectedColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${isSelected ? 'border-stone-900 bg-stone-900 text-white shadow-sm' : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'}`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SIZE SELECTION & STOCK RESOLUTION */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-stone-900">Select Size</span>
                {/* Variant Stock Indicator */}
                {currentVariant && (
                  <span className={`text-[12px] font-medium ${isAvailable ? (currentStock <= 5 ? 'text-amber-600' : 'text-emerald-600') : 'text-red-600'}`}>
                    {isAvailable ? (currentStock <= 5 ? `⚠️ Only ${currentStock} left in stock!` : '✓ In Stock') : '✕ Out of Stock'}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product.sizes.map((size) => {
                  // Check stock for this specific (color + size) combination
                  const variantForCombo = product.variants.find(
                    v => v.colorId === selectedColor.id && v.sizeCode === size
                  );
                  const comboHasStock = variantForCombo ? variantForCombo.stock > 0 : false;
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!comboHasStock}
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 rounded-lg text-xs font-semibold border flex flex-col items-center justify-center transition-all ${
                        !comboHasStock
                          ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed line-through'
                          : isSelected
                          ? 'border-stone-900 bg-stone-900 text-white shadow'
                          : 'border-stone-300 bg-white text-stone-800 hover:border-stone-900'
                      }`}
                      title={!comboHasStock ? `${size} is out of stock in ${selectedColor.name}` : `Select size ${size}`}
                    >
                      <span>{size}</span>
                      {comboHasStock && variantForCombo && variantForCombo.stock <= 3 && (
                        <span className="text-[9px] font-normal text-amber-500">{variantForCombo.stock} left</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            {isAvailable && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-semibold text-stone-900">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 text-sm font-bold"
                  >
                    −
                  </button>
                  <span className="px-4 py-1 text-sm font-semibold text-stone-900 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 text-sm font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-stone-500">Max {currentStock} per order</span>
              </div>
            )}

            {/* Out of Stock Warning Notice */}
            {!isAvailable && (
              <div className="p-3 mb-6 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>The combination <strong>{selectedColor.name} + Size {selectedSize}</strong> is currently sold out. Please select another size or color.</span>
              </div>
            )}

            {/* Notification Toast */}
            {toastMessage && (
              <div className="p-3 mb-4 bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center justify-between shadow-lg animate-fade-in">
                <span>{toastMessage}</span>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
            )}
          </div>

          {/* Action Buttons & Value Guarantees */}
          <div className="pt-4 border-t border-stone-200 space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Save to Wishlist Button */}
              <button
                type="button"
                onClick={() => product && onToggleWishlist?.(product.id)}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                  wishlist.includes(product.id)
                    ? 'border-[#FF3F6C] bg-[#FFF1F2] text-[#FF3F6C] shadow-sm'
                    : 'border-stone-300 hover:border-[#FF3F6C] text-stone-600 hover:text-[#FF3F6C] bg-white'
                }`}
                title={wishlist.includes(product.id) ? "Remove from Wishlist" : "Save to Wishlist"}
                aria-label={wishlist.includes(product.id) ? "Remove from Wishlist" : "Save to Wishlist"}
              >
                <Heart className={`w-5 h-5 transition-transform ${wishlist.includes(product.id) ? 'fill-[#FF3F6C] text-[#FF3F6C] scale-110' : ''}`} />
              </button>

              {/* Share Product Icon Button */}
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="w-12 h-12 rounded-xl border border-stone-300 hover:border-[#7C3AED] text-stone-600 hover:text-[#7C3AED] bg-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-xs"
                title="Share on WhatsApp, Facebook & more"
                aria-label="Share on WhatsApp, Facebook & more"
              >
                <Share2 className="w-5 h-5" />
              </button>

              <button
                type="button"
                disabled={!isAvailable}
                onClick={handleAddToCart}
                className="flex-1 py-3 px-3 sm:px-4 border-2 border-stone-900 bg-white hover:bg-stone-900 hover:text-white text-stone-900 text-xs sm:text-sm font-bold rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Add To Bag</span>
              </button>
              <button
                type="button"
                disabled={!isAvailable}
                onClick={handleBuyNow}
                className="flex-1 py-3 px-3 sm:px-4 bg-[#1C1917] hover:bg-stone-800 text-white text-xs sm:text-sm font-bold rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none shadow-md text-center cursor-pointer"
              >
                Buy Now (COD)
              </button>
            </div>

            {/* Social Media Sharing Strip (WhatsApp, Facebook, Quick Copy) */}
            <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-stone-800">
                <Share2 className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>Share this fit:</span>
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {/* WhatsApp Direct Share */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Check out "${product.name}" on Women's Fit! Price: ${formatTaka(effectivePrice)} - ${typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : ''}?product=${product.slug || product.id}&color=${selectedColor.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-xs transition-all hover:scale-105"
                  title="Share to WhatsApp"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.97.53 2.01.813 3.082.813h.005c3.179 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.767-5.767-5.767zm7.553 5.765c-.002 4.168-3.393 7.559-7.559 7.559-1.328 0-2.569-.347-3.666-.957l-4.062 1.065 1.084-3.963c-.689-1.155-1.053-2.483-1.053-3.704.002-4.168 3.394-7.559 7.56-7.559 4.168.001 7.558 3.393 7.559 7.56z" />
                    <path d="M12.031 1.75c-5.618 0-10.187 4.569-10.187 10.188 0 1.796.47 3.548 1.363 5.097L1.875 22.25l5.311-1.393c1.492.814 3.175 1.243 4.898 1.243h.005c5.618 0 10.187-4.569 10.187-10.188 0-5.619-4.569-10.187-10.187-10.187zm0 18.536c-1.571 0-3.109-.422-4.453-1.22l-.32-.19-3.308.868.883-3.225-.208-.332c-.881-1.402-1.347-3.031-1.347-4.707 0-4.819 3.92-8.738 8.739-8.738 4.818 0 8.738 3.919 8.739 8.738 0 4.819-3.92 8.739-8.739 8.739z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>

                {/* Facebook Direct Share */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : ''}?product=${product.slug || product.id}&color=${selectedColor.id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold shadow-xs transition-all hover:scale-105"
                  title="Share to Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </a>

                {/* Quick Copy Link */}
                <button
                  type="button"
                  onClick={handleQuickCopy}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                    quickCopied
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {quickCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                  <span>{quickCopied ? 'Copied!' : 'Copy Link'}</span>
                </button>

                {/* More Options */}
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-all cursor-pointer text-xs font-medium"
                  title="More sharing options (X, Telegram, QR Code)"
                >
                  More...
                </button>
              </div>
            </div>

            {/* Trust Markers */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-stone-600 text-center">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-stone-800 mb-1" />
                <span>100% Genuine</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-stone-800 mb-1" />
                <span>Fast Courier (COD)</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-stone-800 mb-1" />
                <span>7-Day Return</span>
              </div>
            </div>

            {/* Customer Reviews & 5-Star Rating System */}
            <ProductReviewsSection
              productId={product.id}
              productName={product.name}
              rating={product.rating || 5}
              reviewsCount={product.reviewsCount || (product.reviews?.length || 0)}
              reviews={product.reviews || []}
              onAddReview={onAddReview}
            />
          </div>
        </div>
      </div>

      {/* Social Media Sharing Modal Dialog */}
      <ProductShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        product={product}
        selectedColor={selectedColor}
      />
    </div>
  );
};
