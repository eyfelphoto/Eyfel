import React, { useState, useRef } from 'react';
import { Product, ProductSize, CustomizationOptions, CartItem } from '../types';
import { LiveSimulator } from './LiveSimulator';
import { SAMPLE_QUOTES } from '../data/products';
import { 
  X, Upload, CheckCircle2, ShieldCheck, Sparkles, 
  AlertTriangle, FileText, Gift, Info, Trash2,
  ChevronRight, ShoppingBag, Camera, Type
} from 'lucide-react';

interface ProductCustomizerModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export const ProductCustomizerModal: React.FC<ProductCustomizerModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const isHumanModel = product.category === 'insan';

  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes.find(s => s.popular) || product.sizes[0]
  );

  const [options, setOptions] = useState<CustomizationOptions>({
    sizeId: selectedSize.id,
    photoUrl: null,
    photoFileName: undefined,
    photoColorMode: 'original', // 1st priority: Orijinal Renkli
    photoZoom: 1,
    includeText: false, // For pets: false by default (can be turned on)
    fullName: isHumanModel ? '' : product.defaultTextPreset.title,
    dates: isHumanModel ? '' : product.defaultTextPreset.dates,
    quote: isHumanModel ? '' : product.defaultTextPreset.quote,
    fontFamily: 'serif',
    textColor: 'black',
    includeBorder: true,
    borderStyle: 'classic',
    specialNote: '',
  });

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPdfOrTiff, setIsPdfOrTiff] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSizeChange = (size: ProductSize) => {
    setSelectedSize(size);
    setOptions(prev => ({ ...prev, sizeId: size.id }));
  };

  const processFile = (file: File) => {
    setUploadError(null);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.tif', '.heic', '.pdf'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
      setUploadError('Lütfen geçerli bir dosya yükleyin (JPEG, PNG, TIFF, WEBP, JPG, HEIC veya PDF).');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadError('Dosya boyutu en fazla 25 MB olabilir.');
      return;
    }

    const isSpecialFormat = fileName.endsWith('.pdf') || fileName.endsWith('.tiff') || fileName.endsWith('.tif') || fileName.endsWith('.heic');
    setIsPdfOrTiff(isSpecialFormat);

    if (isSpecialFormat) {
      setOptions(prev => ({
        ...prev,
        photoFileName: file.name,
      }));
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOptions(prev => ({
          ...prev,
          photoUrl: e.target?.result as string,
          photoFileName: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemovePhoto = () => {
    setOptions(prev => ({
      ...prev,
      photoUrl: null,
      photoFileName: undefined,
    }));
    setIsPdfOrTiff(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      product,
      selectedSize,
      customization: options,
      unitPrice: selectedSize.price,
      quantity: 1,
      addedAt: Date.now(),
    };
    onAddToCart(cartItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 flex flex-col max-h-[95vh]">
        {/* Modal Header */}
        <div className="bg-neutral-900 text-white px-5 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <span className="bg-amber-600 text-white text-xs uppercase px-2.5 py-1 rounded font-bold tracking-wider">
              {product.tag}
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">{product.title}</h2>
              <p className="text-xs text-neutral-400 hidden sm:block">
                {isHumanModel ? 'Sadece Fotoğraf Baskısı Hizmeti' : 'İsteğe Bağlı Sadece Fotoğraf veya Fotoğraf + Yazı'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prominent Marble Notice in Modal */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>DİKKAT: Mezar Mermeri satmıyoruz.</strong> Sadece mevcut mezar taşlarına yapıştırılan, 10 yıl solmama garantili beyaz metal UV baskı plaka üretiyoruz.
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
            <Gift className="w-3.5 h-3.5 text-emerald-600" /> Ücretsiz Yapıştırıcı Dahil
          </span>
        </div>

        {/* Modal Body: Split 2 columns (Simulator on left, options on right) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-neutral-50/50">
          {/* Left Column: Live Simulator Preview */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="sticky top-0">
              <LiveSimulator
                modelType={product.modelType}
                isHumanModel={isHumanModel}
                options={options}
                dimensionsText={selectedSize.dimensions}
              />

              {/* Guarantees Box under simulator */}
              <div className="mt-4 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-neutral-900 font-semibold">10 Yıl Solmama Garantisi</strong>
                    <span className="text-neutral-500 text-[11px]">Güneşe, dona ve yağmura karşı UV koruma</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-neutral-900 font-semibold">Montaj Yapıştırıcısı Hediye</strong>
                    <span className="text-neutral-500 text-[11px]">Kutu içinde özel taş yapıştırıcısı ücretsiz</span>
                  </div>
                </div>
              </div>

              {/* Easy Assembly Note */}
              <div className="mt-2.5 bg-blue-50/80 border border-blue-200 rounded-lg p-2.5 text-[11px] text-blue-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span><strong>Kolay Montaj:</strong> Matkapsız ve vidasız. Plakanın arkasına yapıştırıcıyı sürüp taşa 30 saniye bastırmanız yeterlidir.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {/* Step 1: Size Selection (4 exact sizes: 10x15, 13x18, 15x21, 20x30) */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">1</span>
                  Ölçü Seçimi (4 Farklı Boyut)
                </label>
                <span className="text-xs text-neutral-500">Mermer mezar taşına uygun ebat</span>
              </div>

              {/* Headstone 60x60 and 30x60 mounting space explanation */}
              <div className="mb-3 p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[11px] text-neutral-700 leading-relaxed flex items-center gap-2">
                <span className="text-amber-600 font-bold shrink-0">ℹ️ Bilgi:</span>
                <span>
                  Standart mezar taşları <strong>60x60 cm</strong> olup üst kısımda <strong>30x60 cm</strong> boş alan kalır. Düz metal plaka vidasız olarak bu alana yapışır. Simülatörde seçtiğiniz ebat mezar taşı üzerinde birebir gerçek oranında ölçeklenir.
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {product.sizes.map(size => {
                  const isSelected = selectedSize.id === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => handleSizeChange(size)}
                      className={`relative p-3 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'border-amber-600 bg-amber-50/50 ring-2 ring-amber-600/20 shadow-sm'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      {size.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[9px] uppercase px-1.5 py-0.2 rounded font-bold whitespace-nowrap">
                          Popüler
                        </span>
                      )}
                      <div className="text-[11px] font-semibold text-neutral-500">{size.label}</div>
                      <div className="text-sm font-black text-neutral-900 mt-0.5">{size.dimensions}</div>
                      <div className="text-xs font-bold text-amber-700 mt-1">{size.price.toLocaleString('tr-TR')} ₺</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Photo Upload Area */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">2</span>
                  Fotoğraf Yükleme Alanı
                </label>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ücretsiz Çizik & Renk Rötuşu
                </span>
              </div>

              <p className="text-xs text-neutral-500 mb-3">
                Desteklenen formatlar: <strong>JPEG, PNG, TIFF, WEBP, JPG, HEIC, PDF</strong> (Eski vesikalık fotoğraflar telefonla net çekilip yüklenebilir)
              </p>

              {/* Upload Dropzone */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.tiff,.tif,.heic,.pdf,image/*,application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload-input"
              />

              {options.photoFileName ? (
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {options.photoUrl ? (
                      <img
                        src={options.photoUrl}
                        alt="Yüklenen Fotoğraf"
                        className="w-12 h-12 rounded-lg object-cover border border-neutral-300 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-neutral-900 truncate">
                        {options.photoFileName}
                      </div>
                      <div className="text-[11px] text-emerald-600 font-medium">
                        {isPdfOrTiff ? 'Yüksek çözünürlüklü belge yüklendi' : 'Fotoğraf simülatöre aktarıldı'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-neutral-700 bg-white border border-neutral-200 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100"
                    >
                      Değiştir
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-neutral-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50"
                      title="Kaldır"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-amber-600 bg-amber-50'
                      : 'border-neutral-300 hover:border-amber-500 bg-neutral-50/70 hover:bg-neutral-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-neutral-800">
                    Fotoğraf veya Belge Yüklemek İçin Tıklayın
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    veya dosyayı buraya sürükleyip bırakın (Maks. 25 MB)
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Photo Options: 1. Renkli (Öncelikli), 2. Siyah-Beyaz. (Sepya removed!) */}
              <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-700 font-semibold">Baskı Renk Seçeneği:</span>
                  <div className="inline-flex rounded-lg border border-neutral-200 p-0.5 bg-neutral-100">
                    <button
                      type="button"
                      onClick={() => setOptions(prev => ({ ...prev, photoColorMode: 'original' }))}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                        options.photoColorMode === 'original'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'text-neutral-700 hover:text-neutral-900'
                      }`}
                    >
                      1. Canlı Renkli (Öncelikli)
                    </button>
                    <button
                      type="button"
                      onClick={() => setOptions(prev => ({ ...prev, photoColorMode: 'bw' }))}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-all ${
                        options.photoColorMode === 'bw'
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'text-neutral-700 hover:text-neutral-900'
                      }`}
                    >
                      2. Siyah-Beyaz
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-neutral-600 font-medium">Yakınlaştır:</span>
                  <input
                    type="range"
                    min="1"
                    max="1.6"
                    step="0.05"
                    value={options.photoZoom}
                    onChange={(e) => setOptions(prev => ({ ...prev, photoZoom: parseFloat(e.target.value) }))}
                    className="w-20 accent-amber-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Human models vs Pet models Logic */}
            {isHumanModel ? (
              /* İNSAN MEZARLARI İÇİN: SADECE FOTOĞRAF BASKISI BİLGİLENDİRMESİ */
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs">
                <div className="flex items-start gap-2.5">
                  <Camera className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-950 text-sm">
                      Sadece Fotoğraf Baskısı Hizmeti
                    </h4>
                    <p className="text-amber-900 mt-1 leading-relaxed">
                      İnsan mezarlarında plaka üzerine <strong>sadece yüksek çözünürlüklü fotoğraf baskısı</strong> yapılmaktadır. 
                      İsim, doğum-ölüm tarihleri ve dua zaten mezar mermerine taş ustası tarafından kazındığından; plakanız mermer baş taşına porselen/metal mezar resmi olarak yapıştırılmakta ve taşın asil duruşunu tamamlamaktadır.
                    </p>
                  </div>
                </div>

                {/* Additional Note */}
                <div className="mt-3 pt-3 border-t border-amber-200/60">
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Grafik Ekibine Özel Notunuz (Varsa):
                  </label>
                  <textarea
                    rows={2}
                    value={options.specialNote || ''}
                    onChange={(e) => setOptions(prev => ({ ...prev, specialNote: e.target.value }))}
                    placeholder="Örn: Arka planı beyaz yapın, yüzdeki lekeyi temizleyin..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            ) : (
              /* KEDİ - KÖPEK CAN DOSTLARIMIZ İÇİN: İSTEĞE BAĞLI SADECE FOTOĞRAF VEYA FOTOĞRAF + YAZI */
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <label className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">3</span>
                    Baskı Türü Seçimi (Can Dostlarımız İçin)
                  </label>
                  <span className="text-xs text-neutral-500">İsteğe Bağlı</span>
                </div>

                {/* Toggle: Sadece Fotoğraf vs Fotoğraf + Yazı */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOptions(prev => ({ ...prev, includeText: false }))}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      !options.includeText
                        ? 'border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-600/20 font-bold'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span className="text-xs">Sadece Fotoğraf</span>
                    <span className="text-[10px] text-neutral-500">Yazısız sade baskı</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOptions(prev => ({ ...prev, includeText: true }))}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      options.includeText
                        ? 'border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-600/20 font-bold'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <Type className="w-4 h-4 text-amber-600" />
                    <span className="text-xs">Fotoğraf + Yazı</span>
                    <span className="text-[10px] text-neutral-500">İsim, tarih ve anma sözü</span>
                  </button>
                </div>

                {/* If includeText is active for pets, show inputs */}
                {options.includeText && (
                  <div className="space-y-3 pt-2 border-t border-neutral-100 animate-fadeIn">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Can Dostumuzun Adı:
                      </label>
                      <input
                        type="text"
                        value={options.fullName || ''}
                        onChange={(e) => setOptions(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder={product.defaultTextPreset.title}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Tarih (Doğum - Vefat veya Birlikte Geçen Yıllar):
                      </label>
                      <input
                        type="text"
                        value={options.dates || ''}
                        onChange={(e) => setOptions(prev => ({ ...prev, dates: e.target.value }))}
                        placeholder="2012 - 2024"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-neutral-700">
                          Anma Cümlesi / Sevgi Sözü:
                        </label>
                        <span className="text-[11px] text-neutral-400">Hazır sözlerden seçebilirsiniz</span>
                      </div>
                      <input
                        type="text"
                        value={options.quote || ''}
                        onChange={(e) => setOptions(prev => ({ ...prev, quote: e.target.value }))}
                        placeholder="KALBİMİZDE YAŞIYORSUN"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500 uppercase mb-2"
                      />

                      {/* Quick-pick Preset Quote Buttons */}
                      <div className="flex flex-wrap gap-1.5">
                        {SAMPLE_QUOTES.hayvan.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setOptions(prev => ({ ...prev, quote: q }))}
                            className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                              options.quote === q
                                ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                                : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Note */}
                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    Grafik Ekibine Özel Notunuz (Varsa):
                  </label>
                  <textarea
                    rows={2}
                    value={options.specialNote || ''}
                    onChange={(e) => setOptions(prev => ({ ...prev, specialNote: e.target.value }))}
                    placeholder="Örn: Pati motiflerini beyaz yapın, fotoğrafı hafif aydınlatın..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer / Checkout Action Bar */}
        <div className="bg-white border-t border-neutral-200 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <div className="text-xs text-neutral-500">
                Seçilen Model & Boyut: <strong>{product.title}</strong> ({selectedSize.dimensions})
              </div>
              <div className="text-2xl font-black text-neutral-900 flex items-baseline gap-2">
                <span>{selectedSize.price.toLocaleString('tr-TR')} ₺</span>
                <span className="text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Ücretsiz Kargo & Yapıştırıcı Dahil
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 sm:w-auto px-4 py-2.5 text-xs font-semibold text-neutral-700 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-2/3 sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-xl shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Tasarımı Sepete Ekle</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
