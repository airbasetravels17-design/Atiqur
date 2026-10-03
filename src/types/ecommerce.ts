export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  images: string[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  colorId: string;
  colorName: string;
  colorHex: string;
  sizeCode: string;
  sku: string;
  stock: number;
  priceOverride?: number;
  weight?: string;
  dimensions?: string;
}

export interface ProductReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  slug: string;
  baseSku: string;
  category: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  fabric: string;
  fit: string;
  care: string;
  regularPrice: number;
  salePrice: number | null;
  isFeatured: boolean;
  isTrending: boolean;
  rating: number;
  reviewsCount: number;
  reviews?: ProductReview[];
  colors: ProductColor[];
  sizes: string[];
  variants: ProductVariant[];
}

export interface CartItem {
  variantId: string;
  productId: string;
  name: string;
  brand: string;
  slug: string;
  colorName: string;
  colorHex: string;
  sizeCode: string;
  unitPrice: number;
  quantity: number;
  maxStock: number;
  image: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  variantId: string;
  productId: string;
  name: string;
  brand: string;
  colorName: string;
  sizeCode: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  city: string;
  area: string;
  postalCode?: string;
  customerNote?: string;
  subtotal: number;
  shippingCharge: number;
  discountAmount: number;
  grandTotal: number;
  paymentMethod: string;
  orderStatus: OrderStatus;
  createdAt: string;
  items: OrderItem[];
  history: Array<{
    status: OrderStatus;
    comment: string;
    timestamp: string;
    by: string;
  }>;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minSpend: number;
  expiryDate: string;
  usageCount: number;
  isActive: boolean;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  shippingInsideDhaka: number;
  shippingOutsideDhaka: number;
  freeShippingThreshold: number;
  announcementText: string;
}

export interface PromoBannerConfig {
  isVisible: boolean;
  text: string;
  badgeText?: string;
  linkText?: string;
  linkView?: string;
  linkParam?: string;
  backgroundColor?: string;
  textColor?: string;
  allowDismiss?: boolean;
  displayScope?: 'home_only' | 'all_pages';
}

export const DEFAULT_PROMO_BANNER: PromoBannerConfig = {
  isVisible: true,
  text: '✨ SUMMER SALE IS LIVE — UP TO 60% OFF ON BESTSELLERS!',
  badgeText: 'SEASONAL OFFER',
  linkText: 'Shop Now',
  linkView: 'shop',
  linkParam: 'sale',
  backgroundColor: '#FF3F6C',
  textColor: '#FFFFFF',
  allowDismiss: true,
  displayScope: 'home_only'
};
