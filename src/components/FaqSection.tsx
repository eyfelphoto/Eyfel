import React, { useState } from 'react';
import { FAQS } from '../data/faq';
import { ChevronDown, HelpCircle, AlertTriangle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="sss" className="py-16 bg-white border-t border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 bg-neutral-100 text-neutral-800 text-xs uppercase px-3 py-1 rounded-full font-bold tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Merak Edilenler</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-2">
            Mezar plakası üretimi, montaj yapıştırıcısı ve sipariş süreciyle ilgili aklınıza takılan tüm soruların yanıtları.
          </p>
        </div>

        {/* Highlight Alert */}
        <div className="mb-8 p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3 text-amber-900 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-sm font-bold text-amber-950 mb-0.5">
              Mezar Taşı veya Mermeri Satıyor musunuz?
            </strong>
            <span>
              <strong>Kesinlikle hayır.</strong> Firmamız mezar mermeri satışı veya mezar inşası yapmamaktadır. Sadece mermer veya taş üzerine kolayca yapıştırılabilen, 10 yıl solmama garantili beyaz metal UV baskı anma plakaları üretmekteyiz.
            </span>
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="border border-neutral-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full text-left p-4.5 bg-neutral-50/70 hover:bg-neutral-50 flex items-center justify-between gap-4 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-neutral-900">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4.5 bg-white border-t border-neutral-100 text-xs text-neutral-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
