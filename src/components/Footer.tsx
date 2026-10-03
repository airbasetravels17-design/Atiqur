import React from 'react';
import { NewsletterSubscription } from './NewsletterSubscription';
import { QrCode } from 'lucide-react';

interface FooterProps {
  onCategoryClick?: (slug: string) => void;
  onNavigate?: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onCategoryClick, onNavigate }) => {
  return (
    <footer className="bg-[#FAF9F8] border-t border-stone-200 pt-12 pb-8 text-stone-600 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
          
          {/* Newsletter Subscription Component with Custom Validation Hook */}
          <div className="lg:col-span-2 pr-0 lg:pr-6">
            <NewsletterSubscription
              title="Stay In The Loop"
              subtitle="Subscribe to receive 10% off your first order, private festive sale invites, and seasonal lookbook releases."
            />
            <div className="text-[11px] text-stone-400 pt-4">
              &copy; {new Date().getFullYear()} Women's Fit. All Rights Reserved.
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h5 className="font-extrabold text-stone-900 uppercase text-xs mb-3">Shop</h5>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li>
                <button 
                  onClick={() => onCategoryClick ? onCategoryClick('women') : onNavigate?.('shop', 'women')} 
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Women
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onCategoryClick ? onCategoryClick('men') : onNavigate?.('shop', 'men')} 
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Men
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onCategoryClick ? onCategoryClick('kids') : onNavigate?.('shop', 'kids')} 
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Kids
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onCategoryClick ? onCategoryClick('beauty') : onNavigate?.('shop', 'beauty')} 
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Beauty
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onCategoryClick ? onCategoryClick('home-living') : onNavigate?.('shop', 'home-living')} 
                  className="hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Home & Living
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onCategoryClick ? onCategoryClick('sale') : onNavigate?.('shop', 'sale')} 
                  className="hover:text-[#FF3F6C] font-semibold transition-colors cursor-pointer"
                >
                  Sale
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h5 className="font-extrabold text-stone-900 uppercase text-xs mb-3">Customer Care</h5>
            <ul className="space-y-1.5 text-xs text-stone-600">
              <li>
                <button 
                  onClick={() => onNavigate?.('my-orders')} 
                  className="hover:text-stone-900 transition-colors font-medium text-left cursor-pointer"
                >
                  My Orders (Phone Lookup)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate?.('track')} 
                  className="hover:text-stone-900 transition-colors text-left cursor-pointer"
                >
                  Track Order Status
                </button>
              </li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Concierge hotline: +880 1700-000000 (9am - 10pm daily)"); }} className="hover:text-stone-900 transition-colors">Contact Us</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Free delivery on orders over ৳1,000 inside Dhaka. Standard delivery inside Dhaka: 48h (৳80), outside Dhaka: 72h (৳150)."); }} className="hover:text-stone-900 transition-colors">Shipping & FAQ</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Hassle-free 7-day exchange available on unworn items with tags intact."); }} className="hover:text-stone-900 transition-colors">Exchange & Returns</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Standard Asian Size Chart: XS (32-34\"), S (36\"), M (38\"), L (40\"), XL (42\"), XXL (44\")."); }} className="hover:text-stone-900 transition-colors">Size Guide</a></li>
            </ul>
          </div>

          {/* About Us & Mobile App */}
          <div>
            <h5 className="font-extrabold text-stone-900 uppercase text-xs mb-3">About Us</h5>
            <ul className="space-y-1.5 text-xs text-stone-600 mb-4">
              <li><a href="#" className="hover:text-stone-900 transition-colors">About Women's Fit</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">Our Outlets</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">Privacy Policy</a></li>
            </ul>
            
            <div className="pt-2 border-t border-stone-200">
              <div className="font-extrabold text-[11px] text-stone-900 uppercase mb-2">Women's Fit Mobile App</div>
              <div className="flex items-center gap-2">
                <div className="p-1 bg-white border border-stone-200 rounded">
                  <QrCode className="w-8 h-8 text-stone-900" />
                </div>
                <div className="text-[10px] text-stone-500">Scan to download app for iOS & Android</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Value Promises and Payment Badges */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div className="text-stone-500 text-[11px]">
            100% Genuine Atelier Products · Nationwide Express Delivery · Cash on Delivery Available
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded text-[11px] font-bold text-blue-700">VISA</span>
            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded text-[11px] font-bold text-red-600">Mastercard</span>
            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded text-[11px] font-bold text-teal-700">bKash</span>
            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded text-[11px] font-bold text-orange-600">Nagad</span>
            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded text-[11px] font-bold text-purple-700">Rocket</span>
            <span className="px-2 py-0.5 bg-white border border-stone-200 rounded text-[11px] font-bold text-stone-800">COD</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
