import React, { useState } from 'react';
import { ShapeModel, CustomizationOptions } from '../types';
import { Eye, ZoomIn, SunMedium, Sparkles, Image as ImageIcon, Ruler, Check } from 'lucide-react';

interface LiveSimulatorProps {
  modelType: ShapeModel;
  isHumanModel: boolean;
  options: CustomizationOptions;
  dimensionsText?: string;
  className?: string;
}

export const LiveSimulator: React.FC<LiveSimulatorProps> = ({
  modelType,
  isHumanModel,
  options,
  dimensionsText = '15 x 21 cm',
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'stone' | 'plate'>('stone');

  // Default sample portrait if none uploaded yet
  const displayPhotoUrl = options.photoUrl || '/src/assets/images/dikdortgen_duz_model_1791556899068.jpg';
  const hasUserPhoto = Boolean(options.photoUrl);

  // 1st priority: Renkli, 2nd: Siyah-Beyaz (Sepya completely removed)
  const getFilterClass = () => {
    if (options.photoColorMode === 'bw') {
      return 'grayscale contrast-110 brightness-105';
    }
    return 'contrast-105'; // Original Renkli
  };

  const getFontFamilyStyle = () => {
    switch (options.fontFamily) {
      case 'serif':
        return 'font-serif tracking-wider';
      case 'display':
        return 'font-mono tracking-widest uppercase';
      case 'elegant':
        return 'italic font-serif tracking-wide';
      case 'sans':
      default:
        return 'font-sans font-bold tracking-wide';
    }
  };

  const getTextColorStyle = () => {
    switch (options.textColor) {
      case 'gold':
        return 'text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]';
      case 'charcoal':
        return 'text-neutral-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]';
      case 'black':
      default:
        return 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]';
    }
  };

  // Shape container styling for the plate (NO screw holes, photo covers complete metal plate)
  const getShapeStyles = () => {
    switch (modelType) {
      case 'kalp':
        return {
          clipPath: 'polygon(50% 12%, 62% 3%, 78% 3%, 92% 16%, 95% 35%, 85% 62%, 50% 95%, 15% 62%, 5% 35%, 8% 16%, 22% 3%, 38% 12%)',
          aspectRatio: '1 / 1',
        };
      case 'yuvarlak':
        return {
          borderRadius: '9999px',
          aspectRatio: '1 / 1',
        };
      case 'kare':
        return {
          borderRadius: '8px',
          aspectRatio: '1 / 1',
        };
      case 'kedi':
      case 'kopek':
        return {
          borderRadius: '10px',
          aspectRatio: '1 / 1.4',
        };
      case 'dikdortgen':
      default:
        return {
          borderRadius: '6px',
          aspectRatio: '1 / 1.45',
        };
    }
  };

  // SCALE CALCULATION ON 60x60 CM MEZAR TAŞI:
  // Upper area is ~30x60 cm.
  // We dynamically adjust width percentage on the headstone to match exact real world dimensions:
  // 10x15 cm -> 10 cm / 60 cm = ~18% width
  // 13x18 cm -> 13 cm / 60 cm = ~23% width
  // 15x21 cm -> 15 cm / 60 cm = ~27% width
  // 20x30 cm -> 20 cm / 60 cm = ~36% width
  const getScaleWidthPercentage = () => {
    const sizeId = options.sizeId || '';
    if (sizeId.includes('10x15')) {
      return modelType === 'kare' || modelType === 'yuvarlak' ? '21%' : '18%';
    }
    if (sizeId.includes('13x18')) {
      return modelType === 'kare' || modelType === 'yuvarlak' ? '26%' : '23%';
    }
    if (sizeId.includes('20x30')) {
      return modelType === 'kare' || modelType === 'yuvarlak' ? '42%' : '36%';
    }
    // Default 15x21 cm
    return modelType === 'kare' || modelType === 'yuvarlak' ? '30%' : '27%';
  };

  const showTextOnPlate = !isHumanModel && Boolean(options.includeText);

  return (
    <div className={`flex flex-col rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-950 shadow-xl ${className}`}>
      {/* Top Bar Switcher */}
      <div className="bg-neutral-900 px-4 py-2.5 flex items-center justify-between border-b border-neutral-800 text-xs">
        <div className="flex items-center gap-2 text-neutral-300 font-medium">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-white">Canlı Mezar Taşı Simülasyonu</span>
          <span className="bg-amber-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">
            {dimensionsText}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => setViewMode('stone')}
            className={`px-3 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
              viewMode === 'stone'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Mezar Taşında (60x60 cm)</span>
          </button>
          <button
            onClick={() => setViewMode('plate')}
            className={`px-3 py-1 rounded-md transition-all font-medium flex items-center gap-1.5 ${
              viewMode === 'plate'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Plaka Yakın Plan</span>
          </button>
        </div>
      </div>

      {/* Main Preview Canvas Area */}
      <div className="relative w-full aspect-[4/4.3] bg-neutral-900 flex items-center justify-center overflow-hidden select-none">
        {viewMode === 'stone' ? (
          <>
            {/* Background: Genuine Turkish Marble Gravestone (60x60 cm Headstone) */}
            <img
              src="/src/assets/images/blank_mezar_tasi_1791553882400.jpg"
              alt="60x60 Mezar Taşı Arka Planı"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.98] contrast-[1.02]"
            />
            {/* Subtle natural sunlight gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10 pointer-events-none" />

            {/* UPPER 30x60 CM MOUNTING ZONE BOUNDARY (Subtle aesthetic indicator) */}
            <div className="absolute inset-x-8 top-6 h-[44%] border border-dashed border-amber-400/25 rounded-2xl pointer-events-none flex flex-col justify-between p-2">
              <span className="text-[10px] text-amber-200/60 font-mono tracking-wider self-start bg-black/30 backdrop-blur-xs px-1.5 py-0.5 rounded">
                Üst Boş Montaj Alanı (30 x 60 cm)
              </span>
            </div>

            {/* FLAT GLUED METAL PLAQUE ON UPPER 30x60 CM AREA (DYNAMIC EXACT SCALE, NO SCREWS, FULL BLEED PHOTO) */}
            <div
              className="relative z-10 transition-all duration-300 drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
              style={{
                width: getScaleWidthPercentage(),
                marginTop: '-18%', // Positioned exactly in the upper 30x60 cm empty marble zone
              }}
            >
              {/* The Flat Metal Plaque with Full-Bleed Photo, Smooth Edges, Zero Screws */}
              <div
                className="relative w-full bg-neutral-900 overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.35),0_1px_2px_rgba(0,0,0,0.2)] border-[1.5px] border-white/70 transition-all duration-300 ring-1 ring-black/20"
                style={getShapeStyles()}
              >
                {/* Metallic subtle surface gloss reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none z-20" />

                {/* THE PHOTO COVERS THE ENTIRE METAL SURFACE (FULL BLEED) */}
                <div className="relative w-full h-full overflow-hidden bg-neutral-800">
                  <img
                    src={displayPhotoUrl}
                    alt="Plaka Fotoğrafı"
                    className={`w-full h-full object-cover transition-transform duration-200 ${getFilterClass()}`}
                    style={{
                      transform: `scale(${options.photoZoom})`,
                    }}
                  />

                  {!hasUserPhoto && (
                    <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-1.5 z-10">
                      <ImageIcon className="w-4 h-4 text-white/90 mb-0.5" />
                      <span className="text-[9px] text-white font-bold leading-tight drop-shadow">
                        Fotoğraf Yükleyin
                      </span>
                    </div>
                  )}

                  {/* For pet models with optional text, elegant overlay at bottom */}
                  {showTextOnPlate && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent pt-4 pb-1.5 px-1.5 text-center z-10">
                      {options.fullName && (
                        <div className={`text-[10px] font-extrabold leading-tight uppercase ${getFontFamilyStyle()} ${getTextColorStyle()}`}>
                          {options.fullName}
                        </div>
                      )}
                      {options.dates && (
                        <div className={`text-[8.5px] font-semibold text-neutral-200 mt-0.5 ${getFontFamilyStyle()}`}>
                          {options.dates}
                        </div>
                      )}
                      {options.quote && (
                        <div className={`text-[8px] font-medium text-amber-200 mt-0.5 uppercase ${getFontFamilyStyle()}`}>
                          {options.quote}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Realistic Contact Shadow (representing flat adhesive bond to marble) */}
              <div className="absolute -bottom-1.5 inset-x-2 h-2 bg-black/45 blur-xs -z-10 rounded-full" />
            </div>

            {/* TRADITIONAL LOWER ENGRAVED MARBLE TEXT ON HEADSTONE (Authentic Turkish Cemetery Marmara Marble) */}
            <div className="absolute inset-x-0 bottom-10 text-center pointer-events-none select-none opacity-85 z-10">
              <div className="font-serif text-[13px] font-black tracking-widest text-neutral-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] uppercase">
                {isHumanModel ? 'MERHUM / MERHUME' : 'RUHUNA FATİHA'}
              </div>
              <div className="font-serif text-[10px] font-bold text-neutral-700 tracking-wider mt-0.5 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                MEKANI CENNET OLSUN
              </div>
              <div className="font-serif text-[9px] font-medium text-neutral-600 tracking-widest mt-0.5">
                RUHUNA EL-FATİHA
              </div>
            </div>

            {/* Dimension Scale Indicator Ribbon */}
            <div className="absolute bottom-3 inset-x-3 bg-black/75 backdrop-blur-md text-white/95 px-3 py-1.5 rounded-xl text-[11px] flex items-center justify-between border border-white/10 shadow-lg">
              <div className="flex items-center gap-1.5">
                <Ruler className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-medium">
                  Mezar Taşı: <strong>60x60 cm</strong> | Üst Alan: <strong>30x60 cm</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                <Check className="w-3 h-3" />
                <span>Seçilen Plaka: {dimensionsText} (Düz Yapışkanlı - Vidasız)</span>
              </div>
            </div>
          </>
        ) : (
          /* HIGH-DETAIL CLOSE-UP VIEW: PHOTO COVERS 100% OF METAL, ZERO SCREWS */
          <div className="relative w-full h-full p-6 sm:p-10 flex items-center justify-center bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-950">
            {/* Pattern in background */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div
              className="relative w-[75%] sm:w-[65%] max-w-[340px] bg-neutral-900 overflow-hidden border-[2px] border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.8)] transition-all duration-300 ring-1 ring-white/20"
              style={getShapeStyles()}
            >
              {/* Metallic gloss reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent pointer-events-none z-20" />

              {/* PHOTO COVERS THE ENTIRE METAL PLATE 100% (FULL BLEED, NO INNER BORDERS) */}
              <div className="relative w-full h-full overflow-hidden bg-neutral-900">
                <img
                  src={displayPhotoUrl}
                  alt="HD Metal Baskı Detayı"
                  className={`w-full h-full object-cover transition-transform duration-200 ${getFilterClass()}`}
                  style={{
                    transform: `scale(${options.photoZoom})`,
                  }}
                />

                {!hasUserPhoto && (
                  <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-3 z-10">
                    <ImageIcon className="w-6 h-6 text-white/90 mb-1" />
                    <span className="text-xs text-white font-bold leading-tight drop-shadow">
                      Fotoğraf Yüklenmediğinde Örnek Görünür
                    </span>
                  </div>
                )}

                {/* Optional pet overlay text */}
                {showTextOnPlate && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent pt-8 pb-3 px-3 text-center z-10">
                    {options.fullName && (
                      <div className={`text-sm sm:text-base font-extrabold uppercase ${getFontFamilyStyle()} ${getTextColorStyle()}`}>
                        {options.fullName}
                      </div>
                    )}
                    {options.dates && (
                      <div className={`text-xs font-semibold text-neutral-200 mt-1 ${getFontFamilyStyle()}`}>
                        {options.dates}
                      </div>
                    )}
                    {options.quote && (
                      <div className={`text-[11px] font-medium text-amber-200 mt-1 uppercase ${getFontFamilyStyle()}`}>
                        {options.quote}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom info badge */}
            <div className="absolute bottom-3 right-3 bg-neutral-900/90 backdrop-blur-md text-neutral-200 px-3 py-1.5 rounded-lg text-[11px] border border-neutral-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Düz Beyaz Metal • Vida Deliği Yoktur • Tam Yüzey Fotoğraf Baskısı</span>
            </div>
          </div>
        )}
      </div>

      {/* Simulator Bottom Quick Info Bar */}
      <div className="bg-neutral-900 px-4 py-2.5 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-300">
        <div className="flex items-center gap-2">
          <SunMedium className="w-3.5 h-3.5 text-amber-400" />
          <span>Baskı Rengi:</span>
          <span className="font-bold text-white">
            {options.photoColorMode === 'original'
              ? '1. Canlı Renkli (Öncelikli)'
              : '2. Klasik Siyah-Beyaz'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-neutral-400">
          <span className="text-amber-300 font-semibold">• Düz Metal (Vida Deliksiz)</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">• Arkasına Yapıştırıcı Sürülür</span>
        </div>
      </div>
    </div>
  );
};
