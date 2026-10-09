import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';

export const MarbleNoticeBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return (
      <div className="bg-amber-500/10 border-b border-amber-300 py-1.5 px-4 text-center text-xs text-amber-900 font-medium flex items-center justify-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>Hatırlatma: Firmamız sadece UV baskılı metal plaka üretmektedir. Mezar mermeri satışı yapılmamaktadır.</span>
        <button 
          onClick={() => setDismissed(false)}
          className="text-amber-800 underline hover:text-amber-950 ml-2"
        >
          Detayı Gör
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-md relative z-40 border-b border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-1.5 rounded-full shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-100" />
          </div>
          <div className="text-xs sm:text-sm">
            <span className="font-bold tracking-wide uppercase bg-amber-950/40 px-2 py-0.5 rounded text-amber-200 mr-2 inline-block">
              Önemli Bilgilendirme
            </span>
            <span className="font-medium text-amber-50">
              Firmamız <strong className="text-white underline decoration-amber-300 underline-offset-2">Mezar Mermeri veya Mezar Taşı satışı YAPMAMAKTADIR.</strong> Ürünlerimiz, mevcut mezar taşlarına vidalamadan güçlü montaj yapıştırıcısıyla uygulanan, <strong className="text-white">10 Yıl Solmama Garantili Beyaz Metal UV Baskı</strong> anma plakalarıdır.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden md:inline-flex items-center gap-1 text-xs text-amber-200 bg-white/10 px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> %100 Uyumlu Montaj
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-amber-200 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
            title="Kapat"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
