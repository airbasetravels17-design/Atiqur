import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Flame, Tag } from 'lucide-react';

interface HeroCampaignProps {
  onShopClick: () => void;
  onCategoryClick: (categorySlug: string) => void;
}

export const HeroCampaign: React.FC<HeroCampaignProps> = ({ onShopClick, onCategoryClick }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const heroSlides = [
    {
      kicker: 'NEW COLLECTION 2026',
      title: 'Elevated Styles\nFor Every You',
      subtitle: 'Fresh fits, trending silhouettes & artisanal details',
      offer: 'Up to 50% OFF',
      tag: 'Trending Now',
      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&auto=format&fit=crop&q=80',
      bgColor: 'bg-gradient-to-r from-[#F5EEFB] via-[#F2EBF9] to-[#EBE2F5]',
      accentColor: '#FF3F6C',
      archBg: 'from-[#EADCF7] to-purple-100',
      targetCategory: 'kurtis'
    },
    {
      kicker: 'FESTIVE ATELIER',
      title: 'Handcrafted\nJamdani & Silks',
      subtitle: 'Artisanal heritage weaves for Eid & celebration moments',
      offer: 'Min. 40% OFF',
      tag: 'Heritage Edit',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&auto=format&fit=crop&q=80',
      bgColor: 'bg-gradient-to-r from-[#FFF1F2] via-[#FDF2F8] to-[#FCE7F3]',
      accentColor: '#E11D48',
      archBg: 'from-[#FBCFE8] to-rose-100',
      targetCategory: 'sarees'
    },
    {
      kicker: 'SUMMER RUNWAY',
      title: 'Breezy Linen\n& Silk Co-Ords',
      subtitle: 'Relaxed luxury tailoring crafted for Dhaka heat & elegance',
      offer: 'Flat 35% OFF',
      tag: 'Best Seller',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80',
      bgColor: 'bg-gradient-to-r from-[#FFFBEB] via-[#FEF9EE] to-[#FEF3C7]',
      accentColor: '#D97706',
      archBg: 'from-[#FDE68A] to-amber-100',
      targetCategory: 'co-ord-sets'
    },
    {
      kicker: 'MODERN STATEMENT',
      title: 'Floral Tiered\nMaxi Dresses',
      subtitle: 'Effortless drape, premium modal and romantic florals',
      offer: 'Special 45% OFF',
      tag: 'Limited Edition',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&auto=format&fit=crop&q=80',
      bgColor: 'bg-gradient-to-r from-[#F0FDF4] via-[#F2FBF7] to-[#DCFCE7]',
      accentColor: '#059669',
      archBg: 'from-[#BBF7D0] to-emerald-100',
      targetCategory: 'dresses'
    }
  ];

  // Auto-rotating timer: advances slide every 4.5 seconds unless hovered/paused
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, heroSlides.length]);

  const currentSlide = heroSlides[activeSlide];

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

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
      
      {/* 1. Main Hero Banner with Auto-Rotation, Smooth Cross-Fade & Hover Pause */}
      <div
        className={`relative rounded-3xl overflow-hidden ${currentSlide.bgColor} p-6 sm:p-12 lg:p-14 transition-all duration-700 shadow-sm border border-stone-100/70`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-stone-800 transition-all hover:scale-110 active:scale-95 focus:outline-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-stone-800 transition-all hover:scale-110 active:scale-95 focus:outline-none"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Counter Badge (Top Right) */}
        <div className="absolute top-4 right-5 sm:top-6 sm:right-8 z-10 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-stone-700 shadow-xs border border-white/60">
          <span className="w-2 h-2 rounded-full bg-[#FF3F6C] animate-pulse"></span>
          <span>{activeSlide + 1} / {heroSlides.length}</span>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-6xl mx-auto min-h-[380px] sm:min-h-[420px]">
          
          {/* Left Text Block with Keyframes Animation */}
          <div
            key={`slide-text-${activeSlide}`}
            className="max-w-lg z-10 text-left animate-in fade-in slide-in-from-left-6 duration-500 fill-mode-forwards"
          >
            <div className="flex items-center gap-2 mb-2">
              <span
                style={{ color: currentSlide.accentColor }}
                className="font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {currentSlide.kicker}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 text-stone-700 shadow-xs">
                {currentSlide.tag}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[54px] font-bold text-[#1F1E24] leading-[1.12] mb-3 whitespace-pre-line tracking-tight">
              {currentSlide.title}
            </h1>

            <p className="text-stone-700 text-sm sm:text-base font-medium mb-2">
              {currentSlide.subtitle}
            </p>

            <div className="inline-block px-3 py-1 rounded-md bg-white/90 text-stone-900 font-extrabold text-base sm:text-lg mb-6 shadow-xs border border-stone-200/50">
              <span className="text-[#FF3F6C] mr-1.5">★</span>
              {currentSlide.offer}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onShopClick}
                className="px-8 py-3 bg-[#FF3F6C] hover:bg-[#E11D48] active:scale-95 text-white text-xs sm:text-sm font-bold tracking-wider uppercase rounded-md shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onCategoryClick(currentSlide.targetCategory)}
                className="px-7 py-3 bg-white hover:bg-stone-50 active:scale-95 border border-stone-300 text-stone-900 text-xs sm:text-sm font-bold tracking-wider uppercase rounded-md transition-all shadow-xs"
              >
                Explore {currentSlide.targetCategory.replace('-', ' ')}
              </button>
            </div>
          </div>

          {/* Right Arched Visual Motif with Zoom/Fade Transition */}
          <div
            key={`slide-img-${activeSlide}`}
            className="relative w-full lg:w-[480px] flex justify-center animate-in fade-in zoom-in-95 duration-700"
          >
            {/* Arched Background Shadow */}
            <div className={`w-[320px] sm:w-[400px] h-[340px] sm:h-[420px] rounded-t-full bg-gradient-to-b ${currentSlide.archBg} overflow-hidden relative shadow-inner group cursor-pointer`}>
              <img
                src={currentSlide.image}
                alt="Women's Fit Campaign"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top scale-100 hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Interactive Slide Indicator Dots with Progress Glow */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/50 shadow-xs">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`transition-all duration-300 rounded-full ${
                activeSlide === idx
                  ? 'w-7 h-2.5 bg-[#FF3F6C] shadow-xs'
                  : 'w-2.5 h-2.5 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
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
