import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface HeroCampaignProps {
  onShopClick: () => void;
  onCategoryClick: (categorySlug: string) => void;
}

export const HeroCampaign: React.FC<HeroCampaignProps> = ({ onShopClick, onCategoryClick }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      kicker: 'NEW COLLECTION',
      title: 'Elevated Styles\nFor Every You',
      subtitle: 'Fresh fits, trending now!',
      offer: 'Up to 50% OFF',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&auto=format&fit=crop&q=80',
      bgColor: 'bg-[#F2EBF9]'
    },
    {
      kicker: 'FESTIVE 2026',
      title: 'Handcrafted\nJamdani & Silks',
      subtitle: 'Artisanal heritage weaves',
      offer: 'Min. 40% OFF',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&auto=format&fit=crop&q=80',
      bgColor: 'bg-[#FDF2F8]'
    }
  ];

  const currentSlide = heroSlides[activeSlide];

  // 9 Categories matching Womenfit.jpg
  const categories = [
    { name: 'KURTIS', slug: 'kurtis', img: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=300' },
    { name: 'DRESSES', slug: 'dresses', img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300' },
    { name: 'TOPS', slug: 'tops', img: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=300' },
    { name: 'CO-ORD SETS', slug: 'co-ord-sets', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=300' },
    { name: 'SAREES', slug: 'sarees', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300' },
    { name: 'ETHNIC WEAR', slug: 'ethnic-wear', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300' },
    { name: 'WESTERN WEAR', slug: 'western-wear', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300' },
    { name: 'ACCESSORIES', slug: 'accessories', img: 'https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?w=300' },
    { name: 'FOOTWEAR', slug: 'footwear', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 space-y-10">
      
      {/* 1. Main Hero Banner matching Womenfit.jpg */}
      <div className={`relative rounded-3xl overflow-hidden ${currentSlide.bgColor} p-6 sm:p-12 lg:p-14 transition-colors duration-500`}>
        
        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={() => setActiveSlide(prev => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-stone-700 hover:bg-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => setActiveSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1))}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-stone-700 hover:bg-white"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
          
          {/* Left Text Block */}
          <div className="max-w-lg z-10 text-left">
            <span className="text-[#FF3F6C] font-bold text-xs tracking-wider uppercase">
              {currentSlide.kicker}
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-bold text-[#1F1E24] leading-[1.12] mt-2 mb-3 whitespace-pre-line">
              {currentSlide.title}
            </h1>

            <p className="text-stone-700 text-sm sm:text-base font-medium mb-1">
              {currentSlide.subtitle}
            </p>

            <div className="text-stone-900 font-bold text-base sm:text-lg mb-6">
              {currentSlide.offer}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onShopClick}
                className="px-8 py-3 bg-[#FF3F6C] hover:bg-[#E11D48] text-white text-xs sm:text-sm font-bold tracking-wider uppercase rounded-md shadow transition-colors"
              >
                Shop Now
              </button>
              <button
                onClick={() => onCategoryClick('dresses')}
                className="px-7 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-900 text-xs sm:text-sm font-bold tracking-wider uppercase rounded-md transition-colors"
              >
                Explore
              </button>
            </div>
          </div>

          {/* Right Arched Visual Motif (matching Womenfit.jpg) */}
          <div className="relative w-full lg:w-[480px] flex justify-center">
            {/* Arched Background Shadow */}
            <div className="w-[320px] sm:w-[400px] h-[340px] sm:h-[420px] rounded-t-full bg-gradient-to-b from-[#EADCF7] to-transparent overflow-hidden relative shadow-inner">
              <img
                src={currentSlide.image}
                alt="Women's Fit Hero"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top scale-105"
              />
            </div>
          </div>

        </div>
      </div>

      {/* 2. 9 Category Badges Strip (Circular Images with Pill Labels matching Womenfit.jpg) */}
      <div className="py-2">
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3 sm:gap-4 text-center">
          {categories.map(cat => (
            <button
              key={cat.slug}
              onClick={() => onCategoryClick(cat.slug)}
              className="group flex flex-col items-center focus:outline-none"
            >
              {/* Circular Thumbnail Frame */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-stone-200 group-hover:border-[#FF3F6C] group-hover:shadow-md transition-all p-0.5 bg-white">
                <img
                  src={cat.img}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Pill Tag Below matching Womenfit.jpg */}
              <span className="mt-2.5 px-2 py-0.5 bg-[#F4F4F6] group-hover:bg-[#FF3F6C] group-hover:text-white rounded text-[10px] sm:text-[11px] font-bold text-stone-800 tracking-wider transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. 3 Promotional Cards Row matching Womenfit.jpg */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        
        {/* Banner 1: Summer Collection */}
        <div
          onClick={() => onCategoryClick('dresses')}
          className="relative rounded-2xl overflow-hidden bg-[#FDF2F4] p-6 flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow h-52 border border-[#FDE2E4]"
        >
          <div className="z-10 max-w-[55%]">
            <span className="text-[10px] font-extrabold text-[#FF3F6C] uppercase tracking-wider">
              New Arrivals
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-0.5 mb-1 leading-snug">
              Summer Collection
            </h3>
            <div className="text-sm font-bold text-[#FF3F6C] mb-3">
              40-60% OFF
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-900 underline">
              <span>Shop Now</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="w-36 h-44 rounded-xl overflow-hidden bg-stone-100 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400"
              alt="Summer Collection"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Banner 2: Timeless Elegance */}
        <div
          onClick={() => onCategoryClick('kurtis')}
          className="relative rounded-2xl overflow-hidden bg-[#FEF9EE] p-6 flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow h-52 border border-[#FDEFC9]"
        >
          <div className="z-10 max-w-[55%]">
            <span className="text-[10px] font-extrabold text-[#D97706] uppercase tracking-wider">
              Best of Ethnic
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-0.5 mb-1 leading-snug">
              Timeless Elegance
            </h3>
            <div className="text-sm font-bold text-stone-800 mb-3">
              Min. 40% OFF
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-900 underline">
              <span>Shop Now</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="w-36 h-44 rounded-xl overflow-hidden bg-stone-100 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400"
              alt="Timeless Elegance"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* Banner 3: Global Brands Now Live */}
        <div
          onClick={() => onCategoryClick('western-wear')}
          className="relative rounded-2xl overflow-hidden bg-[#F5F2F9] p-6 flex justify-between items-center cursor-pointer hover:shadow-md transition-shadow h-52 border border-[#E9E4F2]"
        >
          <div className="z-10 max-w-[55%]">
            <span className="text-[10px] font-extrabold text-[#7C3AED] uppercase tracking-wider">
              Top Brands
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-0.5 mb-1 leading-snug">
              Global Brands Now Live
            </h3>
            <div className="text-sm font-bold text-stone-800 mb-3 opacity-0">
              Min. 30% OFF
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-900 underline">
              <span>Shop Now</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          <div className="w-36 h-44 rounded-xl overflow-hidden bg-stone-100 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400"
              alt="Global Brands"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

      </div>

    </div>
  );
};
