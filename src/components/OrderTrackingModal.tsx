import React, { useState } from 'react';
import { Order } from '../types';
import { 
  X, Search, Truck, CheckCircle2, Clock, 
  Package, AlertTriangle, ShieldCheck, PhoneCall 
} from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
  recentOrders: Order[];
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = '',
  recentOrders,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialOrderId);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(
    recentOrders.find(o => o.orderId === initialOrderId) || null
  );
  const [hasSearched, setHasSearched] = useState(Boolean(initialOrderId));

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    if (!query) return;

    // Check recent orders in state
    const found = recentOrders.find(o => 
      o.orderId.toUpperCase() === query || 
      o.customer.phone.replace(/\D/g, '').includes(query.replace(/\D/g, ''))
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      // Mock realistic order matching the queried code
      const dummyOrder: Order = {
        orderId: query.startsWith('EB-') ? query : `EB-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        createdAt: 'Dün, 14:30',
        items: recentOrders.length > 0 ? recentOrders[0].items : [],
        customer: {
          fullName: 'Sipariş Sahibi',
          phone: searchQuery.length >= 10 ? searchQuery : '0532 *** ** 12',
          email: 'musteri@gmail.com',
          city: 'İstanbul',
          district: 'Kadıköy',
          address: 'Örnek Mahallesi',
        },
        paymentMethod: 'credit_card',
        subtotal: 620,
        discount: 0,
        shipping: 0,
        total: 620,
        status: 'Baskı Sırasında',
        trackingNumber: 'YK-8472910394 (Yurtiçi Kargo)',
      };
      setSearchedOrder(dummyOrder);
    }
    setHasSearched(true);
  };

  const steps = [
    { title: 'Sipariş Alındı', desc: 'Ödeme ve sipariş detayları teyit edildi', done: true },
    { title: 'Grafik Rötuş & Hazırlık', desc: 'Fotoğraf çözünürlüğü ve yazılar UV baskı kalıbına aktarıldı', done: true },
    { title: 'Beyaz Metal UV Baskı', desc: '10 Yıl solmama korumalı dış mekan baskı işlemi yapılıyor', done: true },
    { title: 'Paketleme & Yapıştırıcı', desc: 'Özel darbe emici kutuya ve hediye montaj yapıştırıcısı eklendi', done: false },
    { title: 'Kargoya Verildi', desc: 'Sigortalı kargo ile adresinize sevk edilecek', done: false },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
        {/* Header */}
        <div className="bg-neutral-900 text-white p-5 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold">Mezar Plakası Sipariş Takibi</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 text-xs">
          {/* Search Input Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sipariş Kodu (Örn: EB-2026-...) veya Telefon No"
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs transition-colors"
            >
              Sorgula
            </button>
          </form>

          {hasSearched && searchedOrder ? (
            <div className="space-y-4">
              {/* Order Status Badge Header */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-amber-800">Sipariş Numarası:</div>
                  <div className="text-sm font-bold text-amber-950 font-mono">{searchedOrder.orderId}</div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{searchedOrder.status}</span>
                  </span>
                  <div className="text-[10px] text-neutral-500 mt-1">Tahmini Teslimat: 2 İş Günü</div>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div className="space-y-3 pl-2 relative before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                {steps.map((st, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                      st.done
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-neutral-100 text-neutral-400 border border-neutral-300'
                    }`}>
                      {st.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                    </div>
                    <div className="pt-0.5">
                      <div className={`font-bold ${st.done ? 'text-neutral-900' : 'text-neutral-500'}`}>
                        {st.title}
                      </div>
                      <div className="text-neutral-500 text-[11px] leading-relaxed">
                        {st.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Free Glue & Installation Reminder */}
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center gap-2.5 text-neutral-600">
                <Package className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-[11px]">
                  Paketinizin içinde mezar taşına kolay montaj için <strong>özel taş yapıştırıcısı</strong> mevcuttur.
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <Package className="w-10 h-10 mx-auto text-neutral-300 mb-2" />
              <p className="font-medium text-neutral-600">Henüz sorgulama yapmadınız.</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Siparişinizi verdikten sonra size iletilen Sipariş Kodunu yukarıdaki alana girerek üretim ve kargo durumunuzu anlık görebilirsiniz.
              </p>
            </div>
          )}

          {/* WhatsApp Support Callout */}
          <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-neutral-500 text-[11px]">
            <span>Sorularınız veya acil sipariş talebiniz mi var?</span>
            <a
              href="https://wa.me/905000000000?text=Merhaba,%20mezar%20plakasi%20siparisi%20hakkinda%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" /> WhatsApp Destek Hattı
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
