import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../types/ecommerce';
import { ProductCard } from './ProductCard';
import { Filter, X, SlidersHorizontal, RotateCcw, Heart, History, Search, Sparkles } from 'lucide-react';
import { formatTaka } from '../utils/format';

const SEARCH_HISTORY_KEY = '_wf_recent_searches';

interface ShopCatalogViewProps {
  products: Product[];
  initialCategory?: string;
  initialSearch?: string;
  wishlist?: string[];
  onToggleWishlist?: (productId: string) => void;
  onSelectProduct: (product: Product, preselectedColorId?: string) => void;
}

export const ShopCatalogView: React.FC<ShopCatalogViewProps> = ({
  products,
  initialCategory,
  initialSearch,
  wishlist = [],
  onToggleWishlist,
  onSelectProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');

  // Update selectedCategory when initialCategory prop changes (e.g. user clicked Wishlist icon in header)
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(8000);
  const [sortBy, setSortBy] = useState<string>('latest');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Search History State with localStorage persistence
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(item => typeof item === 'string' && item.trim().length > 0);
        }
      }
    } catch (e) {
      console.error('Error loading search history from localStorage:', e);
    }
    return ['Floral Dress', 'Kurtis', 'Co-ord Set'];
  });

  // Track search query into history
  const addSearchToHistory = (query: string) => {
    const clean = query.trim();
    if (!clean || clean.length < 2) return;
    setRecentSearches(prev => {
      const updated = [clean, ...prev.filter(item => item.toLowerCase() !== clean.toLowerCase())].slice(0, 8);
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving search history to localStorage:', e);
      }
      return updated;
    });
  };

  // Remove single item from search history
  const removeSearchFromHistory = (itemToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => {
      const updated = prev.filter(item => item.toLowerCase() !== itemToRemove.toLowerCase());
      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Error removing item from search history:', e);
      }
      return updated;
    });
  };

  // Clear entire search history
  const clearSearchHistory = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (e) {
      console.error('Error clearing search history:', e);
    }
  };

  // Tag click handler
  const handleTagClick = (tag: string) => {
    if (searchQuery.toLowerCase() === tag.toLowerCase()) {
      setSearchQuery('');
    } else {
      setSearchQuery(tag);
      addSearchToHistory(tag);
    }
  };

  // Update searchQuery and add to history when initialSearch prop changes
  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
      if (initialSearch.trim()) {
        addSearchToHistory(initialSearch.trim());
      }
    }
  }, [initialSearch]);

  // Debounced auto-save to recent searches when user stops typing
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 3) return;
    const timer = setTimeout(() => {
      addSearchToHistory(searchQuery.trim());
    }, 1500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Categories list
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach(p => map.set(p.categorySlug, p.category));
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [products]);

  // All colors list
  const allColors = useMemo(() => {
    const map = new Map<string, { name: string; hex: string }>();
    products.forEach(p => {
      p.colors.forEach(c => map.set(c.name, { name: c.name, hex: c.hex }));
    });
    return Array.from(map.values());
  }, [products]);

  // All sizes list
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

  // Filtering & Sorting Pipeline
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Wishlist or Category filter
      if (selectedCategory === 'wishlist') {
        if (!wishlist.includes(p.id)) return false;
      } else if (selectedCategory !== 'all' && p.categorySlug !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = p.name.toLowerCase().includes(q) ||
                        (p.brand && p.brand.toLowerCase().includes(q)) ||
                        p.category.toLowerCase().includes(q) ||
                        p.shortDescription.toLowerCase().includes(q) ||
                        p.baseSku.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Price filter
      const effectivePrice = p.salePrice || p.regularPrice;
      if (effectivePrice > maxPrice) {
        return false;
      }

      // Color filter
      if (selectedColor !== 'all') {
        const hasColor = p.colors.some(c => c.name.toLowerCase() === selectedColor.toLowerCase());
        if (!hasColor) return false;
      }

      // Size filter
      if (selectedSize !== 'all') {
        const hasSize = p.sizes.includes(selectedSize);
        if (!hasSize) return false;
      }

      // In-stock only filter
      if (inStockOnly) {
        const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
        if (totalStock === 0) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.regularPrice;
      const priceB = b.salePrice || b.regularPrice;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'popular') return (b.rating * b.reviewsCount) - (a.rating * a.reviewsCount);
      return 0; // default latest
    });
  }, [products, selectedCategory, searchQuery, maxPrice, selectedColor, selectedSize, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedColor('all');
    setSelectedSize('all');
    setInStockOnly(false);
    setMaxPrice(8000);
    setSortBy('latest');
    setSearchQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-200 pb-5 mb-8 gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 flex items-center gap-2.5">
            {selectedCategory === 'wishlist' ? (
              <>
                <Heart className="w-7 h-7 sm:w-8 sm:h-8 fill-[#FF3F6C] text-[#FF3F6C] shrink-0" />
                <span>My Wishlist</span>
              </>
            ) : selectedCategory === 'all'
              ? 'Complete Collection'
              : categories.find(c => c.slug === selectedCategory)?.name || 'Catalog'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {selectedCategory === 'wishlist'
              ? `You have saved ${filteredProducts.length} style${filteredProducts.length === 1 ? '' : 's'} across sessions`
              : <>Showing <strong className="text-stone-900">{filteredProducts.length}</strong> distinctive styles</>}
          </p>
        </div>

        {/* Mobile Filter Trigger & Sort Dropdown */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2 border border-stone-300 rounded-lg text-xs font-semibold flex items-center gap-2 text-stone-800"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-900"
            >
              <option value="latest">Newest Arrivals</option>
              <option value="popular">Best Selling / Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* DESKTOP FILTER SIDEBAR */}
        <aside className="hidden lg:block space-y-6 pr-4 border-r border-stone-200/80">
          
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search within catalog */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-2">Search Catalog</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    addSearchToHistory(searchQuery.trim());
                  }
                }}
                placeholder="Search keyword..."
                className="w-full bg-stone-50 border border-stone-300 rounded-lg pl-3 pr-8 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Search className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              )}
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-2">Categories</label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left text-xs py-1.5 px-2 rounded-md font-medium transition-colors ${selectedCategory === 'all' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
              >
                All Categories ({products.length})
              </button>
              
              {/* Persistent Wishlist Quick Filter */}
              <button
                onClick={() => setSelectedCategory('wishlist')}
                className={`w-full text-left text-xs py-1.5 px-2 rounded-md font-medium transition-colors flex justify-between items-center ${selectedCategory === 'wishlist' ? 'bg-[#FF3F6C] text-white' : 'text-stone-600 hover:bg-stone-100'}`}
              >
                <span className="flex items-center gap-1.5">
                  <Heart className={`w-3.5 h-3.5 ${selectedCategory === 'wishlist' ? 'fill-white text-white' : 'text-[#FF3F6C]'}`} />
                  <span>My Wishlist</span>
                </span>
                <span className={`text-[11px] ${selectedCategory === 'wishlist' ? 'text-white' : 'text-[#FF3F6C] font-bold'}`}>
                  ({wishlist.length})
                </span>
              </button>

              {categories.map(c => {
                const count = products.filter(p => p.categorySlug === c.slug).length;
                return (
                  <button
                    key={c.slug}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`w-full text-left text-xs py-1.5 px-2 rounded-md font-medium transition-colors flex justify-between ${selectedCategory === c.slug ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'}`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[11px] opacity-70">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-stone-800 mb-2">
              <span>Max Price</span>
              <span className="font-bold text-stone-900 tabular-nums">{formatTaka(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="8000"
              step="200"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1">
              <span>৳1,000</span>
              <span>৳8,000</span>
            </div>
          </div>

          {/* Color Filter */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-2">Color Tone</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedColor('all')}
                className={`text-[11px] px-2.5 py-1 rounded-md border font-medium ${selectedColor === 'all' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 text-stone-600 hover:border-stone-400'}`}
              >
                All Colors
              </button>
              {allColors.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(selectedColor === c.name ? 'all' : c.name)}
                  className={`text-[11px] px-2.5 py-1 rounded-md border font-medium flex items-center gap-1.5 ${selectedColor === c.name ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 text-stone-700 hover:border-stone-400'}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-2">Size</label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setSelectedSize('all')}
                className={`text-xs py-1.5 rounded-md border font-semibold ${selectedSize === 'all' ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 text-stone-700 hover:border-stone-400'}`}
              >
                All
              </button>
              {allSizes.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(selectedSize === s ? 'all' : s)}
                  className={`text-xs py-1.5 rounded-md border font-semibold ${selectedSize === s ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 text-stone-700 hover:border-stone-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* In-Stock Only Toggle */}
          <div className="pt-2 border-t border-stone-100">
            <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={e => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-stone-900 focus:ring-stone-900"
              />
              <span>In-Stock Items Only</span>
            </label>
          </div>

        </aside>

        {/* PRODUCTS GRID (3 Cols on Desktop) */}
        <main className="lg:col-span-3">

          {/* Quick Search & Search History Bar Above Search Results */}
          <div className="mb-6 space-y-3">
            
            {/* Search Input Box */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    addSearchToHistory(searchQuery.trim());
                  }
                }}
                placeholder="Search styles by name, fabric, category, or color..."
                className="w-full bg-white border border-stone-200 hover:border-stone-300 rounded-2xl pl-10 pr-24 py-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] shadow-2xs transition-all"
              />
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => addSearchToHistory(searchQuery.trim())}
                    className="px-3 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    Search
                  </button>
                )}
              </div>
            </div>

            {/* Clickable Search History Tags */}
            {recentSearches.length > 0 && (
              <div className="bg-stone-50/80 border border-stone-200/80 rounded-2xl p-3 sm:p-4 transition-all">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                    <History className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Recent Searches:</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearSearchHistory}
                    className="text-[11px] text-stone-400 hover:text-rose-600 transition-colors cursor-pointer font-medium"
                    title="Clear all recent searches"
                  >
                    Clear history
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {recentSearches.map((tag) => {
                    const isActive = searchQuery.toLowerCase() === tag.toLowerCase();
                    return (
                      <div
                        key={tag}
                        className={`group inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-[#7C3AED] text-white shadow-xs font-semibold'
                            : 'bg-white text-stone-700 hover:text-stone-900 border border-stone-200 hover:border-stone-400 shadow-2xs hover:shadow-xs'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => handleTagClick(tag)}
                          className="cursor-pointer hover:underline"
                          title={`Search for "${tag}"`}
                        >
                          {tag}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => removeSearchFromHistory(tag, e)}
                          className={`p-1 rounded-full transition-colors cursor-pointer ${
                            isActive
                              ? 'hover:bg-white/20 text-white/80 hover:text-white'
                              : 'hover:bg-stone-200 text-stone-400 hover:text-stone-700'
                          }`}
                          title={`Remove "${tag}" from history`}
                          aria-label={`Remove "${tag}" from history`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Active Search Query Feedback Banner */}
            {searchQuery.trim() && (
              <div className="flex items-center justify-between bg-purple-50/70 border border-purple-100 rounded-xl px-3.5 py-2 text-xs">
                <div className="text-stone-700">
                  Showing results for <strong className="text-[#7C3AED]">"{searchQuery}"</strong> ({filteredProducts.length} style{filteredProducts.length === 1 ? '' : 's'} found)
                </div>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[#7C3AED] hover:text-[#6D28D9] font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear search</span>
                </button>
              </div>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 px-6 bg-white rounded-2xl border border-stone-200 shadow-sm">
              {selectedCategory === 'wishlist' ? (
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-[#FFF1F2] text-[#FF3F6C] flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Heart className="w-8 h-8 fill-[#FF3F6C]" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2">
                    Your wishlist is empty
                  </h3>
                  <p className="text-xs text-stone-500 mb-6 leading-relaxed">
                    Save your favorite Kurtis, tailored Co-ords, and trending Dresses by tapping the heart icon. Your saved styles stay saved across browser sessions!
                  </p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    aria-label="Browse catalog"
                    className="px-6 py-3 bg-[#FF3F6C] hover:bg-[#E11D48] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow transition-colors"
                  >
                    Browse Catalog
                  </button>
                </div>
              ) : (
                <>
                  <p className="font-serif text-lg text-stone-800">No styles match your selected filters</p>
                  <p className="text-xs text-stone-500 mt-1 mb-6">Try widening your price range or clearing color selections.</p>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800"
                  >
                    Reset All Filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map(p => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  onSelect={onSelectProduct}
                  isWishlisted={wishlist.includes(p.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          )}
        </main>

      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-sm lg:hidden">
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-stone-200 mb-4">
                  <h3 className="font-serif text-base font-bold text-stone-900">Filters</h3>
                  <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                    <X className="w-5 h-5 text-stone-500" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-800 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                      className="w-full border border-stone-300 rounded-lg p-2 text-xs"
                    >
                      <option value="all">All Categories</option>
                      <option value="wishlist">My Wishlist ({wishlist.length})</option>
                      {categories.map(c => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>Max Price</span>
                      <span>{formatTaka(maxPrice)}</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="8000"
                      step="200"
                      value={maxPrice}
                      onChange={e => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-stone-900"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 space-y-2">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-xs font-bold"
                >
                  Apply Filters ({filteredProducts.length})
                </button>
                <button
                  onClick={handleResetFilters}
                  className="w-full py-2 border border-stone-300 text-stone-700 rounded-lg text-xs"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
