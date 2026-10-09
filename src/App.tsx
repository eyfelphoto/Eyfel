import React, { useState, useEffect } from 'react';
import { PRODUCTS } from './data/products';
import { Product, CartItem, Order } from './types';
import { MarbleNoticeBanner } from './components/MarbleNoticeBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductCard } from './components/ProductCard';
import { ProductCustomizerModal } from './components/ProductCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { InstallationGuide } from './components/InstallationGuide';
import { CustomerReviews } from './components/CustomerReviews';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { 
  Sparkles, ShieldCheck, Gift, AlertTriangle, 
  Heart, Filter, CheckCircle2, ArrowRight 
} from 'lucide-react';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ebedi_hatira_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ebedi_hatira_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCategory, setActiveCategory] = useState<'all' | 'insan' | 'hayvan'>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingInitialCode, setTrackingInitialCode] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem('ebedi_hatira_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('ebedi_hatira_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const handleAddToCart = (newItem: CartItem) => {
    setCart((prev) => [newItem, ...prev]);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setCompletedOrder(order);
  };

  const handleOpenTrackingWithCode = (code: string) => {
    setTrackingInitialCode(code);
    setIsTrackingOpen(true);
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* 1. Crucial Warning Notice Banner */}
      <MarbleNoticeBanner />

      {/* 2. Sticky Navbar */}
      <Navbar
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => {
          setTrackingInitialCode('');
          setIsTrackingOpen(true);
        }}
      />

      {/* 3. Hero Section */}
      <HeroSection
        featuredProduct={PRODUCTS[0]} // Dikdörtgen model as featured
        onCustomize={(prod) => setSelectedProduct(prod)}
      />

      {/* 4. Products Section (6 Models) */}
      <section id="modeller" className="py-16 bg-neutral-50/70 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 text-xs uppercase px-3 py-1 rounded-full font-bold tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Özel Tasarım Anma Plakaları</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
              Mezar Taşı Beyaz Metal UV Plaka Modellerimiz
            </h2>
            <p className="text-neutral-600 text-sm mt-2 leading-relaxed">
              Her modelde <strong>10x15, 13x18, 15x21 ve 20x30 cm</strong> olmak üzere 4 farklı boyut seçeneği mevcuttur. 
              İnsan mezar modellerinde sadece yüksek çözünürlüklü fotoğraf baskısı uygulanır; can dostlarımızda ise isteğe bağlı fotoğraf veya yazı+fotoğraf seçebilirsiniz.
            </p>

            {/* Crucial in-section reminder */}
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-amber-900 bg-amber-50 border border-amber-300 px-4 py-2 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Önemli Not:</strong> Mezar mermeri satmıyoruz. Sadece mevcut mezar taşlarına yapıştırılan metal baskı plaka üretiyoruz. Montaj yapıştırıcısı hediyedir.
              </span>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-neutral-200/70 p-1 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === 'all'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                Tüm Modeller (6 Çeşit)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('insan')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === 'insan'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                İnsan Mezar Plakaları (4 Model)
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('hayvan')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === 'hayvan'
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>Can Dostlarımız (Kedi & Köpek)</span>
              </button>
            </div>
          </div>

          {/* 6 Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCustomize={(prod) => setSelectedProduct(prod)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Can Dostlarımız Dedicated Highlight Section */}
      <section id="can-dostlar" className="py-16 bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 rounded-3xl p-6 sm:p-10 border border-emerald-200/80 shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs uppercase px-3 py-1 rounded-full font-bold">
                  <Heart className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Sadık Dostlarımızın Ebedi Hatırası</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  Can Dostlarımız İçin Özel Anma Plakaları (Kedi & Köpek)
                </h3>
                <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">
                  Hayatımızı paylaştığımız, koşulsuz sevgileriyle evimizi dolduran kedi ve köpek dostlarımızın hatırasını bahçe anı taşlarında, mezarlarında veya hatıra köşelerinde yaşatın.
                </p>
                <div className="space-y-2 text-xs text-neutral-700 pt-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Özel pati izi desenleri ve dokunaklı hatıra sözleri</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>10 yıl dış mekan solmama garantisi (Yağmur ve çamura dayanıklı)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Bahçe veya mezar taşına yapıştırmak için ücretsiz özel yapıştırıcı hediye</span>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const kedi = PRODUCTS.find((p) => p.id === 'kedi-model');
                      if (kedi) setSelectedProduct(kedi);
                    }}
                    className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    🐾 Kedi Plakasını Tasarla
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const kopek = PRODUCTS.find((p) => p.id === 'kopek-model');
                      if (kopek) setSelectedProduct(kopek);
                    }}
                    className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    🐾 Köpek Plakasını Tasarla
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                <div
                  className="rounded-2xl overflow-hidden shadow-lg border-2 border-white cursor-pointer hover:scale-102 transition-transform"
                  onClick={() => {
                    const kedi = PRODUCTS.find((p) => p.id === 'kedi-model');
                    if (kedi) setSelectedProduct(kedi);
                  }}
                >
                  <img
                    src="/src/assets/images/kedi_mezar_model_1791553838687.jpg"
                    alt="Kedi Mezar Plakası"
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-2.5 bg-white text-center">
                    <span className="text-[11px] font-bold text-neutral-800 block">Kedi Modeli</span>
                    <span className="text-[10px] text-amber-700 font-semibold">1.600 ₺'den Başlayan</span>
                  </div>
                </div>

                <div
                  className="rounded-2xl overflow-hidden shadow-lg border-2 border-white cursor-pointer hover:scale-102 transition-transform"
                  onClick={() => {
                    const kopek = PRODUCTS.find((p) => p.id === 'kopek-model');
                    if (kopek) setSelectedProduct(kopek);
                  }}
                >
                  <img
                    src="/src/assets/images/kopek_mezar_model_1791553857984.jpg"
                    alt="Köpek Mezar Plakası"
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-2.5 bg-white text-center">
                    <span className="text-[11px] font-bold text-neutral-800 block">Köpek Modeli</span>
                    <span className="text-[10px] text-amber-700 font-semibold">1.600 ₺'den Başlayan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Illustrated 3-Step Installation Guide */}
      <InstallationGuide />

      {/* 7. Customer Reviews Section */}
      <CustomerReviews />

      {/* 8. Frequently Asked Questions */}
      <FaqSection />

      {/* 9. Footer */}
      <Footer />

      {/* Modals & Slide-over Drawers */}
      {selectedProduct && (
        <ProductCustomizerModal
          product={selectedProduct}
          isOpen={Boolean(selectedProduct)}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onOrderSuccess={handleOrderSuccess}
      />

      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onOpenTracking={handleOpenTrackingWithCode}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        initialOrderId={trackingInitialCode}
        recentOrders={orders}
      />
    </div>
  );
}
