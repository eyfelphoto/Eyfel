import React from 'react';
import { REVIEWS } from '../data/reviews';
import { Star, ShieldCheck, CheckCircle2, MessageSquareHeart } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  return (
    <section id="yorumlar" className="py-16 bg-neutral-50 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs uppercase px-3 py-1 rounded-full font-bold tracking-wider mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>%100 Doğrulanmış Müşteri Deneyimleri</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Türkiye'nin Dört Bir Yanından Memnun Aileler
          </h2>
          <p className="text-neutral-600 text-sm mt-2">
            Sevdiklerinin hatırasını kalıcı kılmak için beyaz metal mezar plakalarımızı tercih eden vatandaşlarımızın gerçek değerlendirmeleri.
          </p>

          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-bold text-neutral-800">4.9 / 5.0</span>
            <span className="text-xs text-neutral-400">• 1.400+ Başarılı Teslimat</span>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400">{rev.date}</span>
                </div>

                <p className="text-xs text-neutral-700 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    {rev.verified && (
                      <span className="text-emerald-600" title="Doğrulanmış Alıcı">
                        <CheckCircle2 className="w-3.5 h-3.5 inline" />
                      </span>
                    )}
                  </h4>
                  <div className="text-[11px] text-neutral-500">{rev.city}</div>
                </div>

                <div className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                  {rev.productTitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
