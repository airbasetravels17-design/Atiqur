import React from 'react';
import { CartItem } from '../types/ecommerce';
import { formatTaka } from '../utils/format';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (variantId: string, quantity: number) => void;
  onRemoveItem: (variantId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
  const freeShippingThreshold = 1999;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="text-lg font-serif font-bold text-stone-900">Your Shopping Bag</h2>
              <span className="text-xs font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-4 sm:px-6 py-3 bg-stone-50 border-b border-stone-200 text-xs">
            {isFreeShipping ? (
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Congratulations! You qualify for Free Delivery across Bangladesh!</span>
              </div>
            ) : (
              <div>
                <div className="text-stone-700 mb-1.5">
                  Add <strong className="text-stone-900">{formatTaka(remainingForFreeShipping)}</strong> more to get <strong>FREE Delivery</strong>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#E07A5F] h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-stone-500">
                <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                <p className="font-serif text-lg text-stone-800">Your bag is currently empty</p>
                <p className="text-xs text-stone-500 mt-1 mb-6">Explore our new festive kurti and linen co-ord collections.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.variantId}
                  className="flex gap-4 p-3 bg-stone-50/70 border border-stone-200/80 rounded-xl"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-24 object-cover rounded-lg bg-stone-200 shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-sm font-semibold text-stone-900 line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.variantId)}
                          className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant Specs (Color & Size) */}
                      <div className="flex items-center gap-2 text-xs text-stone-600 mt-1">
                        <span className="flex items-center gap-1">
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-black/10" 
                            style={{ backgroundColor: item.colorHex }}
                          />
                          {item.colorName}
                        </span>
                        <span>·</span>
                        <span className="font-semibold bg-white border border-stone-200 px-1.5 py-0.5 rounded text-[11px]">
                          Size {item.sizeCode}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-200/60">
                      {/* Quantity Stepper bounded by variant stock */}
                      <div className="flex items-center border border-stone-300 rounded-md bg-white">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-stone-600 hover:bg-stone-100 text-xs font-bold"
                        >
                          −
                        </button>
                        <span className="px-2 text-xs font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={item.quantity >= item.maxStock}
                          onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-stone-600 hover:bg-stone-100 text-xs font-bold disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-stone-900 tabular-nums">
                          {formatTaka(item.unitPrice * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-[10px] text-stone-400 tabular-nums">
                            {formatTaka(item.unitPrice)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Trigger */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-stone-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-stone-900 tabular-nums">{formatTaka(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Courier Shipping</span>
                  <span className="tabular-nums">
                    {isFreeShipping ? <strong className="text-emerald-600">FREE</strong> : 'Calculated at checkout'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex justify-between items-baseline">
                <span className="font-serif text-base font-bold text-stone-900">Total</span>
                <span className="text-xl font-bold text-stone-900 tabular-nums">{formatTaka(subtotal)}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Proceed To Checkout (COD)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-stone-500">
                🔒 Safe & secure checkout. Pay cash upon receiving your package.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
