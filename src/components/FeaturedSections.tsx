import React from 'react';
import { Product } from '../types/ecommerce';
import { ProductCard } from './ProductCard';
import { ArrowRight, ShieldCheck, RotateCcw, Truck, Lock, Headphones } from 'lucide-react';

interface FeaturedSectionsProps {
  products: Product[];
  wishlist?: string[];
  onToggleWishlist?: (productId: string) => void;
  onSelectProduct: (product: Product, preselectedColorId?: string) => void;
  onShopClick: () => void;
  onCategoryClick: (slug: string) => void;
}

export const FeaturedSections: React.FC<FeaturedSectionsProps> = ({
  products,
  wishlist = [],
  onToggleWishlist,
  onSelectProduct,
  onShopClick,
  onCategoryClick
}) => {
  const trendingProducts = products.filter(p => p.isTrending);
  const bestSellers = products.filter(p => p.isFeatured);

  return (
    <div className="space-y-12">
      
      {/* 1. TRENDING NOW SECTION matching Womenfit.jpg */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 uppercase">
            Trending Now
          </h2>
          <button
            onClick={onShopClick}
            className="text-xs font-bold text-stone-800 hover:text-[#FF3F6C] flex items-center gap-1 uppercase tracking-wide"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal scrollable / grid row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {trendingProducts.slice(0, 7).map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onSelect={onSelectProduct}
              isWishlisted={wishlist.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center items-center gap-1.5 mt-5">
          <span className="w-2 h-2 rounded-full bg-[#FF3F6C]" />
          <span className="w-2 h-2 rounded-full bg-stone-300" />
          <span className="w-2 h-2 rounded-full bg-stone-300" />
        </div>
      </section>

      {/* 2. VALUE PROPOSITION BANNER matching Womenfit.jpg (Gradient Magenta-Pink Bar) */}
      <section className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] text-white py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            
            <div className="flex items-center justify-center gap-3 py-2 px-1">
              <ShieldCheck className="w-6 h-6 shrink-0 text-white" />
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">100% Original</div>
                <div className="text-[10px] text-white/80">Products</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 py-2 px-1">
              <RotateCcw className="w-6 h-6 shrink-0 text-white" />
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">Easy Returns</div>
                <div className="text-[10px] text-white/80">15 Days Return Policy</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 py-2 px-1">
              <Truck className="w-6 h-6 shrink-0 text-white" />
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">Free Delivery</div>
                <div className="text-[10px] text-white/80">On Orders Above ৳1999</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 py-2 px-1">
              <Lock className="w-6 h-6 shrink-0 text-white" />
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">Secure Payments</div>
                <div className="text-[10px] text-white/80">100% Safe & Secure</div>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1 flex items-center justify-center gap-3 py-2 px-1">
              <Headphones className="w-6 h-6 shrink-0 text-white" />
              <div className="text-left">
                <div className="text-xs font-bold leading-tight">24x7 Support</div>
                <div className="text-[10px] text-white/80">Dedicated Support</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION matching Womenfit.jpg */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 uppercase">
            Best Sellers
          </h2>
          <button
            onClick={onShopClick}
            className="text-xs font-bold text-stone-800 hover:text-[#FF3F6C] flex items-center gap-1 uppercase tracking-wide"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7 Products in row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {bestSellers.slice(0, 7).map(p => (
            <ProductCard 
              key={p.id} 
              product={p} 
              onSelect={onSelectProduct}
              isWishlisted={wishlist.includes(p.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center items-center gap-1.5 mt-5">
          <span className="w-2 h-2 rounded-full bg-[#FF3F6C]" />
          <span className="w-2 h-2 rounded-full bg-stone-300" />
          <span className="w-2 h-2 rounded-full bg-stone-300" />
        </div>
      </section>

      {/* 4. FOLLOW US ON INSTAGRAM @womensfit & STAY IN THE LOOP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        <div className="mb-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-900">
            Follow Us On Instagram <span className="text-[#FF3F6C]">@womensfit</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 shadow-sm">
            <img src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600" alt="Insta 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 shadow-sm">
            <img src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600" alt="Insta 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 shadow-sm">
            <img src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600" alt="Insta 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 shadow-sm">
            <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600" alt="Insta 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
          </div>
        </div>

      </section>

    </div>
  );
};
