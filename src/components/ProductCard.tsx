import React, { useState } from 'react';
import { Product } from '../types/ecommerce';
import { formatTaka } from '../utils/format';
import { Heart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product, preselectedColorId?: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onSelect,
  isWishlisted: propIsWishlisted,
  onToggleWishlist
}) => {
  const [localWishlisted, setLocalWishlisted] = useState(false);
  const isWishlisted = propIsWishlisted !== undefined ? propIsWishlisted : localWishlisted;
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);

  const currentColor = product.colors[selectedColorIdx] || product.colors[0];
  const primaryImage = currentColor?.images[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800';

  const discountPercent = product.salePrice
    ? Math.round(((product.regularPrice - product.salePrice) / product.regularPrice) * 100)
    : null;

  return (
    <div 
      className="group relative flex flex-col bg-white rounded-xl border border-stone-200/80 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => onSelect(product, currentColor.id)}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F6F6F8]">
        <img
          src={primaryImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />

        {/* Wishlist Heart Icon at top right (matching Womenfit.jpg) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleWishlist) {
              onToggleWishlist(product.id);
            } else {
              setLocalWishlisted(!localWishlisted);
            }
          }}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/95 shadow-sm flex items-center justify-center transition-all ${
            isWishlisted ? 'text-[#FF3F6C] scale-105' : 'text-stone-400 hover:text-[#FF3F6C]'
          }`}
          aria-label={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart className={`w-4 h-4 transition-all ${isWishlisted ? 'fill-[#FF3F6C] text-[#FF3F6C]' : ''}`} />
        </button>

        {/* Rating Badge on bottom-left of Image */}
        {product.rating && product.rating > 0 ? (
          <div className="absolute bottom-2 left-2 z-10 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-bold text-stone-900 shadow-xs flex items-center gap-1 border border-stone-200/70">
            <span>{product.rating.toFixed(1)}</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
            <span className="text-stone-300">|</span>
            <span className="text-stone-500 font-medium">
              {product.reviewsCount >= 1000 ? `${(product.reviewsCount / 1000).toFixed(1)}k` : product.reviewsCount}
            </span>
          </div>
        ) : null}
      </div>

      {/* Product Information matching Womenfit.jpg exactly */}
      <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1">
        <div>
          {/* Brand Name (Bold) */}
          <div className="text-xs font-bold text-stone-900 truncate">
            {product.brand || 'Women\'s Fit'}
          </div>

          {/* Product Title (Regular) */}
          <h3 className="text-xs text-stone-600 truncate mt-0.5" title={product.name}>
            {product.name}
          </h3>

          {/* Average Rating Display (e.g. 4.3 ★ (840) or New) */}
          <div className="flex items-center gap-1 text-[11px] text-stone-600 mt-1">
            {product.rating && product.rating > 0 ? (
              <>
                <span className="font-bold text-stone-900">{product.rating.toFixed(1)}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline shrink-0" />
                <span className="text-stone-400 text-[10px]">
                  ({product.reviewsCount >= 1000 ? `${(product.reviewsCount / 1000).toFixed(1)}K` : product.reviewsCount})
                </span>
              </>
            ) : (
              <span className="text-stone-400 text-[10px] inline-flex items-center gap-1">
                <Star className="w-3 h-3 text-stone-300 inline" />
                <span>No reviews yet</span>
              </span>
            )}
          </div>
        </div>

        {/* Price Row (৳ Sale Price, ৳ Regular Price, (X% OFF) in red) */}
        <div className="flex items-baseline gap-1.5 mt-2 flex-wrap text-xs">
          <span className="font-bold text-stone-900 tabular-nums">
            {formatTaka(product.salePrice || product.regularPrice)}
          </span>
          {product.salePrice && (
            <>
              <span className="text-[11px] text-stone-400 line-through tabular-nums">
                {formatTaka(product.regularPrice)}
              </span>
              <span className="text-[11px] font-bold text-[#FF3F6C]">
                ({discountPercent}% OFF)
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
