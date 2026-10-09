import React from 'react';
import { ShoppingBag, Truck, Phone, Sparkles, ShieldCheck, HelpCircle, Heart } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  onFilterCategory?: (category: 'all' | 'insan' | 'hayvan') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenTracking,
  onFilterCategory,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-neutral-900 group-hover:bg-amber-600 transition-colors flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-amber-400 group-hover:text-white transition-colors" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-black tracking-tight text-neutral-900 block leading-tight">
                  EBEDİ HATIRA
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 tracking-wider uppercase block">
                  UV Baskı Mezar Plakaları
                </span>
              </div>
            </a>
          </div>

          {/* Center Navigation Links (Hidden on small mobile) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-neutral-700">
            <a href="#modeller" className="hover:text-amber-700 transition-colors">
              Modellerimiz (6 Çeşit)
            </a>
            <a href="#can-dostlar" className="hover:text-amber-700 transition-colors flex items-center gap-1 text-emerald-800">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Can Dostlarımız</span>
            </a>
            <a href="#montaj-rehberi" className="hover:text-amber-700 transition-colors">
              Montaj Rehberi (Yapıştırıcı Hediye)
            </a>
            <a href="#yorumlar" className="hover:text-amber-700 transition-colors">
              Müşteri Yorumları
            </a>
            <a href="#sss" className="hover:text-amber-700 transition-colors">
              S.S.S
            </a>
          </nav>

          {/* Right Action Icons: Tracking, WhatsApp, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Order Tracking Button */}
            <button
              type="button"
              onClick={onOpenTracking}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl transition-colors"
            >
              <Truck className="w-4 h-4 text-amber-600" />
              <span>Sipariş Takibi</span>
            </button>

            {/* WhatsApp Contact */}
            <a
              href="https://wa.me/905000000000?text=Merhaba,%20mezar%20plakasi%20hakkinda%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Danışma</span>
            </a>

            {/* Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Sepet</span>
              {cartCount > 0 && (
                <span className="bg-amber-500 text-neutral-950 font-black px-1.5 py-0.5 rounded-full text-[10px]">
                  {cartCount}
                </span>
              )}
              {cartTotal > 0 && (
                <span className="hidden sm:inline text-neutral-300 font-mono text-[11px] ml-1">
                  ({cartTotal} ₺)
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
