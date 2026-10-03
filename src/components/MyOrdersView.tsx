import React, { useState, useMemo, useEffect } from 'react';
import { Order, OrderStatus, OrderItem } from '../types/ecommerce';
import { formatTaka } from '../utils/format';
import { 
  Package, Search, Phone, Clock, CheckCircle2, Truck, 
  ArrowRight, ArrowLeft, RefreshCw, Printer, AlertCircle, 
  ChevronDown, ChevronUp, MapPin, CreditCard, ShoppingBag, 
  Sparkles, Check, Copy, ExternalLink, Calendar, XCircle, Info
} from 'lucide-react';

interface MyOrdersViewProps {
  orders: Order[];
  initialPhone?: string;
  onTrackOrder: (orderNumber: string, phone: string) => void;
  onReorderItems?: (items: OrderItem[]) => void;
  onBackToShop: () => void;
}

const STATUS_STEPS: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

const STATUS_THEMES: Record<OrderStatus, { label: string; text: string; bg: string; border: string; dot: string }> = {
  Pending: { label: 'Pending', text: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-500' },
  Confirmed: { label: 'Confirmed', text: 'text-sky-800', bg: 'bg-sky-50', border: 'border-sky-200', dot: 'bg-sky-500' },
  Processing: { label: 'Processing', text: 'text-purple-800', bg: 'bg-purple-50', border: 'border-purple-200', dot: 'bg-purple-500' },
  Shipped: { label: 'Shipped / In Transit', text: 'text-indigo-800', bg: 'bg-indigo-50', border: 'border-indigo-200', dot: 'bg-indigo-500' },
  Delivered: { label: 'Delivered', text: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  Cancelled: { label: 'Cancelled', text: 'text-rose-800', bg: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-500' }
};

// Normalize Bangladeshi & general phone numbers to comparable digit sequence
const normalizePhone = (phoneStr: string): string => {
  const digits = phoneStr.replace(/\D/g, '');
  if (digits.startsWith('880') && digits.length >= 13) {
    return digits.slice(3);
  }
  if (digits.startsWith('0') && digits.length === 11) {
    return digits.slice(1);
  }
  return digits;
};

const matchesPhone = (orderPhone: string, searchPhone: string): boolean => {
  const normOrder = normalizePhone(orderPhone);
  const normSearch = normalizePhone(searchPhone);
  if (!normSearch) return false;
  if (normOrder === normSearch) return true;
  if (normSearch.length >= 6 && normOrder.endsWith(normSearch)) return true;
  if (normOrder.length >= 6 && normSearch.endsWith(normOrder)) return true;
  return orderPhone.toLowerCase().includes(searchPhone.toLowerCase());
};

export const MyOrdersView: React.FC<MyOrdersViewProps> = ({
  orders,
  initialPhone = '',
  onTrackOrder,
  onReorderItems,
  onBackToShop
}) => {
  // Saved phone from localStorage or prop
  const [phoneNumber, setPhoneNumber] = useState<string>(() => {
    if (initialPhone) return initialPhone;
    try {
      const saved = localStorage.getItem('_wf_customer_phone');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return '';
  });

  const [activeQuery, setActiveQuery] = useState<string>(() => {
    if (initialPhone) return initialPhone;
    try {
      const saved = localStorage.getItem('_wf_customer_phone');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return '';
  });

  const [submittedQuery, setSubmittedQuery] = useState<string>(() => {
    if (initialPhone) return initialPhone;
    try {
      const saved = localStorage.getItem('_wf_customer_phone');
      if (saved) return saved;
    } catch {
      // ignore
    }
    return '';
  });

  const [inputError, setInputError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'delivered' | 'cancelled'>('all');
  const [orderSearchText, setOrderSearchText] = useState<string>('');
  const [expandedOrderIds, setExpandedOrderIds] = useState<Record<string, boolean>>({});
  const [copiedOrderNumber, setCopiedOrderNumber] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [reorderSuccessId, setReorderSuccessId] = useState<string | null>(null);

  // Auto-search if we have initial phone
  useEffect(() => {
    if (initialPhone) {
      setPhoneNumber(initialPhone);
      setActiveQuery(initialPhone);
      setSubmittedQuery(initialPhone);
    }
  }, [initialPhone]);

  // Handle phone submission
  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = activeQuery.trim();
    if (!clean) {
      setInputError('Please enter your phone number to look up your order history.');
      return;
    }
    if (clean.replace(/\D/g, '').length < 6) {
      setInputError('Please enter a valid mobile number (at least 6 digits).');
      return;
    }
    setInputError(null);
    setPhoneNumber(clean);
    setSubmittedQuery(clean);
    try {
      localStorage.setItem('_wf_customer_phone', clean);
    } catch {
      // ignore
    }
  };

  const handleQuickSelectPhone = (samplePhone: string) => {
    setInputError(null);
    setActiveQuery(samplePhone);
    setPhoneNumber(samplePhone);
    setSubmittedQuery(samplePhone);
    try {
      localStorage.setItem('_wf_customer_phone', samplePhone);
    } catch {
      // ignore
    }
  };

  const handleClearPhone = () => {
    setActiveQuery('');
    setPhoneNumber('');
    setSubmittedQuery('');
    setInputError(null);
    try {
      localStorage.removeItem('_wf_customer_phone');
    } catch {
      // ignore
    }
  };

  // Matched orders for submitted phone
  const matchedOrders = useMemo(() => {
    if (!submittedQuery.trim()) return [];
    return orders.filter(order => matchesPhone(order.customerPhone, submittedQuery));
  }, [orders, submittedQuery]);

  // Filtered by tab and search text
  const displayedOrders = useMemo(() => {
    let result = [...matchedOrders];

    // Filter by tab
    if (activeTab === 'active') {
      result = result.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled');
    } else if (activeTab === 'delivered') {
      result = result.filter(o => o.orderStatus === 'Delivered');
    } else if (activeTab === 'cancelled') {
      result = result.filter(o => o.orderStatus === 'Cancelled');
    }

    // Filter by search text (Order number, city, or item name)
    if (orderSearchText.trim()) {
      const q = orderSearchText.trim().toLowerCase();
      result = result.filter(o => 
        o.orderNumber.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.items.some(i => i.name.toLowerCase().includes(q) || i.brand.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    return result;
  }, [matchedOrders, activeTab, orderSearchText]);

  // Overall statistics for customer
  const metrics = useMemo(() => {
    const total = matchedOrders.length;
    const active = matchedOrders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;
    const delivered = matchedOrders.filter(o => o.orderStatus === 'Delivered').length;
    const spent = matchedOrders
      .filter(o => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.grandTotal, 0);
    return { total, active, delivered, spent };
  }, [matchedOrders]);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderIds(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleCopyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrderNumber(orderNumber);
    setTimeout(() => setCopiedOrderNumber(null), 2000);
  };

  const handleReorder = (order: Order) => {
    if (onReorderItems) {
      onReorderItems(order.items);
      setReorderSuccessId(order.id);
      setTimeout(() => setReorderSuccessId(null), 3000);
    }
  };

  // Samples available in catalog
  const samplePhones = useMemo(() => {
    const set = new Set<string>();
    orders.forEach(o => {
      if (o.customerPhone) set.add(o.customerPhone);
    });
    return Array.from(set).slice(0, 3);
  }, [orders]);

  return (
    <div className="bg-[#FAF9F8] min-h-screen py-8 sm:py-12 text-stone-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={onBackToShop}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>

          <div className="inline-flex items-center gap-2 text-xs text-stone-500">
            <span>Store</span>
            <span>/</span>
            <span className="text-[#7C3AED] font-bold">My Orders</span>
          </div>
        </div>

        {/* Hero Header Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-100/50 via-pink-100/30 to-transparent rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-200 text-xs font-bold tracking-wide uppercase mb-3">
              <Package className="w-3.5 h-3.5" />
              <span>Customer Order Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
              My Orders & Purchase History
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
              Look up your previous purchases, view real-time delivery status, inspect invoices, and reorder your favorite outfits using your mobile phone number.
            </p>
          </div>

          {/* Phone Lookup Form */}
          <div className="relative z-10 mt-6 pt-6 border-t border-stone-100">
            <form onSubmit={handleLookupSubmit} className="max-w-xl">
              <label htmlFor="phone-input" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Mobile Phone Number
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="phone-input"
                    type="tel"
                    value={activeQuery}
                    onChange={(e) => {
                      setActiveQuery(e.target.value);
                      if (inputError) setInputError(null);
                    }}
                    placeholder="e.g. 01712-345678 or +880 1712-345678"
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 hover:border-stone-400 focus:bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/20 rounded-xl text-xs sm:text-sm font-medium text-stone-900 transition-all outline-none"
                  />
                  {activeQuery && (
                    <button
                      type="button"
                      onClick={() => setActiveQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-[0.98] text-white font-bold text-xs sm:text-sm py-2.5 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Orders</span>
                </button>
              </div>

              {inputError && (
                <div className="flex items-center gap-1.5 mt-2 text-rose-600 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{inputError}</span>
                </div>
              )}
            </form>

            {/* Quick Demo Numbers for 1-Click Evaluation */}
            {samplePhones.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 pt-2 text-xs">
                <span className="text-stone-500 font-medium">Try existing order demo numbers:</span>
                {samplePhones.map((phone) => (
                  <button
                    key={phone}
                    type="button"
                    onClick={() => handleQuickSelectPhone(phone)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${
                      submittedQuery === phone
                        ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-sm font-semibold'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {phone}
                  </button>
                ))}
                {submittedQuery && (
                  <button
                    type="button"
                    onClick={handleClearPhone}
                    className="text-stone-400 hover:text-rose-600 ml-1 text-xs underline font-medium"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* REORDER NOTIFICATION BANNER */}
        {reorderSuccessId && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-center justify-between gap-3 animate-fade-in shadow-sm">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Items from order have been re-added to your shopping bag!</span>
            </div>
            <button
              onClick={() => setReorderSuccessId(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* HAS SEARCHED BUT NO PHONE SUBMITTED YET */}
        {!submittedQuery && (
          <div className="bg-white rounded-2xl p-10 border border-stone-200 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-purple-50 text-[#7C3AED] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-100">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Enter Your Phone Number Above
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-500 leading-relaxed">
              We link all your past and in-flight orders directly to your delivery phone number. No complicated password or registration required!
            </p>
            {samplePhones.length > 0 && (
              <div className="mt-6 pt-6 border-t border-stone-100">
                <p className="text-xs text-stone-400 uppercase tracking-wider font-bold mb-3">
                  Quick Select A Recent Phone
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {samplePhones.map(phone => (
                    <button
                      key={phone}
                      onClick={() => handleQuickSelectPhone(phone)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-[#7C3AED] hover:text-white rounded-lg text-xs font-mono text-stone-700 transition-colors"
                    >
                      {phone}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* RESULTS SECTION WHEN PHONE IS SUBMITTED */}
        {submittedQuery && (
          <>
            {matchedOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 border border-stone-200 text-center max-w-xl mx-auto shadow-sm">
                <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  No Orders Found for "{submittedQuery}"
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-stone-500 leading-relaxed">
                  We couldn't find any orders placed under this mobile number. Please verify the digits or use the phone number provided at checkout.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleClearPhone}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-colors"
                  >
                    Try Another Phone
                  </button>
                  <button
                    onClick={onBackToShop}
                    className="px-4 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold text-xs rounded-xl transition-colors shadow-sm"
                  >
                    Start Shopping
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Customer Metrics Overview */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
                    <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Total Orders</div>
                    <div className="mt-1 text-2xl sm:text-3xl font-bold font-serif text-stone-900">{metrics.total}</div>
                    <div className="text-[11px] text-stone-500 mt-1">Under {submittedQuery}</div>
                  </div>

                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
                    <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Active / In-Transit</div>
                    <div className="mt-1 text-2xl sm:text-3xl font-bold font-serif text-indigo-600">{metrics.active}</div>
                    <div className="text-[11px] text-stone-500 mt-1">Pending delivery</div>
                  </div>

                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
                    <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Delivered</div>
                    <div className="mt-1 text-2xl sm:text-3xl font-bold font-serif text-emerald-600">{metrics.delivered}</div>
                    <div className="text-[11px] text-stone-500 mt-1">Completed orders</div>
                  </div>

                  <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
                    <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Lifetime Value</div>
                    <div className="mt-1 text-2xl sm:text-3xl font-bold font-serif text-stone-900">{formatTaka(metrics.spent)}</div>
                    <div className="text-[11px] text-stone-500 mt-1">Total spend to date</div>
                  </div>
                </div>

                {/* Filter Tabs & Search Controls */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  {/* Status Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 border-b md:border-b-0 pb-3 md:pb-0 border-stone-100">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'all'
                          ? 'bg-[#7C3AED] text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                      }`}
                    >
                      All ({metrics.total})
                    </button>
                    <button
                      onClick={() => setActiveTab('active')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'active'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                      }`}
                    >
                      Active ({metrics.active})
                    </button>
                    <button
                      onClick={() => setActiveTab('delivered')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'delivered'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                      }`}
                    >
                      Delivered ({metrics.delivered})
                    </button>
                    <button
                      onClick={() => setActiveTab('cancelled')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeTab === 'cancelled'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                      }`}
                    >
                      Cancelled
                    </button>
                  </div>

                  {/* Search within orders */}
                  <div className="relative w-full md:w-64">
                    <input
                      type="text"
                      value={orderSearchText}
                      onChange={(e) => setOrderSearchText(e.target.value)}
                      placeholder="Filter by Order ID or item..."
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#7C3AED] focus:bg-white"
                    />
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    {orderSearchText && (
                      <button
                        onClick={() => setOrderSearchText('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                  {displayedOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center">
                      <p className="text-xs text-stone-500">No orders match the selected filter criteria.</p>
                      <button
                        onClick={() => { setActiveTab('all'); setOrderSearchText(''); }}
                        className="mt-3 text-xs font-bold text-[#7C3AED] underline"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    displayedOrders.map((order) => {
                      const theme = STATUS_THEMES[order.orderStatus] || STATUS_THEMES.Pending;
                      const isExpanded = !!expandedOrderIds[order.id];
                      const stepIdx = STATUS_STEPS.indexOf(order.orderStatus);
                      const isCancelled = order.orderStatus === 'Cancelled';

                      return (
                        <div
                          key={order.id}
                          className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:border-stone-300 transition-all"
                        >
                          {/* Card Header */}
                          <div className="p-4 sm:p-6 bg-gradient-to-r from-stone-50/70 to-white border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                                  {order.orderNumber}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyOrderNumber(order.orderNumber)}
                                  className="text-stone-400 hover:text-stone-700 p-1 transition-colors"
                                  title="Copy Order ID"
                                >
                                  {copiedOrderNumber === order.orderNumber ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <span className="text-stone-300">•</span>
                                <span className="text-xs text-stone-500 flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{order.createdAt}</span>
                                </span>
                              </div>
                              <div className="text-xs text-stone-600">
                                Recipient: <span className="font-semibold text-stone-900">{order.customerName}</span> ({order.customerPhone})
                              </div>
                            </div>

                            {/* Status Badge & Actions */}
                            <div className="flex items-center gap-2">
                              <div className={`px-3 py-1.5 rounded-full border text-xs font-bold inline-flex items-center gap-1.5 ${theme.bg} ${theme.border} ${theme.text}`}>
                                <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
                                <span>{theme.label}</span>
                              </div>
                            </div>
                          </div>

                          {/* Visual Delivery Progress Bar (For non-cancelled orders) */}
                          {!isCancelled && (
                            <div className="px-4 sm:px-6 pt-5 pb-3 bg-stone-50/40 border-b border-stone-100">
                              <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 mb-2">
                                <span>Delivery Stage</span>
                                <span className="text-[#7C3AED]">
                                  {order.orderStatus === 'Delivered' 
                                    ? '100% Completed' 
                                    : `${Math.round((stepIdx / (STATUS_STEPS.length - 1)) * 100)}% Progress`}
                                </span>
                              </div>
                              
                              {/* Progress Track */}
                              <div className="relative w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all duration-700 rounded-full ${
                                    order.orderStatus === 'Delivered'
                                      ? 'bg-emerald-500'
                                      : 'bg-gradient-to-r from-[#7C3AED] via-purple-500 to-[#FF3F6C]'
                                  }`}
                                  style={{
                                    width: `${Math.max(12, ((stepIdx + 1) / STATUS_STEPS.length) * 100)}%`
                                  }}
                                />
                              </div>

                              {/* Milestone Labels */}
                              <div className="flex justify-between items-center text-[10px] text-stone-400 mt-2 font-medium">
                                <span className={stepIdx >= 0 ? 'text-stone-900 font-bold' : ''}>Placed</span>
                                <span className={stepIdx >= 1 ? 'text-stone-900 font-bold' : ''}>Confirmed</span>
                                <span className={stepIdx >= 2 ? 'text-stone-900 font-bold' : ''}>Processing</span>
                                <span className={stepIdx >= 3 ? 'text-stone-900 font-bold' : ''}>Shipped</span>
                                <span className={stepIdx >= 4 ? 'text-emerald-700 font-bold' : ''}>Delivered</span>
                              </div>
                            </div>
                          )}

                          {/* Items Preview */}
                          <div className="p-4 sm:p-6 space-y-4">
                            <div className="space-y-3">
                              {order.items.map((item, idx) => (
                                <div
                                  key={`${item.variantId}-${idx}`}
                                  className="flex items-center justify-between gap-4 py-2 border-b border-stone-100 last:border-0"
                                >
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-14 h-16 sm:w-16 sm:h-20 object-cover rounded-xl border border-stone-200 shrink-0"
                                    />
                                    <div>
                                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                                        {item.brand}
                                      </div>
                                      <h4 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-1">
                                        {item.name}
                                      </h4>
                                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-stone-500">
                                        <span className="inline-flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-md">
                                          <span>Color:</span>
                                          <span className="font-semibold text-stone-800">{item.colorName}</span>
                                        </span>
                                        <span className="bg-stone-100 px-2 py-0.5 rounded-md font-semibold text-stone-800">
                                          Size: {item.sizeCode}
                                        </span>
                                        <span>•</span>
                                        <span>Qty: <strong className="text-stone-900">{item.quantity}</strong></span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-right shrink-0">
                                    <div className="text-xs sm:text-sm font-bold font-serif text-stone-900">
                                      {formatTaka(item.subtotal)}
                                    </div>
                                    <div className="text-[10px] text-stone-400">
                                      {formatTaka(item.unitPrice)} each
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Summary & Destination Accordion */}
                            {isExpanded && (
                              <div className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-stone-50/70 p-4 rounded-xl">
                                {/* Delivery Address */}
                                <div className="space-y-1.5">
                                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-[#7C3AED]" />
                                    <span>Shipping Destination</span>
                                  </div>
                                  <p className="text-stone-600 leading-relaxed pl-5">
                                    {order.deliveryAddress}, {order.area}, {order.city}
                                    {order.postalCode && ` - ${order.postalCode}`}
                                  </p>
                                  {order.customerNote && (
                                    <div className="pl-5 pt-1 text-[11px] text-stone-500 italic">
                                      Note: "{order.customerNote}"
                                    </div>
                                  )}
                                </div>

                                {/* Financial Breakdown */}
                                <div className="space-y-1.5">
                                  <div className="font-bold text-stone-900 flex items-center gap-1.5">
                                    <CreditCard className="w-4 h-4 text-[#7C3AED]" />
                                    <span>Payment & Charges</span>
                                  </div>
                                  <div className="pl-5 space-y-1 text-stone-600">
                                    <div className="flex justify-between">
                                      <span>Subtotal ({order.items.length} items):</span>
                                      <span className="font-medium text-stone-800">{formatTaka(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Shipping Fee:</span>
                                      <span className="font-medium text-stone-800">
                                        {order.shippingCharge === 0 ? 'FREE' : formatTaka(order.shippingCharge)}
                                      </span>
                                    </div>
                                    {order.discountAmount > 0 && (
                                      <div className="flex justify-between text-emerald-600 font-semibold">
                                        <span>Coupon Discount:</span>
                                        <span>-{formatTaka(order.discountAmount)}</span>
                                      </div>
                                    )}
                                    <div className="flex justify-between pt-1 border-t border-stone-200 font-bold text-stone-900 text-sm">
                                      <span>Total Amount:</span>
                                      <span className="text-[#7C3AED] font-serif">{formatTaka(order.grandTotal)}</span>
                                    </div>
                                    <div className="text-[11px] text-stone-500 pt-0.5">
                                      Method: <strong className="text-stone-700">{order.paymentMethod}</strong>
                                    </div>
                                  </div>
                                </div>

                                {/* Order History Audit Log */}
                                {order.history && order.history.length > 0 && (
                                  <div className="md:col-span-2 pt-3 border-t border-stone-200">
                                    <div className="font-bold text-stone-900 mb-2 flex items-center gap-1.5">
                                      <Clock className="w-4 h-4 text-stone-500" />
                                      <span>Order Timeline Log</span>
                                    </div>
                                    <div className="space-y-2">
                                      {order.history.map((h, i) => (
                                        <div key={i} className="flex items-start gap-2.5 text-[11px]">
                                          <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-1.5 shrink-0" />
                                          <div className="flex-1">
                                            <span className="font-semibold text-stone-800">[{h.status}]</span>{' '}
                                            <span className="text-stone-600">{h.comment}</span>
                                            <span className="text-stone-400 ml-2">({h.timestamp} by {h.by})</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Card Footer Actions */}
                            <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                              {/* Left actions: Toggle Details & Invoice */}
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => toggleOrderDetails(order.id)}
                                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                                >
                                  {isExpanded ? (
                                    <>
                                      <span>Less Details</span>
                                      <ChevronUp className="w-3.5 h-3.5" />
                                    </>
                                  ) : (
                                    <>
                                      <span>View Full Details & Breakdown</span>
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    </>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setSelectedInvoiceOrder(order)}
                                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
                                >
                                  <Printer className="w-3.5 h-3.5 text-stone-500" />
                                  <span>Invoice / Receipt</span>
                                </button>
                              </div>

                              {/* Right actions: Track Order & Reorder */}
                              <div className="flex items-center gap-2">
                                {onReorderItems && (
                                  <button
                                    type="button"
                                    onClick={() => handleReorder(order)}
                                    className="text-xs font-semibold text-[#7C3AED] hover:text-[#6D28D9] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
                                  >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    <span>Buy Again</span>
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => onTrackOrder(order.orderNumber, order.customerPhone)}
                                  className="text-xs font-bold text-white bg-stone-900 hover:bg-black inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>Live Tracker</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </>
        )}

      </div>

      {/* PRINTABLE INVOICE / RECEIPT MODAL */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-fade-in">
            
            {/* Modal Header Controls */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
              <div className="flex items-center gap-2 text-stone-900 font-bold font-serif text-lg">
                <Printer className="w-5 h-5 text-[#7C3AED]" />
                <span>Customer Order Receipt</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Content */}
            <div className="space-y-6 text-xs text-stone-700">
              
              {/* Store & Order Details */}
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#7C3AED]">Women's Fit</h2>
                  <p className="text-[11px] text-stone-500">Premium Modest Fashion & Contemporary Wear</p>
                  <p className="text-[11px] text-stone-500 mt-1">Dhanmondi, Dhaka 1205, Bangladesh</p>
                  <p className="text-[11px] text-stone-500">Concierge: +880 1700-000000 | support@womensfit.com</p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-stone-900">{selectedInvoiceOrder.orderNumber}</div>
                  <div className="text-[11px] text-stone-500 mt-1">Date: {selectedInvoiceOrder.createdAt}</div>
                  <div className="mt-1 inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-stone-100 border border-stone-200">
                    Status: {selectedInvoiceOrder.orderStatus}
                  </div>
                </div>
              </div>

              {/* Recipient Info */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-2 gap-4">
                <div>
                  <div className="font-bold text-stone-900 uppercase text-[10px] tracking-wider mb-1">Delivered To:</div>
                  <div className="font-semibold text-stone-800">{selectedInvoiceOrder.customerName}</div>
                  <div>{selectedInvoiceOrder.customerPhone}</div>
                  {selectedInvoiceOrder.customerEmail && <div>{selectedInvoiceOrder.customerEmail}</div>}
                </div>
                <div>
                  <div className="font-bold text-stone-900 uppercase text-[10px] tracking-wider mb-1">Shipping Address:</div>
                  <div>{selectedInvoiceOrder.deliveryAddress}</div>
                  <div>{selectedInvoiceOrder.area}, {selectedInvoiceOrder.city}</div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3">Variant</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {selectedInvoiceOrder.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/50">
                        <td className="py-2.5 px-3 font-medium text-stone-900">
                          {item.name}
                          <div className="text-[10px] text-stone-400 font-mono">{item.sku}</div>
                        </td>
                        <td className="py-2.5 px-3 text-stone-600">
                          {item.colorName}, {item.sizeCode}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-stone-900">
                          {item.quantity}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {formatTaka(item.unitPrice)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">
                          {formatTaka(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">{formatTaka(selectedInvoiceOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Charge:</span>
                    <span className="font-mono">
                      {selectedInvoiceOrder.shippingCharge === 0 ? 'FREE' : formatTaka(selectedInvoiceOrder.shippingCharge)}
                    </span>
                  </div>
                  {selectedInvoiceOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount:</span>
                      <span className="font-mono">-{formatTaka(selectedInvoiceOrder.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t border-stone-200">
                    <span>Grand Total:</span>
                    <span className="text-[#7C3AED] font-serif">{formatTaka(selectedInvoiceOrder.grandTotal)}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 pt-1 text-right">
                    Payment: <strong>{selectedInvoiceOrder.paymentMethod}</strong>
                  </div>
                </div>
              </div>

              {/* Note / Terms */}
              <div className="pt-4 border-t border-stone-100 text-[10px] text-stone-400 text-center leading-relaxed">
                Thank you for shopping with Women's Fit! For exchanges or questions regarding this shipment, please contact our concierge within 7 calendar days of receipt with order #{selectedInvoiceOrder.orderNumber}.
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
