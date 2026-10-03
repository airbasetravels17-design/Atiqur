import React from 'react';
import { Order } from '../types/ecommerce';
import { formatTaka } from '../utils/format';
import { CheckCircle2, PackageCheck, Compass, ArrowRight, Home, Package } from 'lucide-react';

interface OrderConfirmationViewProps {
  order: Order;
  onTrackOrder: (orderNumber: string, phone: string) => void;
  onViewMyOrders?: (phone: string) => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  order,
  onTrackOrder,
  onViewMyOrders,
  onContinueShopping
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/90 shadow-sm text-center">
        
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs uppercase tracking-widest font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
          Order Confirmed
        </span>

        <h1 className="font-serif text-3xl font-bold text-stone-900 mt-3 mb-2">
          Thank you for your order!
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          We have received your order and are currently preparing it for courier handover. A confirmation SMS will be sent to your phone.
        </p>

        {/* Order Reference Box */}
        <div className="my-6 p-4 bg-stone-50 rounded-2xl border border-stone-200/80 inline-block text-left max-w-md w-full">
          <div className="flex justify-between items-center text-xs text-stone-500 mb-1">
            <span>Order Number:</span>
            <span className="font-mono font-bold text-stone-900 text-sm">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-stone-500 mb-1">
            <span>Payment Method:</span>
            <span className="font-semibold text-stone-800">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-stone-500">
            <span>Amount to Pay on Delivery:</span>
            <span className="font-bold text-stone-900 text-sm tabular-nums">{formatTaka(order.grandTotal)}</span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="text-left bg-stone-50/50 p-4 rounded-xl border border-stone-100 text-xs text-stone-700 space-y-1 mb-8">
          <div className="font-bold text-stone-900 mb-1">Delivery Destination</div>
          <div>Recipient: <strong>{order.customerName}</strong> ({order.customerPhone})</div>
          <div>Address: {order.deliveryAddress}, {order.area}, {order.city}</div>
        </div>

        {/* Itemized List */}
        <div className="text-left border-t border-stone-200 pt-6 mb-8">
          <h4 className="font-serif text-sm font-bold text-stone-900 mb-3">Ordered Items ({order.items.length})</h4>
          <div className="divide-y divide-stone-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-10 h-12 object-cover rounded bg-stone-100" />
                  <div>
                    <div className="font-semibold text-stone-900">{item.name}</div>
                    <div className="text-stone-500 text-[11px]">{item.colorName} · Size {item.sizeCode} (Qty: {item.quantity})</div>
                  </div>
                </div>
                <span className="font-bold text-stone-800 tabular-nums">{formatTaka(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => onTrackOrder(order.orderNumber, order.customerPhone)}
            className="px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 flex items-center justify-center gap-2 shadow cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Track Order Status</span>
          </button>
          {onViewMyOrders && (
            <button
              onClick={() => onViewMyOrders(order.customerPhone)}
              className="px-6 py-3 bg-[#7C3AED] text-white rounded-xl text-xs font-bold hover:bg-[#6D28D9] flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <Package className="w-4 h-4" />
              <span>View in My Orders</span>
            </button>
          )}
          <button
            onClick={onContinueShopping}
            className="px-6 py-3 border border-stone-300 text-stone-700 hover:text-stone-900 rounded-xl text-xs font-semibold hover:border-stone-400 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Back to Storefront</span>
          </button>
        </div>

      </div>
    </div>
  );
};
