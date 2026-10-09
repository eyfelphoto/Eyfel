import React from 'react';
import { Order } from '../types';
import { 
  CheckCircle2, Gift, ShieldCheck, Printer, 
  Truck, ArrowRight, X, Copy, Check 
} from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenTracking: (orderId: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onOpenTracking,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
        {/* Top Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-100 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-white text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold">Siparişiniz Başarıyla Alındı!</h2>
          <p className="text-xs text-emerald-100 mt-1 max-w-md mx-auto">
            Saygıyla hazırladığımız beyaz metal UV baskı mezar anma plakanız üretim sırasına alınmıştır.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-emerald-800/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-emerald-500/40">
            <span className="text-xs text-emerald-200">Sipariş Kodunuz:</span>
            <span className="font-mono font-bold text-white tracking-wider">{order.orderId}</span>
            <button
              onClick={handleCopyCode}
              className="ml-1 p-1 hover:bg-emerald-700 rounded transition-colors text-emerald-200 hover:text-white"
              title="Kodu Kopyala"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          {/* Packaging Box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="font-bold text-amber-900">10 Yıl Solmama Garantili Özel Paketleme</div>
              <div className="text-amber-800 text-[11px] mt-0.5">
                Metal plakanız ve detaylı montaj kılavuzunuz darbe emici özel koruyucu ambalajında kargoya hazırlanacaktır.
                {order.items.some(i => i.includeGlue) && ' (Selsil Ultra Tack montaj yapıştırıcınız kutu içerisine eklenmiştir.)'}
              </div>
            </div>
          </div>

          {/* Order Details Summary */}
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-bold text-neutral-800">Sipariş Bilgileri</span>
              <span className="text-neutral-500">{order.createdAt}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-neutral-500 block">Alıcı:</span>
                <span className="font-semibold text-neutral-900">{order.customer.fullName}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Telefon:</span>
                <span className="font-semibold text-neutral-900">{order.customer.phone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-500 block">Teslimat Adresi:</span>
                <span className="font-semibold text-neutral-900">
                  {order.customer.address}, {order.customer.district} / {order.customer.city}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Ödeme Türü:</span>
                <span className="font-semibold text-neutral-900">
                  {order.paymentMethod === 'credit_card' ? 'Kredi / Banka Kartı (3D Secure)' : 'Banka Havalesi / EFT'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Toplam Tutar:</span>
                <span className="font-bold text-amber-700 text-sm">{order.total} ₺</span>
              </div>
            </div>

            {/* Havale info banner if Havale */}
            {order.paymentMethod === 'havale' && order.bankInfo && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 mt-2">
                <div className="font-bold">Havale Bilgileri:</div>
                <div className="font-mono mt-0.5">{order.bankInfo.bankName} - {order.bankInfo.iban}</div>
                <div className="text-[11px] text-blue-800 mt-0.5">Alıcı: {order.bankInfo.accountHolder}</div>
              </div>
            )}

            {/* Items */}
            <div className="border-t pt-2 space-y-2">
              <span className="font-bold text-neutral-700 block">Sipariş Edilen Ürünler ({order.items.length}):</span>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-neutral-200">
                  <div>
                    <div className="font-semibold text-neutral-900">{item.product.title}</div>
                    <div className="text-[11px] text-neutral-500">
                      Boyut: {item.selectedSize.dimensions} • {item.customization.fullName || 'İsimsiz'}
                    </div>
                  </div>
                  <div className="font-bold text-neutral-900">{item.unitPrice * item.quantity} ₺</div>
                </div>
              ))}
            </div>
          </div>

          {/* Manufacturing Steps */}
          <div className="border border-neutral-200 rounded-xl p-4 bg-white">
            <h4 className="font-bold text-neutral-800 mb-2">Sipariş Süreciniz Nasıl İlerleyecek?</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-2.5 bg-neutral-50 rounded-lg">
                <div className="font-bold text-neutral-900">1. Grafik Rötuş</div>
                <p className="text-[11px] text-neutral-500 mt-0.5">Grafikerlerimiz fotoğrafı UV baskıya hazırlar ve optimize eder.</p>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-lg">
                <div className="font-bold text-neutral-900">2. Metal UV Baskı</div>
                <p className="text-[11px] text-neutral-500 mt-0.5">İthal beyaz metal üzerine 10 yıl garantili UV kürleme uygulanır.</p>
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-lg">
                <div className="font-bold text-neutral-900">3. Kargo & Teslimat</div>
                <p className="text-[11px] text-neutral-500 mt-0.5">Özel darbe emici kutusunda sigortalı kargo ile gönderilir.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-50 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Sipariş Fişini Yazdır</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenTracking(order.orderId);
              }}
              className="px-4 py-2 text-xs font-bold text-neutral-900 bg-amber-100 border border-amber-300 rounded-xl hover:bg-amber-200 flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4 text-amber-700" />
              <span>Siparişimi Takip Et</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-white bg-neutral-900 rounded-xl hover:bg-neutral-800"
            >
              Alışverişe Devam Et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
