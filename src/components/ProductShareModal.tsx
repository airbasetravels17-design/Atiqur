import React, { useState } from 'react';
import { Product, ProductColor } from '../types/ecommerce';
import { formatTaka } from '../utils/format';
import { X, Check, Copy, Share2, Star, ExternalLink, QrCode } from 'lucide-react';

interface ProductShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedColor?: ProductColor;
}

export const ProductShareModal: React.FC<ProductShareModalProps> = ({
  isOpen,
  onClose,
  product,
  selectedColor
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  // Construct absolute canonical share URL with product slug/id and selected color
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://womensfit.com.bd';
  
  const shareUrl = `${baseUrl}?product=${product.slug || product.id}${selectedColor ? `&color=${selectedColor.id}` : ''}`;
  
  const effectivePrice = product.salePrice || product.regularPrice;
  const shareTitle = `${product.name} | Women's Fit`;
  const shareMessage = `Check out "${product.name}" on Women's Fit! Price: ${formatTaka(effectivePrice)}${product.rating > 0 ? ` (★ ${product.rating.toFixed(1)})` : ''}. Grab yours now: ${shareUrl}`;

  // Direct Social Share URLs
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out "${product.name}" on Women's Fit!`)}&url=${encodeURIComponent(shareUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(selectedColor?.images[0] || product.colors[0]?.images[0] || '')}&description=${encodeURIComponent(shareTitle)}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for non-secure contexts
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `Check out "${product.name}" on Women's Fit! Price: ${formatTaka(effectivePrice)}`,
          url: shareUrl
        });
        onClose();
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    }
  };

  const productImage = selectedColor?.images[0] || product.colors[0]?.images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">Share Product</h3>
              <p className="text-[11px] text-stone-500">Share with family & friends</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-stone-200 border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-all cursor-pointer"
            aria-label="Close share dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Product Mini Preview Card */}
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
            {productImage && (
              <img
                src={productImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 object-cover rounded-xl border border-stone-200 shrink-0"
              />
            )}
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED]">
                {product.brand || "Women's Fit"}
              </span>
              <h4 className="text-xs font-bold text-stone-900 truncate">
                {product.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-bold text-stone-900">
                  {formatTaka(effectivePrice)}
                </span>
                {product.salePrice && (
                  <span className="text-[10px] text-stone-400 line-through">
                    {formatTaka(product.regularPrice)}
                  </span>
                )}
                {product.rating > 0 && (
                  <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded text-[10px] font-semibold border border-amber-200/80">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Social Platforms Grid */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2.5">
              Instant Share Platforms
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              
              {/* WhatsApp (Primary) */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-3 rounded-2xl border border-emerald-100 bg-[#25D366]/10 hover:bg-[#25D366] transition-all duration-200 text-stone-800 hover:text-white shadow-xs hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  {/* WhatsApp SVG Icon */}
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.599 2.679-.702c.97.53 2.01.813 3.082.813h.005c3.179 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.767-5.767-5.767zm7.553 5.765c-.002 4.168-3.393 7.559-7.559 7.559-1.328 0-2.569-.347-3.666-.957l-4.062 1.065 1.084-3.963c-.689-1.155-1.053-2.483-1.053-3.704.002-4.168 3.394-7.559 7.56-7.559 4.168.001 7.558 3.393 7.559 7.56z" />
                    <path d="M12.031 1.75c-5.618 0-10.187 4.569-10.187 10.188 0 1.796.47 3.548 1.363 5.097L1.875 22.25l5.311-1.393c1.492.814 3.175 1.243 4.898 1.243h.005c5.618 0 10.187-4.569 10.187-10.188 0-5.619-4.569-10.187-10.187-10.187zm0 18.536c-1.571 0-3.109-.422-4.453-1.22l-.32-.19-3.308.868.883-3.225-.208-.332c-.881-1.402-1.347-3.031-1.347-4.707 0-4.819 3.92-8.738 8.739-8.738 4.818 0 8.738 3.919 8.739 8.738 0 4.819-3.92 8.739-8.739 8.739z" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold mt-2">WhatsApp</span>
              </a>

              {/* Facebook (Primary) */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-3 rounded-2xl border border-blue-100 bg-[#1877F2]/10 hover:bg-[#1877F2] transition-all duration-200 text-stone-800 hover:text-white shadow-xs hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  {/* Facebook SVG Icon */}
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold mt-2">Facebook</span>
              </a>

              {/* X / Twitter */}
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-3 rounded-2xl border border-stone-200 bg-stone-100 hover:bg-stone-900 transition-all duration-200 text-stone-800 hover:text-white shadow-xs hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  {/* X / Twitter SVG */}
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold mt-2">X / Twitter</span>
              </a>

              {/* Telegram */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center p-3 rounded-2xl border border-sky-100 bg-[#24A1DE]/10 hover:bg-[#24A1DE] transition-all duration-200 text-stone-800 hover:text-white shadow-xs hover:shadow-md"
              >
                <div className="w-10 h-10 rounded-full bg-[#24A1DE] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  {/* Telegram SVG */}
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold mt-2">Telegram</span>
              </a>

            </div>
          </div>

          {/* Direct Link Copy Field */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Copy Direct Link
            </div>
            <div className="flex items-center gap-2 p-1.5 bg-stone-50 border border-stone-200 rounded-2xl focus-within:border-[#7C3AED] focus-within:bg-white transition-all">
              <input
                type="text"
                readOnly
                value={shareUrl}
                aria-label="Direct product link to share"
                className="w-full bg-transparent px-3 text-xs text-stone-700 select-all outline-none font-mono truncate"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-900 hover:bg-[#7C3AED] text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Additional Options: Device Native Share & QR Code */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
              <button
                type="button"
                onClick={handleNativeShare}
                className="flex-1 py-2 px-3 rounded-xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 text-stone-700 font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
              >
                <Share2 className="w-3.5 h-3.5 text-[#7C3AED]" />
                <span>More apps (Instagram, etc.)</span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setShowQr(!showQr)}
              className="py-2 px-3 rounded-xl border border-stone-200 hover:border-stone-900 hover:bg-stone-50 text-stone-700 font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <QrCode className="w-3.5 h-3.5 text-stone-600" />
              <span>{showQr ? 'Hide QR' : 'QR Code'}</span>
            </button>
          </div>

          {/* QR Code generator preview if clicked */}
          {showQr && (
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 animate-fade-in">
              <div className="p-2 bg-white rounded-xl shadow-xs border border-stone-200">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(shareUrl)}`}
                  alt="Product QR Code"
                  className="w-32 h-32"
                />
              </div>
              <p className="text-[11px] text-stone-500">
                Scan with your smartphone camera to open directly on mobile
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
