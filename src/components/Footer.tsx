import React from 'react';
import { ShieldCheck, Truck, Lock, Phone, Mail, MapPin, AlertTriangle, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 pt-16 pb-12 border-t border-neutral-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-neutral-800 text-neutral-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">10 Yıl Solmama Garantisi</div>
              <div className="text-[11px] text-neutral-400">Güneş, yağmur ve kara %100 dayanıklı UV baskı</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Tüm Türkiye'ye Hızlı Kargo</div>
              <div className="text-[11px] text-neutral-400">Özel korumalı kutuda sigortalı gönderim</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">256-Bit SSL Güvenli Ödeme</div>
              <div className="text-[11px] text-neutral-400">Kredi Kartı 3D Secure & Havale ile %5 İndirim</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">İnsan & Can Dostlarımız</div>
              <div className="text-[11px] text-neutral-400">Tüm vefat eden sevdiklerimize saygıyla</div>
            </div>
          </div>
        </div>

        {/* Essential Legal Warning Box */}
        <div className="my-10 p-4 bg-amber-950/30 border border-amber-600/40 rounded-2xl flex items-start gap-3.5 text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong className="block text-amber-300 font-bold mb-0.5">
              YASAL UYARI VE BİLGİLENDİRME:
            </strong>
            <span>
              Firmamız <strong>mezar mermeri, mezar taşı yapımı veya kabristan taş işçiliği satışı YAPMAMAKTADIR.</strong> 
              Web sitemizde sunulan tüm ürünler; mevcut mermer, granit veya taş mezarlar üzerine arkasındaki özel yapıştırıcı vasıtasıyla vidalamadan yapıştırılan, 10 yıl dış mekan solmama garantili <strong>ithal beyaz metal UV baskı anma plakalarıdır.</strong>
            </span>
          </div>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-neutral-800">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white">EBEDİ HATIRA</span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Vefat eden sevdiklerimizin ve minik can dostlarımızın hatırasını mezar taşlarında saygıyla yaşatmak için profesyonel metal UV baskı çözümleri.
            </p>
            <div className="text-[11px] text-neutral-500">
              İthal Beyaz Metal Levha • Endüstriyel UV Baskı Teknolojisi
            </div>
          </div>

          {/* 6 Models */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
              Mezar Plakası Modellerimiz
            </h4>
            <ul className="space-y-2 text-neutral-400 text-xs">
              <li><a href="#modeller" className="hover:text-amber-400 transition-colors">1. Dikdörtgen Model (Klasik Mezar Taşı)</a></li>
              <li><a href="#modeller" className="hover:text-amber-400 transition-colors">2. Kare Model (Modern Simetrik)</a></li>
              <li><a href="#modeller" className="hover:text-amber-400 transition-colors">3. Kalp Model (Duygusal Kesim)</a></li>
              <li><a href="#modeller" className="hover:text-amber-400 transition-colors">4. Yuvarlak / Oval Model (Madalyon Formu)</a></li>
              <li><a href="#modeller" className="hover:text-amber-400 transition-colors">5. Can Dostlarımız İçin (Kedi Mezar Plakası)</a></li>
              <li><a href="#modeller" className="hover:text-amber-400 transition-colors">6. Can Dostlarımız İçin (Köpek Mezar Plakası)</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
              Hızlı Bağlantılar
            </h4>
            <ul className="space-y-2 text-neutral-400 text-xs">
              <li><a href="#montaj-rehberi" className="hover:text-amber-400 transition-colors">3 Adımda Kolay Montaj Rehberi</a></li>
              <li><a href="#yorumlar" className="hover:text-amber-400 transition-colors">Müşteri Yorumları & Referanslar</a></li>
              <li><a href="#sss" className="hover:text-amber-400 transition-colors">Sıkça Sorulan Sorular</a></li>
              <li><a href="#garanti" className="hover:text-amber-400 transition-colors">10 Yıl Solmama Garantisi Şartları</a></li>
              <li><a href="#gizlilik" className="hover:text-amber-400 transition-colors">Mesafeli Satış Sözleşmesi & KVKK</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
              İletişim & Atölye
            </h4>
            <div className="space-y-2.5 text-neutral-400 text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Müşteri Danışma: 0850 300 00 00</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>destek@ebedihatira.com.tr</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Üretim & Baskı Atölyesi: İkitelli OSB Metal-İş Sanayi Sitesi, Başakşehir / İstanbul</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} Ebedi Hatıra Mezar Plakaları. Tüm Hakları Saklıdır.
          </div>
          <div className="flex items-center gap-4">
            <span>Türkiye Geneli Teslimat</span>
            <span>•</span>
            <span>Havale & EFT ile %5 İndirim</span>
            <span>•</span>
            <span>3D Secure Güvenli Alışveriş</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
