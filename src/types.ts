export type ShapeModel = 'dikdortgen' | 'kare' | 'kalp' | 'yuvarlak' | 'kedi' | 'kopek';

export interface ProductSize {
  id: string;
  label: string;
  dimensions: string; // e.g. "15 x 21 cm"
  price: number;
  popular?: boolean;
}

export interface Product {
  id: string;
  modelType: ShapeModel;
  title: string;
  subtitle: string;
  category: 'insan' | 'hayvan';
  tag: string;
  image: string;
  basePrice: number;
  sizes: ProductSize[];
  description: string;
  shapeDetails: string;
  features: string[];
  dimensionsInfo: string;
  defaultTextPreset: {
    title: string;
    dates: string;
    quote: string;
  };
}

export interface CustomizationOptions {
  sizeId: string;
  selectedShape?: ShapeModel; // For pet models: allows choosing between Dikdörtgen, Kare, Kalp, Yuvarlak
  photoUrl: string | null;
  photoFileName?: string;
  photoColorMode: 'original' | 'bw';
  photoZoom?: number; // Optional
  includeGlue?: boolean; // Opsiyonel Selsil Ultra Tack 50ml Montaj Yapıştırıcısı (+299 TL)
  includeText?: boolean; // For pet models: optionally include text
  fullName?: string;
  dates?: string;
  quote?: string;
  fontFamily?: 'serif' | 'sans' | 'display' | 'elegant';
  textColor?: 'black' | 'gold' | 'charcoal';
  includeBorder: boolean;
  borderStyle: 'classic' | 'ornament' | 'clean';
  specialNote?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedSize: ProductSize;
  customization: CustomizationOptions;
  unitPrice: number;
  includeGlue?: boolean;
  gluePrice?: number; // 299 TL
  quantity: number;
  addedAt: number;
}

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  address: string;
  notes?: string;
}

export type PaymentMethod = 'credit_card' | 'havale' | 'paytr';

export type OrderStatus = 
  | 'Ödeme Bekliyor'
  | 'Ödeme Alındı'
  | 'Baskı Sırasında'
  | 'Kalite Kontrol'
  | 'Kargolandı'
  | 'Teslim Edildi'
  | 'İptal Edildi';

export interface Order {
  orderId: string;
  createdAt: string;
  items: CartItem[];
  customer: OrderCustomerInfo;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentStatus?: 'pending' | 'paid' | 'failed';
  trackingNumber?: string;
  shippingCarrier?: string;
  bankInfo?: {
    bankName: string;
    iban: string;
    accountHolder: string;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
}

export interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  paidOrdersCount: number;
  pendingOrdersCount: number;
  shippedOrdersCount: number;
}
