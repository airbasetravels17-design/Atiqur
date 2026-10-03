import React, { useState } from 'react';
import { CartItem, Order } from '../types/ecommerce';
import { formatTaka, generateOrderNumber } from '../utils/format';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutViewProps {
  items: CartItem[];
  onOrderPlaced: (order: Order) => void;
  onBackToShop: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  items,
  onOrderPlaced,
  onBackToShop
}) => {
  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [note, setNote] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtotal = items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0);
  const isOutsideDhaka = city !== 'Dhaka';
  const shippingCharge = subtotal >= 1999 ? 0 : (isOutsideDhaka ? 150 : 80);
  const grandTotal = subtotal + shippingCharge;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage('Please enter your full recipient name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMessage('Please provide a valid 11-digit mobile phone number (e.g. 017xxxxxxxx).');
      return;
    }
    if (!address.trim() || address.trim().length < 8) {
      setErrorMessage('Please provide your complete street/building delivery address.');
      return;
    }

    setIsSubmitting(true);

    // Simulate backend transaction
    setTimeout(() => {
      const orderNumber = generateOrderNumber();
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: orderNumber,
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
        deliveryAddress: address.trim(),
        city: city,
        area: area.trim(),
        customerNote: note.trim(),
        subtotal: subtotal,
        shippingCharge: shippingCharge,
        discountAmount: 0,
        grandTotal: grandTotal,
        paymentMethod: 'Cash on Delivery',
        orderStatus: 'Pending',
        createdAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        items: items.map(i => ({
          variantId: i.variantId,
          productId: i.productId,
          name: i.name,
          brand: i.brand || "Women's Fit",
          colorName: i.colorName,
          sizeCode: i.sizeCode,
          sku: `${i.slug.toUpperCase()}-${i.colorName.substring(0,3).toUpperCase()}-${i.sizeCode}`,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          subtotal: i.unitPrice * i.quantity,
          image: i.image
        })),
        history: [
          {
            status: 'Pending',
            comment: 'Order placed via Cash on Delivery',
            timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
            by: 'Customer'
          }
        ]
      };

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}

      setIsSubmitting(false);
      onOrderPlaced(newOrder);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <button
        onClick={onBackToShop}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Column (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-serif font-bold text-stone-900">Delivery Information</h2>
            <p className="text-xs text-stone-500 mt-1">Please enter your shipping address for door-to-door courier dispatch.</p>
          </div>

          {errorMessage && (
            <div className="p-3 mb-6 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Recipient Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Tanzila Ahmed"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Contact Mobile Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="tanzila@example.com"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  City / District *
                </label>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white font-medium"
                >
                  <option value="Dhaka">Dhaka (Inside City)</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barisal">Barisal</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Mymensingh">Mymensingh</option>
                  <option value="Comilla">Comilla</option>
                  <option value="Other Districts">Other Districts (Nationwide)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Thana / Area *
                </label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  placeholder="e.g. Dhanmondi, Banani, Uttara"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Full Street / House Address *
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="House #, Road #, Sector/Block, Flat or Apartment details"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Delivery Instructions (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. Call before delivery, leave with concierge"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:bg-white"
              />
            </div>

            {/* Payment Method Selection */}
            <div className="pt-4 border-t border-stone-200">
              <label className="block text-xs font-semibold text-stone-800 mb-2">
                Payment Option
              </label>
              <div className="p-4 border-2 border-stone-900 rounded-xl bg-stone-50 flex items-start gap-3">
                <div className="w-4 h-4 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 fill-stone-900 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-stone-900">Cash on Delivery (COD)</div>
                  <div className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                    Pay securely in cash to our courier rider when your parcel arrives at your doorstep. Open and inspect in presence of delivery personnel.
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full mt-6 py-3.5 bg-stone-900 text-white rounded-xl font-bold text-sm hover:bg-stone-800 transition-colors shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Placing Order...' : `Confirm Order — ${formatTaka(grandTotal)}`}
            </button>
          </form>
        </div>

        {/* Right Order Summary Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm">
            <h3 className="font-serif text-base font-bold text-stone-900 mb-4">
              Order Summary ({items.length})
            </h3>

            <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.variantId} className="py-3 flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-18 object-cover rounded-lg bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 text-xs">
                    <h4 className="font-semibold text-stone-900 line-clamp-1">{item.name}</h4>
                    <div className="text-stone-500 mt-0.5">
                      <span>Color: {item.colorName}</span> · <span>Size: {item.sizeCode}</span>
                    </div>
                    <div className="flex justify-between items-baseline mt-1.5 font-bold text-stone-800">
                      <span>Qty: {item.quantity}</span>
                      <span className="tabular-nums">{formatTaka(item.unitPrice * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 mt-2 border-t border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900 tabular-nums">{formatTaka(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping ({city === 'Dhaka' ? 'Inside Dhaka' : 'Outside Dhaka'})</span>
                <span className="font-medium tabular-nums">
                  {shippingCharge === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    formatTaka(shippingCharge)
                  )}
                </span>
              </div>
              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                <span className="font-serif text-base font-bold text-stone-900">Total Payable</span>
                <span className="text-xl font-bold text-stone-900 tabular-nums">{formatTaka(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Security Guarantees */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 text-xs space-y-2 text-stone-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-stone-800 shrink-0" />
              <span>Estimated Delivery: <strong>24-48 Hours</strong> (Dhaka) | <strong>3-4 Days</strong> (Other Districts)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-stone-800 shrink-0" />
              <span>100% Original Products directly from Women's Fit atelier</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
