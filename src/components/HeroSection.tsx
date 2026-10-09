import React from 'react';
import { ShieldCheck, Gift, CheckCircle2, Sparkles, ArrowRight, AlertTriangle, FileCheck2, Heart } from 'lucide-react';
import { Product } from '../types';

interface HeroSectionProps {
  featuredProduct: Product;
  onCustomize: (product: Product) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ featuredProduct, onCustomize }) => {
  return (
    <section className="relative bg-gradient-to-b from-neutral-100 via-neutral-50 to-white pt-8 pb-16 overflow-hidden">
      {/* Background soft highlights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-neutral-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Copy & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>İthal Beyaz Metal Levha Üzerine Endüstriyel UV Baskı</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 tracking-tight leading-[1.15]">
              Mezar Taşları İçin <br />
              <span className="text-amber-700 underline decoration-amber-300 underline-offset-4">
                10 Yıl Solmama Garantili
              </span> <br />
              Beyaz Metal Anma Plakaları
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-2xl">
              Türkiye'deki vefat eden sevdiklerimiz ve can dostlarımız için; güneşin yakıcı ışığına, yağmura, kara ve dondurucu soğuğa 10 yıl dayanıklı beyaz metal plaka üzerine canlı fotoğraf baskısı. 
              <strong> Arkasındaki güçlü montaj yapıştırıcısı ile mezar mermerine matkapsız ve delmesiz yapışır.</strong>
            </p>

            {/* CRITICAL MARBLE WARNING BOX */}
            <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300/80 shadow-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <strong className="block font-bold text-amber-950 mb-0.5">
                  ÖNEMLİ BİLGİ: MEZAR MERMERİ SATMIYORUZ!
                </strong>
                <span>
                  Sitemizden sipariş verdiğinizde tarafınıza <strong>mezar mermeri gönderilmez</strong>. Mevcut mezar taşına yapıştırılmak üzere tasarlanmış <strong>UV baskılı beyaz metal plaka</strong> gönderilir.
                </span>
              </div>
            </div>

            {/* 4 Pillars Quick Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-neutral-900">10 Yıl Garanti</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Solmaz & Soyulmaz</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-neutral-900">Vidasız Montaj</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Mermer Delinmez</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-neutral-900">Tüm Formatlar</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">HEIC, PDF, JPG, TIFF</div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-neutral-200 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-xs font-bold text-neutral-900">İnsan & Dost</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Kedi & Köpek Mezar</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#modeller"
                className="px-6 py-3.5 bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 transition-all"
              >
                <span>6 Modeli İncele & Sipariş Ver</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#montaj-rehberi"
                className="px-5 py-3.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Montaj Rehberi (Vidasız & Matkapsız)</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-neutral-900 group">
              {/* Product Image on Turkish Marble Headstone */}
              <img
                src={featuredProduct.image}
                alt="Gerçekçi Türk Mezar Taşı Metal Plaka Örneği"
                className="w-full aspect-[4/4.2] object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />

              {/* Overlay Glass Badge */}
              <div className="absolute bottom-4 inset-x-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/60">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                      Türk Mezar Taşına Gerçek Uygulama
                    </span>
                    <h3 className="text-sm font-extrabold text-neutral-900">
                      Dikdörtgen Beyaz Metal UV Plaka
                    </h3>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      10x15, 13x18, 15x21, 20x30 cm • 1.600 ₺'den Başlayan Fiyatlar
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onCustomize(featuredProduct)}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors shrink-0 cursor-pointer"
                  >
                    Hemen Sipariş Ver
                  </button>
                </div>
              </div>

              {/* Guarantee Badge Top Right */}
              <div className="absolute top-4 right-4 bg-neutral-900/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>10 Yıl Garanti</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
