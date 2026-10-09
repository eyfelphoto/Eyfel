import React, { useState } from 'react';
import { CartItem, Order, OrderCustomerInfo, PaymentMethod } from '../types';
import { BANK_ACCOUNTS } from '../data/products';
import { 
  X, CreditCard, Building2, ShieldCheck, Check, 
  Copy, AlertTriangle, Gift, Lock, ArrowRight, Sparkles 
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  const [customer, setCustomer] = useState<OrderCustomerInfo>({
    fullName: '',
    phone: '',
    email: '',
    city: 'İstanbul',
    district: '',
    address: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [copiedIban, setCopiedIban] = useState<string | null>(null);
  const [selectedBankIndex, setSelectedBankIndex] = useState(0);

  // Credit Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [installment, setInstallment] = useState('1');

  // 3D Secure simulation modal state
  const [is3DSecureActive, setIs3DSecureActive] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const havaleDiscount = paymentMethod === 'havale' ? Math.round(rawSubtotal * 0.05) : 0;
  const total = rawSubtotal - havaleDiscount;

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  const handleCopyIban = (iban: string) => {
    navigator.clipboard.writeText(iban.replace(/\s+/g, ''));
    setCopiedIban(iban);
    setTimeout(() => setCopiedIban(null), 3000);
  };

  const validateForm = () => {
    if (!customer.fullName.trim()) return 'Lütfen adınızı ve soyadınızı giriniz.';
    if (!customer.phone.trim() || customer.phone.length < 10) return 'Lütfen geçerli bir telefon numarası giriniz.';
    if (!customer.district.trim()) return 'Lütfen ilçe bilgisini giriniz.';
    if (!customer.address.trim()) return 'Lütfen teslimat adresinizi açıkça yazınız.';

    if (paymentMethod === 'credit_card') {
      if (cardNumber.replace(/\s/g, '').length < 16) return 'Lütfen 16 haneli kart numaranızı eksiksiz giriniz.';
      if (!cardExpiry || cardExpiry.length < 5) return 'Lütfen kart son kullanma tarihini (AA/YY) giriniz.';
      if (!cardCvv || cardCvv.length < 3) return 'Lütfen kart güvenlik kodunu (CVV) giriniz.';
      if (!cardHolder.trim()) return 'Lütfen kart üzerindeki ad soyad bilgisini giriniz.';
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }

    if (paymentMethod === 'credit_card') {
      // Trigger 3D Secure simulation
      setIs3DSecureActive(true);
    } else {
      finalizeOrder();
    }
  };

  const finalizeOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const orderCode = `EB-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const completedOrder: Order = {
        orderId: orderCode,
        createdAt: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        items: [...items],
        customer,
        paymentMethod,
        subtotal: rawSubtotal,
        discount: havaleDiscount,
        shipping: 0,
        total,
        status: 'Baskı Sırasında',
        bankInfo: paymentMethod === 'havale' ? BANK_ACCOUNTS[selectedBankIndex] : undefined,
      };

      setIsSubmitting(false);
      setIs3DSecureActive(false);
      onOrderSuccess(completedOrder);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold">Güvenli Sipariş & Ödeme</h2>
            <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">256-Bit SSL</span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Reminder */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Hatırlatma: Ürünümüz mezar taşına yapıştırılan UV baskılı beyaz metal plakadır. Mezar mermeri satışı yapılmamaktadır.
            </span>
          </div>
          <span className="hidden md:inline font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
            10 Yıl Dış Mekan Solmama Garantisi
          </span>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Customer & Delivery Info */}
          <div className="md:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2 border-b pb-2">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">1</span>
              Teslimat & İletişim Bilgileri
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Adınız ve Soyadınız *
                </label>
                <input
                  type="text"
                  required
                  value={customer.fullName}
                  onChange={(e) => setCustomer(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Ahmet Yılmaz"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Telefon Numaranız *
                </label>
                <input
                  type="tel"
                  required
                  value={customer.phone}
                  onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="05XX XXX XX XX"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                E-posta Adresi (Sipariş Takip Belgesi İçin)
              </label>
              <input
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                placeholder="ornek@gmail.com"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">İl *</label>
                <select
                  value={customer.city}
                  onChange={(e) => setCustomer(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white"
                >
                  <option value="İstanbul">İstanbul</option>
                  <option value="Ankara">Ankara</option>
                  <option value="İzmir">İzmir</option>
                  <option value="Bursa">Bursa</option>
                  <option value="Antalya">Antalya</option>
                  <option value="Adana">Adana</option>
                  <option value="Konya">Konya</option>
                  <option value="Gaziantep">Gaziantep</option>
                  <option value="Kocaeli">Kocaeli</option>
                  <option value="Mersin">Mersin</option>
                  <option value="Diyarbakır">Diyarbakır</option>
                  <option value="Samsun">Samsun</option>
                  <option value="Trabzon">Trabzon</option>
                  <option value="Eskişehir">Eskişehir</option>
                  <option value="Kayseri">Kayseri</option>
                  <option value="Diğer">Diğer 81 İl</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">İlçe *</label>
                <input
                  type="text"
                  required
                  value={customer.district}
                  onChange={(e) => setCustomer(prev => ({ ...prev, district: e.target.value }))}
                  placeholder="Kadıköy / Çankaya"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Açık Teslimat Adresi *
              </label>
              <textarea
                rows={2}
                required
                value={customer.address}
                onChange={(e) => setCustomer(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Mahalle, Cadde, Sokak, Bina No, Daire No..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Kargo / Teslimat Notu (Opsiyonel)
              </label>
              <input
                type="text"
                value={customer.notes || ''}
                onChange={(e) => setCustomer(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Örn: Zile basmayın, güvenliğe bırakılabilir..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300"
              />
            </div>
          </div>

          {/* Right Column: Payment Method Selection */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2 border-b pb-2">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">2</span>
              Ödeme Yöntemi Seçimi
            </h3>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  paymentMethod === 'credit_card'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-600/20 font-bold'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <CreditCard className="w-5 h-5 text-amber-600" />
                <span className="text-xs">Kredi / Banka Kartı</span>
                <span className="text-[10px] text-neutral-500">Taksit Seçeneği</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('havale')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 relative ${
                  paymentMethod === 'havale'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 ring-2 ring-amber-600/20 font-bold'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <span className="absolute -top-2 right-2 bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  %5 İndirim
                </span>
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span className="text-xs">Havale / EFT</span>
                <span className="text-[10px] text-emerald-600 font-semibold">%5 Ek İndirimli</span>
              </button>
            </div>

            {/* Credit Card Form Fields */}
            {paymentMethod === 'credit_card' ? (
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Kart Üzerindeki İsim
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    placeholder="MEHMET YILMAZ"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Kart Numarası
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Son Kullanma (AA/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="12/28"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                      Güvenlik Kodu (CVV)
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="•••"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Taksit Seçenekleri
                  </label>
                  <select
                    value={installment}
                    onChange={(e) => setInstallment(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white"
                  >
                    <option value="1">Tek Çekim ({total} ₺)</option>
                    <option value="3">3 Taksit ({Math.round(total / 3)} ₺ x 3)</option>
                    <option value="6">6 Taksit ({Math.round(total / 6)} ₺ x 6)</option>
                  </select>
                </div>
              </div>
            ) : (
              /* Havale / EFT Details */
              <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200 space-y-3">
                <div className="text-xs font-semibold text-emerald-900 flex items-center justify-between">
                  <span>Havale Yapılacak Bankayı Seçin:</span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    %5 İndirim Uygulandı
                  </span>
                </div>

                <div className="space-y-2">
                  {BANK_ACCOUNTS.map((bank, idx) => (
                    <div
                      key={bank.bankName}
                      onClick={() => setSelectedBankIndex(idx)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedBankIndex === idx
                          ? 'bg-white border-emerald-600 shadow-sm ring-1 ring-emerald-500'
                          : 'bg-white/70 border-neutral-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900">{bank.bankName}</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                          {bank.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-600 mt-1 font-mono break-all flex items-center justify-between gap-1">
                        <span>{bank.iban}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyIban(bank.iban);
                          }}
                          className="text-[10px] text-amber-700 hover:text-amber-900 font-sans font-semibold p-1 bg-amber-50 rounded flex items-center gap-1 shrink-0"
                          title="IBAN Kopyala"
                        >
                          {copiedIban === bank.iban ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Kopyalandı</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Kopyala</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">
                        Alıcı: <strong>{bank.accountHolder}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-neutral-600 bg-white p-2.5 rounded-lg border border-emerald-200">
                  💡 <strong>Önemli:</strong> Havale/EFT açıklama kısmına <strong>Adınızı ve Soyadınızı</strong> yazmanız siparişinizin derhal onaylanması için yeterlidir.
                </div>
              </div>
            )}

            {/* Error notice if any */}
            {formError && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Price Summary */}
            <div className="bg-neutral-100 p-3.5 rounded-xl border border-neutral-200 text-xs space-y-1.5">
              <div className="flex justify-between text-neutral-600">
                <span>Ara Toplam ({items.reduce((a, b) => a + b.quantity, 0)} Plaka):</span>
                <span>{rawSubtotal} ₺</span>
              </div>
              {paymentMethod === 'havale' && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>%5 Havale İndirimi:</span>
                  <span>-{havaleDiscount} ₺</span>
                </div>
              )}
              {items.some(i => i.includeGlue) && (
                <div className="flex justify-between text-neutral-600">
                  <span>Selsil Ultra Tack Yapıştırıcı:</span>
                  <span className="text-amber-800 font-bold">DAHİL</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Sigortalı Hızlı Kargo:</span>
                <span className="text-emerald-600 font-bold">ÜCRETSİZ</span>
              </div>
              <div className="flex justify-between text-sm font-black text-neutral-900 pt-2 border-t border-neutral-300">
                <span>Ödenecek Tutar:</span>
                <span className="text-base text-amber-700">{total} ₺</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-700 hover:to-amber-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{paymentMethod === 'credit_card' ? '3D Secure ile Güvenli Öde' : 'Havale Siparişini Onayla'} ({total} ₺)</span>
            </button>
          </div>
        </form>

        {/* 3D Secure SMS Verification Simulation Modal */}
        {is3DSecureActive && (
          <div className="fixed inset-0 z-60 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Banka 3D Secure Doğrulama</h3>
              <p className="text-xs text-neutral-500 mt-1">
                {customer.phone || '05XX XXX XX XX'} numaralı telefonunuza SMS ile gönderilen 6 haneli doğrulama kodunu giriniz.
              </p>

              <div className="my-5">
                <input
                  type="text"
                  maxLength={6}
                  value={smsCode}
                  onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="3 8 4 9 2 0"
                  className="w-48 mx-auto text-center font-mono text-xl tracking-widest px-3 py-2 border-2 border-neutral-300 rounded-xl focus:border-amber-600 focus:outline-none"
                />
                <div className="text-[11px] text-neutral-400 mt-2">
                  (Test için dilediğiniz kodu yazabilir veya doğrudan Onayla'ya basabilirsiniz)
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIs3DSecureActive(false)}
                  className="w-1/2 py-2.5 text-xs font-semibold text-neutral-700 bg-neutral-100 rounded-xl hover:bg-neutral-200"
                >
                  İptal Et
                </button>
                <button
                  type="button"
                  onClick={finalizeOrder}
                  disabled={isSubmitting}
                  className="w-1/2 py-2.5 text-xs font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700 flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? 'İşleniyor...' : 'Onayla & Tamamla'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
