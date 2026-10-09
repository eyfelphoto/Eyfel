import React from 'react';
import { Product } from '../types';
import { Sparkles, ShieldCheck, Gift, ArrowRight, Camera, Type } from 'lucide-react';

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
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-neutral-800 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
          {isHuman ? (
            <>
              <Camera className="w-3 h-3 text-amber-600" />
              <span>Sadece Fotoğraf</span>
            </>
          ) : (
            <>
              <Type className="w-3 h-3 text-emerald-600" />
              <span>Fotoğraf veya Yazılı</span>
            </>
          )}
        </div>

        {/* Free Glue Badge */}
        <div className="absolute bottom-3 right-3 bg-amber-600/95 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-md">
          <Gift className="w-3.5 h-3.5" />
          <span>Yapıştırıcı Hediye</span>
        </div>
      </div>

      {/* Card Details Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1">
            {isHuman ? 'İnsan Mezar Anma Plakası (Sadece Fotoğraf)' : 'Can Dostlarımız Anısına (Fotoğraf / Yazı)'}
          </div>
          <h3 className="text-lg font-bold text-neutral-900 group-hover:text-amber-700 transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-neutral-600 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* 4 Standard Size Options */}
          <div className="mt-3.5 pt-3 border-t border-neutral-100">
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

          {/* Key Bullet Guarantees */}
          <div className="mt-3 text-[11px] text-neutral-600 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>10 Yıl Güneş & Yağmur Solmama Garantisi</span>
            </div>
            <div className="text-neutral-500">
              • Delme / Vida Gerekmez, Kolay Yapışır
            </div>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-neutral-400">10x15 cm Başlangıç</div>
            <div className="text-xl font-black text-neutral-900">
              {product.basePrice.toLocaleString('tr-TR')} ₺
            </div>
          </div>

          <button
            type="button"
            onClick={() => onCustomize(product)}
            className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md group/btn cursor-pointer"
          >
            <span>Tasarla & Sipariş Ver</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
