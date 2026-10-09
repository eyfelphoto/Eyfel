import React from 'react';
import { Product } from '../types';
import { Sparkles, ShieldCheck, Gift, ArrowRight, Camera, Type, Shapes } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onCustomize: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onCustomize }) => {
  const isHuman = product.category === 'insan';

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-neutral-200/90 hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Product Image Area */}
      <div className="relative aspect-[4/3.8] bg-neutral-100 overflow-hidden cursor-pointer" onClick={() => onCustomize(product)}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Model Tag Badge */}
        <div className="absolute top-3 left-3 bg-neutral-900/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-md">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{product.tag}</span>
        </div>

        {/* Human vs Pet Badge */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-neutral-800 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm border border-neutral-200/50">
          {isHuman ? (
            <>
              <Camera className="w-3 h-3 text-amber-600" />
              <span>Sadece Fotoğraf Baskısı</span>
            </>
          ) : (
            <>
              <Shapes className="w-3 h-3 text-emerald-600" />
              <span>4 Şekil Seçenekli</span>
            </>
          )}
        </div>

        {/* Guarantee Badge */}
        <div className="absolute bottom-3 right-3 bg-neutral-900/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>10 Yıl Solmama Garantisi</span>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1">
            {isHuman 
              ? '60x60 Mezar Taşı Üst 60x30 Boş Alanı İçin' 
              : 'Can Dostlarımız İçin Özel Anma Plakası'}
          </div>
          <h3 className="text-lg font-bold text-neutral-900 group-hover:text-amber-700 transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Size Options & Pricing */}
          <div className="mt-3.5 pt-3 border-t border-neutral-100">
            {!isHuman ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-neutral-500">Seçilebilir Formlar:</span>
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">4 Şekil Dahil</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  <div className="text-[10.5px] p-1.5 bg-neutral-50 border border-neutral-200 rounded text-neutral-700">
                    <span className="font-bold text-neutral-900 block">Dikdörtgen:</span>
                    <span>10x15 - 20x30 cm</span>
                  </div>
                  <div className="text-[10.5px] p-1.5 bg-neutral-50 border border-neutral-200 rounded text-neutral-700">
                    <span className="font-bold text-neutral-900 block">Kare / Kalp / Yuvarlak:</span>
                    <span>10x10 - 20x20 cm</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[10.5px]">
                  <div className="flex justify-between px-1.5 py-0.5 bg-neutral-50 rounded text-neutral-600">
                    <span>Küçük Boy:</span> <strong className="text-neutral-900">1.600 ₺</strong>
                  </div>
                  <div className="flex justify-between px-1.5 py-0.5 bg-neutral-50 rounded text-neutral-600">
                    <span>Orta Boy:</span> <strong className="text-neutral-900">1.900 ₺</strong>
                  </div>
                  <div className="flex justify-between px-1.5 py-0.5 bg-amber-50 rounded text-amber-900 font-medium">
                    <span>Standart / Popüler:</span> <strong className="text-amber-800">2.200 ₺</strong>
                  </div>
                  <div className="flex justify-between px-1.5 py-0.5 bg-neutral-50 rounded text-neutral-600">
                    <span>Büyük Boy:</span> <strong className="text-neutral-900">3.200 ₺</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-semibold text-neutral-500 block mb-1.5">Ölçü Seçenekleri ve Fiyatlar:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {product.sizes.map((s) => (
                    <div
                      key={s.id}
                      className={`text-[11px] px-2 py-1 rounded-md font-medium border flex items-center justify-between ${
                        s.popular
                          ? 'bg-amber-50 text-amber-950 border-amber-300 font-bold'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      <span>{s.dimensions}</span>
                      <span className="font-bold text-amber-800">{s.price.toLocaleString('tr-TR')} ₺</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Bullet Guarantees */}
          <div className="mt-3 text-[11px] text-neutral-600 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>10 Yıl Güneş & Yağmur Solmama Garantisi</span>
            </div>
            <div className="text-neutral-500">
              • Delme / Vida Gerekmez • Opsiyonel Selsil Ultra (+299 ₺)
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-neutral-400">
              {isHuman && product.modelType === 'dikdortgen' ? '10x15 cm Başlangıç' : '10x10 / 10x15 Başlangıç'}
            </div>
            <div className="text-xl font-black text-neutral-900">
              {product.basePrice.toLocaleString('tr-TR')} ₺
            </div>
          </div>

          <button
            type="button"
            onClick={() => onCustomize(product)}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md group/btn cursor-pointer"
          >
            <span>Sipariş Ver</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
