import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, Gift, ShieldCheck, ArrowRight, ShoppingBag, AlertTriangle } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold">Alışveriş Sepetiniz</h2>
              <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mini Warning in Cart */}
          <div className="bg-amber-50 border-b border-amber-200 p-2.5 text-[11px] text-amber-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Mermer mezar taşı satılmamaktadır. Siparişiniz UV baskılı metal plakadır.</span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-base font-bold text-neutral-700">Sepetiniz Boş</h3>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                  Mezar plakası modellerimiz arasından dilediğinizi seçip hemen tasarlayabilirsiniz.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-neutral-900 text-white text-xs font-bold rounded-lg hover:bg-neutral-800"
                >
                  Ürünleri İncele
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/90 relative flex flex-col gap-2.5"
                >
                  <div className="flex items-start gap-3">
                    {/* Thumbnail of plate or uploaded photo */}
                    <div className="w-16 h-16 rounded-lg bg-white border border-neutral-300 overflow-hidden shrink-0 relative">
                      <img
                        src={item.customization.photoUrl || item.product.image}
                        alt={item.product.title}
                        className={`w-full h-full object-cover ${
                          item.customization.photoColorMode === 'bw' ? 'grayscale' : ''
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-neutral-900 truncate">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-400 hover:text-red-600 p-1 rounded"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] font-semibold text-amber-800 mt-0.5">
                        Boyut: {item.selectedSize.dimensions} ({item.selectedSize.label})
                      </div>

                      {/* Summary of customized text */}
                      {item.customization.fullName && (
                        <div className="text-[11px] text-neutral-700 font-medium truncate mt-0.5">
                          Yazı: <span className="font-semibold">{item.customization.fullName}</span>
                          {item.customization.dates && ` • ${item.customization.dates}`}
                        </div>
                      )}
                      {item.customization.quote && (
                        <div className="text-[10px] text-neutral-500 italic truncate">
                          "{item.customization.quote}"
                        </div>
                      )}

                      <div className="text-xs font-black text-neutral-900 mt-1">
                        {item.unitPrice} ₺
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Free Gift badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-200/70 text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      <Gift className="w-3 h-3 text-emerald-600" />
                      <span>Montaj Yapıştırıcısı Hediye</span>
                    </div>

                    <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-100"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 font-bold text-xs text-neutral-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="px-2 py-0.5 text-neutral-600 hover:bg-neutral-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Ara Toplam:</span>
                  <span className="font-semibold text-neutral-900">{subtotal} ₺</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Dış Mekan Yapıştırıcı Seti:</span>
                  <span className="font-semibold text-emerald-600">0 ₺ (Ücretsiz Hediye)</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Sigortalı Kargo:</span>
                  <span className="font-semibold text-emerald-600">Ücretsiz Kargo</span>
                </div>
                <div className="flex justify-between text-sm font-black text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Genel Toplam:</span>
                  <span className="text-lg text-amber-700">{subtotal} ₺</span>
                </div>
              </div>

              <div className="text-[11px] text-neutral-500 flex items-center justify-center gap-2 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>10 Yıl Solmama Garantisi • 256-Bit SSL Güvenli Ödeme</span>
              </div>

              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <span>Siparişi Tamamla & Ödeme</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
