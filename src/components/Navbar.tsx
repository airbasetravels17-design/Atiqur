import React, { useState } from 'react';
import { ShoppingBag, Search, Heart, User, Menu, X, ArrowRight, Package } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  wishlistCount?: number;
  onOpenCart: () => void;
  onNavigate: (view: string, param?: string) => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount = 3,
  onOpenCart,
  onNavigate,
  currentView
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('shop', `search:${searchQuery.trim()}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Mobile Menu Button */}
          <button 
            type="button" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-700 hover:text-stone-900 rounded-md"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo: Women's Fit in Purple/Violet exact style */}
          <button
            onClick={() => onNavigate('home')}
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[#7C3AED] hover:opacity-90 transition-opacity font-sans flex items-center gap-1 shrink-0"
          >
            <span>Women's Fit</span>
          </button>

          {/* Main Category Tabs (WOMEN, MEN, KIDS, BEAUTY, HOME & LIVING, NEW IN, SALE) */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-bold text-stone-800 tracking-wide">
            <button
              onClick={() => onNavigate('shop', 'women')}
              className={`hover:text-[#7C3AED] transition-colors py-2 uppercase ${currentView === 'shop' ? 'text-[#7C3AED]' : ''}`}
            >
              Women
            </button>
            <button
              onClick={() => onNavigate('shop', 'men')}
              className="hover:text-[#7C3AED] transition-colors py-2 uppercase text-stone-700"
            >
              Men
            </button>
            <button
              onClick={() => onNavigate('shop', 'kids')}
              className="hover:text-[#7C3AED] transition-colors py-2 uppercase text-stone-700"
            >
              Kids
            </button>
            <button
              onClick={() => onNavigate('shop', 'beauty')}
              className="hover:text-[#7C3AED] transition-colors py-2 uppercase text-stone-700"
            >
              Beauty
            </button>
            <button
              onClick={() => onNavigate('shop', 'home-living')}
              className="hover:text-[#7C3AED] transition-colors py-2 uppercase text-stone-700 whitespace-nowrap"
            >
              Home & Living
            </button>
            <button
              onClick={() => onNavigate('shop', 'new-in')}
              className="hover:text-[#7C3AED] transition-colors py-2 uppercase text-stone-700 whitespace-nowrap"
            >
              New In
            </button>
            <button
              onClick={() => onNavigate('shop', 'sale')}
              className="hover:opacity-90 transition-opacity py-2 uppercase font-extrabold text-[#FF3F6C]"
            >
              Sale
            </button>
          </nav>

          {/* Search Bar (Rounded input matching Womenfit.jpg) */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands & more"
                className="w-full bg-[#F5F5F6] border border-transparent hover:border-stone-300 focus:border-stone-400 focus:bg-white rounded-full py-2.5 pl-4 pr-10 text-xs text-stone-800 placeholder-stone-400 focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Header Action Icons: Login/Profile, Orders, Wishlist, Bag (Matching Womenfit.jpg) */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            
            {/* My Orders / Phone Lookup */}
            <button
              onClick={() => onNavigate('my-orders')}
              className={`flex flex-col items-center transition-colors relative group ${currentView === 'my-orders' ? 'text-[#7C3AED]' : 'text-stone-700 hover:text-[#7C3AED]'}`}
              title="My Orders & Purchase History"
              aria-label="My Orders"
              data-testid="navbar-my-orders"
            >
              <Package className={`w-5 h-5 transition-colors ${currentView === 'my-orders' ? 'text-[#7C3AED]' : 'text-stone-700 group-hover:text-[#7C3AED]'}`} />
              <span className={`text-[10px] font-semibold mt-0.5 ${currentView === 'my-orders' ? 'text-[#7C3AED] font-bold' : 'text-stone-600'}`}>
                Orders
              </span>
            </button>

            {/* Customer Profile / Track Orders */}
            <button
              onClick={() => onNavigate('track')}
              className={`flex flex-col items-center transition-colors group ${currentView === 'track' ? 'text-[#7C3AED]' : 'text-stone-700 hover:text-[#7C3AED]'}`}
              title="Track Order & Profile"
            >
              <User className="w-5 h-5 text-stone-700 group-hover:text-[#7C3AED]" />
              <span className="text-[10px] font-semibold text-stone-600 mt-0.5">Profile</span>
            </button>

            {/* Wishlist Icon with persistent count */}
            <button
              onClick={() => onNavigate('wishlist')}
              className={`flex flex-col items-center transition-colors relative group ${currentView === 'wishlist' ? 'text-[#FF3F6C]' : 'text-stone-700 hover:text-[#FF3F6C]'}`}
              title="My Wishlist"
              aria-label="Wishlist"
              data-testid="navbar-wishlist"
            >
              <div className="relative">
                <Heart className={`w-5 h-5 group-hover:text-[#FF3F6C] transition-colors ${currentView === 'wishlist' ? 'fill-[#FF3F6C] text-[#FF3F6C]' : 'text-stone-700'}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#FF3F6C] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold mt-0.5 ${currentView === 'wishlist' ? 'text-[#FF3F6C] font-bold' : 'text-stone-600'}`}>
                Wishlist
              </span>
            </button>

            {/* Bag Icon with dynamic cart count */}
            <button
              onClick={onOpenCart}
              className="flex flex-col items-center text-stone-700 hover:text-[#7C3AED] transition-colors relative group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-stone-700 group-hover:text-[#7C3AED]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#FF3F6C] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold text-stone-600 mt-0.5">Bag</span>
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands & more"
                className="w-full bg-[#F5F5F6] rounded-full py-2 pl-4 pr-10 text-xs text-stone-800"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500">
                <Search className="w-4 h-4" />
              </button>
            </form>

            <button
              onClick={() => { onNavigate('shop', 'women'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 font-bold text-stone-900 border-b border-stone-100 uppercase text-xs"
            >
              Women's Collection
            </button>
            <button
              onClick={() => { onNavigate('shop', 'kurtis'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 font-medium text-stone-700 text-xs"
            >
              Kurtis & Ethnic
            </button>
            <button
              onClick={() => { onNavigate('shop', 'dresses'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 font-medium text-stone-700 text-xs"
            >
              Dresses
            </button>
            <button
              onClick={() => { onNavigate('shop', 'co-ord-sets'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 font-medium text-stone-700 text-xs"
            >
              Co-ord Sets
            </button>
            <button
              onClick={() => { onNavigate('shop', 'sarees'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 font-medium text-stone-700 text-xs"
            >
              Sarees
            </button>
            <button
              onClick={() => { onNavigate('shop', 'sale'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 font-bold text-[#FF3F6C] text-xs uppercase"
            >
              Sale — Up to 60% OFF
            </button>
            <button
              onClick={() => { onNavigate('wishlist'); setMobileMenuOpen(false); }}
              className="flex items-center justify-between w-full py-2 font-semibold text-stone-800 text-xs border-t border-stone-100"
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#FF3F6C] fill-[#FF3F6C]" />
                <span>My Saved Wishlist</span>
              </span>
              {wishlistCount > 0 && (
                <span className="bg-[#FF3F6C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={() => { onNavigate('my-orders'); setMobileMenuOpen(false); }}
              className="flex items-center justify-between w-full py-2 font-semibold text-stone-800 text-xs border-t border-stone-100"
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#7C3AED]" />
                <span>My Orders (Lookup by Phone)</span>
              </span>
              <span className="text-[10px] text-stone-400 font-normal">History & Status</span>
            </button>
            <button
              onClick={() => { onNavigate('track'); setMobileMenuOpen(false); }}
              className="block w-full text-left py-2 font-semibold text-stone-800 pt-2 border-t border-stone-100 text-xs"
            >
              Track Order Status
            </button>
          </div>
        )}
      </header>
    </>
  );
};
