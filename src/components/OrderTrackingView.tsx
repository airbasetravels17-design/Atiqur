import React, { useState } from 'react';
import { Order, OrderStatus } from '../types/ecommerce';
import { formatTaka } from '../utils/format';
import { 
  Search, Compass, CheckCircle2, Clock, Truck, Package, 
  XCircle, ArrowLeft, Check, Sparkles, AlertTriangle 
} from 'lucide-react';

interface OrderTrackingViewProps {
  orders: Order[];
  initialOrderNumber?: string;
  initialPhone?: string;
  onBackToShop: () => void;
}

const STATUS_STEPS: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

const STEP_ICONS: Record<OrderStatus, React.ComponentType<{ className?: string }>> = {
  Pending: Clock,
  Confirmed: CheckCircle2,
  Processing: Package,
  Shipped: Truck,
  Delivered: CheckCircle2,
  Cancelled: XCircle
};

const STATUS_DESCRIPTIONS: Record<OrderStatus, { stageTitle: string; stageDesc: string; etaHint: string }> = {
  Pending: {
    stageTitle: 'Order Received',
    stageDesc: 'Your order was successfully recorded and is pending merchant review.',
    etaHint: 'Estimated confirmation within 2 hours'
  },
  Confirmed: {
    stageTitle: 'Order Confirmed',
    stageDesc: 'Your order and address have been verified by our team and forwarded to picking.',
    etaHint: 'Being prepped for packaging'
  },
  Processing: {
    stageTitle: 'Quality Check & Packaging',
    stageDesc: 'Garments are undergoing quality assurance and placed into sealed packaging.',
    etaHint: 'Courier dispatch today'
  },
  Shipped: {
    stageTitle: 'Handed to Courier (In Transit)',
    stageDesc: 'Parcel is with our courier partner out for doorstep delivery.',
    etaHint: 'Delivering within 24-48 hours'
  },
  Delivered: {
    stageTitle: 'Successfully Delivered',
    stageDesc: 'Parcel was delivered safely to your delivery address.',
    etaHint: 'Delivery completed'
  },
  Cancelled: {
    stageTitle: 'Order Cancelled',
    stageDesc: 'This order was cancelled. Please contact our support team for details.',
    etaHint: 'Order terminated'
  }
};

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  orders,
  initialOrderNumber = '',
  initialPhone = '',
  onBackToShop
}) => {
  const [orderQuery, setOrderQuery] = useState(initialOrderNumber);
  const [phoneQuery, setPhoneQuery] = useState(initialPhone);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (initialOrderNumber) {
      return orders.find(o => o.orderNumber.toLowerCase() === initialOrderNumber.toLowerCase()) || null;
    }
    return orders[0] || null;
  });
  const [hasSearched, setHasSearched] = useState(!!initialOrderNumber);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    setHasSearched(true);

    const q = orderQuery.trim().toLowerCase();
    const p = phoneQuery.trim();

    if (!q) {
      setSearchError('Please enter your Order ID (e.g. WF-20261003-1042).');
      return;
    }

    const found = orders.find(o => {
      const matchNum = o.orderNumber.toLowerCase() === q;
      if (p) {
        return matchNum && o.customerPhone.includes(p);
      }
      return matchNum;
    });

    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchedOrder(null);
      setSearchError(`No order found matching "${orderQuery}". Please check your order reference code.`);
    }
  };

  const getStepStatus = (step: OrderStatus, currentStatus: OrderStatus) => {
    if (currentStatus === 'Cancelled') return 'cancelled';
    const stepIdx = STATUS_STEPS.indexOf(step);
    const currentIdx = STATUS_STEPS.indexOf(currentStatus);
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Return button */}
      <button
        onClick={onBackToShop}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Storefront</span>
      </button>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-2">Track Your Order</h1>
        <p className="text-xs text-stone-500">
          Enter your unique order number and contact mobile number to view real-time courier fulfillment progress.
        </p>
      </div>

      {/* Search Bar Form */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm max-w-2xl mx-auto mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">Order Number *</label>
            <input
              type="text"
              required
              value={orderQuery}
              onChange={e => setOrderQuery(e.target.value)}
              placeholder="e.g. WF-20261003-1042"
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900 font-mono"
            />
          </div>
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-semibold text-stone-700 mb-1">Phone Number (Optional)</label>
            <input
              type="tel"
              value={phoneQuery}
              onChange={e => setPhoneQuery(e.target.value)}
              placeholder="017xxxxxxxx"
              className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>
          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full py-2 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800 transition-colors flex items-center justify-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>
          </div>
        </form>

        {searchError && (
          <div className="mt-3 p-2.5 bg-red-50 text-red-700 rounded-lg text-xs">
            {searchError}
          </div>
        )}
      </div>

      {/* Order Status Result */}
      {searchedOrder ? (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
          
          {/* Order Header Summary */}
          <div className="p-6 bg-stone-50 border-b border-stone-200 flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="text-xs text-stone-500">Order Reference</div>
              <div className="font-mono text-lg font-bold text-stone-900">{searchedOrder.orderNumber}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Order Placed</div>
              <div className="text-xs font-semibold text-stone-800">{searchedOrder.createdAt}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500">Payment & Total</div>
              <div className="text-sm font-bold text-stone-900 tabular-nums">
                {formatTaka(searchedOrder.grandTotal)} ({searchedOrder.paymentMethod})
              </div>
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                searchedOrder.orderStatus === 'Delivered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : searchedOrder.orderStatus === 'Cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {searchedOrder.orderStatus}
              </span>
            </div>
          </div>

          {/* Stepper Timeline & Visual Progress Bar */}
          {searchedOrder.orderStatus !== 'Cancelled' ? (
            (() => {
              const currentStepIdx = STATUS_STEPS.indexOf(searchedOrder.orderStatus);
              const isDelivered = searchedOrder.orderStatus === 'Delivered';
              const progressPercent = currentStepIdx >= 0
                ? Math.round((currentStepIdx / (STATUS_STEPS.length - 1)) * 100)
                : 0;
              const currentStageInfo = STATUS_DESCRIPTIONS[searchedOrder.orderStatus] || {
                stageTitle: searchedOrder.orderStatus,
                stageDesc: 'Tracking status update in progress.',
                etaHint: ''
              };

              return (
                <div className="p-6 sm:p-8">
                  {/* Visual Progress Bar Card */}
                  <div className="mb-8 p-5 bg-gradient-to-r from-purple-50/70 via-pink-50/40 to-stone-50 rounded-2xl border border-stone-200/90 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED]">
                            Delivery Stage Progress
                          </span>
                          <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
                        </div>
                        <div className="text-base font-bold text-stone-900 mt-0.5">
                          {currentStageInfo.stageTitle}
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5 max-w-xl">
                          {currentStageInfo.stageDesc}
                        </p>
                      </div>
                      <div className="sm:text-right shrink-0">
                        <div className="inline-flex items-center gap-1.5 bg-white border border-purple-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
                          <span className="text-xs font-mono font-bold text-[#7C3AED] tabular-nums">
                            {progressPercent}% Complete
                          </span>
                        </div>
                        {currentStageInfo.etaHint && (
                          <div className="text-[10px] text-stone-400 font-medium mt-1">
                            {currentStageInfo.etaHint}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Visual Progress Bar Track & Fill */}
                    <div className="relative w-full bg-stone-200/80 rounded-full h-3.5 p-0.5 overflow-hidden shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${
                          isDelivered
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#FF3F6C]'
                        }`}
                        style={{ width: `${Math.max(progressPercent, 5)}%` }}
                        role="progressbar"
                        aria-valuenow={progressPercent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Order status is ${searchedOrder.orderStatus}, ${progressPercent}% complete`}
                      />
                    </div>

                    {/* Progress Markers */}
                    <div className="flex justify-between items-center text-[10px] text-stone-500 font-medium mt-2 px-1">
                      <span className={currentStepIdx >= 0 ? 'text-[#7C3AED] font-semibold' : ''}>Placed (0%)</span>
                      <span className={currentStepIdx >= 1 ? 'text-[#7C3AED] font-semibold' : ''}>Confirmed (25%)</span>
                      <span className={currentStepIdx >= 2 ? 'text-[#7C3AED] font-semibold' : ''}>Processing (50%)</span>
                      <span className={currentStepIdx >= 3 ? 'text-[#7C3AED] font-semibold' : ''}>Shipped (75%)</span>
                      <span className={isDelivered ? 'text-emerald-600 font-bold' : ''}>Delivered (100%)</span>
                    </div>
                  </div>

                  {/* Stepper Timeline with Connecting Progress Line */}
                  <div>
                    <h3 className="font-serif text-sm font-bold text-stone-900 mb-6">Delivery Milestone Stages</h3>
                    <div className="relative flex justify-between">
                      {/* Connecting Line Track */}
                      <div className="absolute top-5 left-6 right-6 h-1.5 bg-stone-200 rounded-full z-0 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${
                            isDelivered
                              ? 'bg-emerald-500'
                              : 'bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#FF3F6C]'
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>

                      {STATUS_STEPS.map((step, idx) => {
                        const state = getStepStatus(step, searchedOrder.orderStatus);
                        const StepIcon = STEP_ICONS[step];
                        return (
                          <div key={step} className="relative z-10 flex flex-col items-center text-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                              state === 'completed'
                                ? 'bg-emerald-600 text-white shadow-emerald-200'
                                : state === 'current'
                                ? 'bg-[#7C3AED] text-white ring-4 ring-purple-100 shadow-md scale-110'
                                : 'bg-white border-2 border-stone-300 text-stone-400'
                            }`}>
                              {state === 'completed' ? (
                                <Check className="w-5 h-5 stroke-[2.5]" />
                              ) : (
                                <StepIcon className="w-4 h-4" />
                              )}
                            </div>
                            <span className={`text-[11px] font-semibold mt-2.5 ${
                              state === 'current'
                                ? 'text-[#7C3AED] font-bold'
                                : state === 'completed'
                                ? 'text-stone-800 font-medium'
                                : 'text-stone-400'
                            }`}>
                              {step}
                            </span>
                            {state === 'current' && (
                              <span className="text-[9px] bg-purple-100 text-[#7C3AED] font-bold px-2 py-0.5 rounded-full mt-1 border border-purple-200/80">
                                Current Stage
                              </span>
                            )}
                            {state === 'completed' && (
                              <span className="text-[9px] text-emerald-600 font-medium mt-0.5">
                                Done
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="p-6 bg-red-50 text-red-700 text-xs flex items-center gap-2">
              <XCircle className="w-5 h-5 shrink-0" />
              <span>This order has been cancelled. For inquiries please call our customer concierge at +880 1711-000000.</span>
            </div>
          )}

          {/* Status Event Log */}
          <div className="px-6 pb-6 pt-2">
            <h4 className="font-serif text-xs font-bold text-stone-900 mb-3">Status Activity Logs</h4>
            <div className="space-y-2 border-l-2 border-stone-200 pl-4 text-xs">
              {searchedOrder.history.map((h, i) => (
                <div key={i} className="relative pb-2">
                  <div className="font-semibold text-stone-800">{h.status} — {h.comment}</div>
                  <div className="text-[10px] text-stone-400">{h.timestamp} · Logged by {h.by}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Items breakdown */}
          <div className="p-6 bg-stone-50/60 border-t border-stone-200">
            <h4 className="font-serif text-xs font-bold text-stone-900 mb-3">Parcel Items ({searchedOrder.items.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searchedOrder.items.map((item, idx) => (
                <div key={idx} className="flex gap-3 p-2 bg-white rounded-lg border border-stone-200 text-xs">
                  <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-12 h-14 object-cover rounded bg-stone-100 shrink-0" />
                  <div>
                    <div className="font-semibold text-stone-900">{item.name}</div>
                    <div className="text-stone-500 text-[11px]">{item.colorName} · Size {item.sizeCode}</div>
                    <div className="text-stone-800 font-bold mt-1">Qty: {item.quantity} · {formatTaka(item.subtotal)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : hasSearched ? (
        <div className="text-center py-12 text-stone-500">
          <Compass className="w-12 h-12 mx-auto text-stone-300 mb-3" />
          <p className="text-sm">No order found matching your search.</p>
        </div>
      ) : null}
    </div>
  );
};
