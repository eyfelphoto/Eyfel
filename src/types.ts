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
  photoUrl: string | null;
  photoFileName?: string;
  photoColorMode: 'original' | 'bw';
  photoZoom: number; // 1 to 2
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

export type PaymentMethod = 'credit_card' | 'havale';

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
  status: 'Baskı Sırasında' | 'Kalite Kontrol' | 'Kargolandı' | 'Teslim Edildi';
  trackingNumber?: string;
  bankInfo?: {
    bankName: string;
    iban: string;
    accountHolder: string;
  };
}
