import React from 'react';
import { Gift, ShieldCheck, CheckCircle2, Wrench, Sparkles, AlertCircle } from 'lucide-react';

export const InstallationGuide: React.FC = () => {
  return (
    <section id="montaj-rehberi" className="py-16 bg-neutral-900 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs uppercase px-3 py-1 rounded-full font-bold tracking-wider mb-3 border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vidasız & Matkapsız Montaj</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Matkapsız & Vidasız: 3 Adımda Kolay Montaj
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-3 leading-relaxed">
            Mermerci çağırmanıza veya mezar taşını delmenize gerek yoktur. Güçlü dış mekan montaj yapıştırıcısı <strong>Selsil Ultra Tack (50ml)</strong> siparişinizde opsiyonel olarak (+299 ₺) temin edilebilir.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Product Adhesive Photo Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 text-neutral-900 border border-neutral-800">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-4 flex items-center justify-center p-3">
              <img
                src="/images/selsil_ultra_tack.jpg"
                alt="Selsil Ultra Tack 50ml No Nail Montaj Yapıştırıcısı"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-neutral-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>350 kg/m² Anında Tutunma</span>
              </div>
            </div>

            <h3 className="font-extrabold text-base text-neutral-900">
              Selsil Ultra Tack Ağır Yük Montaj Yapıştırıcısı (50ml)
            </h3>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Dış mekan mermer, granit, beton ve taş yüzeyler için özel üretilmiştir. Aşırı yaz sıcaklarında erimez, dondurucu kış şartlarında çatlamaz, neme ve suya %100 dayanıklıdır.
            </p>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-700">
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Dış Mekan & Donmaya Dayanıklı
              </span>
              <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">+299 ₺ Opsiyonel</span>
            </div>
          </div>

          {/* Right: 3 Step Guide */}
          <div className="lg:col-span-7 space-y-5">
            {/* Step 1 */}
            <div className="bg-neutral-800/80 backdrop-blur-sm border border-neutral-700/80 p-5 rounded-2xl flex items-start gap-4 hover:border-amber-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 font-extrabold text-base flex items-center justify-center shrink-0 border border-amber-500/30">
                1
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Mermer Yüzeyi Temizleyin ve Kurulayın</h4>
                <p className="text-neutral-400 text-xs sm:text-sm mt-1 leading-relaxed">
                  Plakayı yapıştıracağınız mezar baş taşının yüzeyindeki toz, çamur veya nemi kuru ve temiz bir bezle silin. Yüzeyin tamamen kuru ve pürüzsüz olduğundan emin olun.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-neutral-800/80 backdrop-blur-sm border border-neutral-700/80 p-5 rounded-2xl flex items-start gap-4 hover:border-amber-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 font-extrabold text-base flex items-center justify-center shrink-0 border border-amber-500/30">
                2
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Metal Plakanın Arkasına Selsil Ultra Tack Sürün</h4>
                <p className="text-neutral-400 text-xs sm:text-sm mt-1 leading-relaxed">
                  Selsil Ultra Tack montaj yapıştırıcısını beyaz metal plakanın arka yüzeyine dalgalı şeritler halinde veya köşelere ve orta kısımlara fındık büyüklüğünde noktalar şeklinde uygulayın.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-neutral-800/80 backdrop-blur-sm border border-neutral-700/80 p-5 rounded-2xl flex items-start gap-4 hover:border-amber-500/50 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 font-extrabold text-base flex items-center justify-center shrink-0 border border-emerald-500/30">
                3
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Taşa Hizalayın ve 30-40 Saniye Bastırın</h4>
                <p className="text-neutral-400 text-xs sm:text-sm mt-1 leading-relaxed">
                  Plakayı mezar taşı üzerinde düzgün şekilde hizalayarak yerine koyun ve tüm yüzeyine eşit kuvvetle 30-40 saniye boyunca iki elinizle sıkıca bastırın. Selsil Ultra Tack anında ilk tutunmayı sağlar ve kısa sürede taşla bütünleşir.
                </p>
              </div>
            </div>

            {/* Crucial Reminder Box */}
            <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-xl flex items-center gap-3 text-amber-200 text-xs">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>Önemli Güvence:</strong> Doğru uygulandığında ürünümüz fırtına, şiddetli rüzgar ve yoğun yağmur altında taştan kesinlikle ayrılmaz. 10 yıl dış mekan mukavemeti test edilmiştir.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
