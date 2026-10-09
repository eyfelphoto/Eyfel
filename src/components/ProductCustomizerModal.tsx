import React, { useState, useRef, useMemo } from 'react';
import { Product, ProductSize, CustomizationOptions, CartItem, ShapeModel } from '../types';
import { SAMPLE_QUOTES, getSizesForShape, PET_SHAPES, RECTANGULAR_SIZES, SQUARE_SIZES, SELSIL_GLUE_PRICE, SELSIL_GLUE_IMAGE } from '../data/products';
import { 
  X, Upload, CheckCircle2, ShieldCheck, Sparkles, 
  AlertTriangle, FileText, Gift, Info, Trash2,
  ChevronRight, ShoppingBag, Camera, Type, Square,
  Circle, Heart, RectangleVertical
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

  // For pets, active shape state (Dikdörtgen, Kare, Kalp, Yuvarlak)
  const [petShape, setPetShape] = useState<'dikdortgen' | 'kare' | 'kalp' | 'yuvarlak'>('dikdortgen');

  // Compute available sizes based on product or pet shape
  const availableSizes = useMemo(() => {
    if (isHumanModel) {
      return product.sizes;
    }
    return getSizesForShape(petShape);
  }, [isHumanModel, product.sizes, petShape]);

  // Model showcase image (updates dynamically when pet shape is changed)
  const displayShowcaseImage = useMemo(() => {
    if (isHumanModel) {
      switch (product.modelType) {
        case 'kare':
          return '/images/kare_60x60_model.jpg';
        case 'kalp':
          return '/images/kalp_60x60_model.jpg';
        case 'yuvarlak':
          return '/images/yuvarlak_60x60_model.jpg';
        case 'dikdortgen':
        default:
          return '/images/dikdortgen_60x60_model.jpg';
      }
    } else {
      // Pet models: ONLY show animal memorial photos! Never human photos!
      switch (petShape) {
        case 'kare':
          return '/images/hayvan_kare_model.jpg';
        case 'kalp':
          return '/images/hayvan_kalp_model.jpg';
        case 'yuvarlak':
          return '/images/hayvan_yuvarlak_model.jpg';
        case 'dikdortgen':
        default:
          return product.id === 'kopek-model' 
            ? '/images/kopek_anma_model.jpg' 
            : '/images/kedi_anma_model.jpg';
      }
    }
  }, [isHumanModel, product.id, product.modelType, petShape]);

  const [selectedSize, setSelectedSize] = useState<ProductSize>(() => {
    const defaultList = isHumanModel ? product.sizes : RECTANGULAR_SIZES;
    return defaultList.find(s => s.popular) || defaultList[0];
  });

  const [options, setOptions] = useState<CustomizationOptions>({
    sizeId: selectedSize.id,
    selectedShape: isHumanModel ? undefined : 'dikdortgen',
    photoUrl: null,
    photoFileName: undefined,
    photoColorMode: 'original', // 1st priority: Orijinal Renkli
    photoZoom: 1,
    includeGlue: false, // Selsil Ultra Tack (+299 TL) opsiyonel
    includeText: false, // For pets: optional, false by default
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

  // Handle shape change for pet products
  const handleShapeChange = (newShape: 'dikdortgen' | 'kare' | 'kalp' | 'yuvarlak') => {
    setPetShape(newShape);
    const newSizes = getSizesForShape(newShape);
    
    // Maintain similar size index (e.g. popular size index 2)
    const currentIndex = availableSizes.findIndex(s => s.id === selectedSize.id);
    const targetSize = newSizes[currentIndex !== -1 ? currentIndex : 2] || newSizes[0];

    setSelectedSize(targetSize);
    setOptions(prev => ({
      ...prev,
      selectedShape: newShape,
      sizeId: targetSize.id,
    }));
  };

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
    const finalUnitPrice = selectedSize.price + (options.includeGlue ? SELSIL_GLUE_PRICE : 0);
    const cartItem: CartItem = {
      id: `${product.id}-${Date.now()}`,
      product: {
        ...product,
        // If pet, append the selected shape name in title for clarity
        title: !isHumanModel 
          ? `${product.title} (${petShape === 'dikdortgen' ? 'Dikdörtgen' : petShape === 'kare' ? 'Kare' : petShape === 'kalp' ? 'Kalp' : 'Yuvarlak'} Form)`
          : product.title,
      },
      selectedSize,
      customization: options,
      includeGlue: options.includeGlue,
      gluePrice: options.includeGlue ? SELSIL_GLUE_PRICE : 0,
      unitPrice: finalUnitPrice,
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
                {isHumanModel 
                  ? '60x60 Mezar Taşı Üst 60x30 Alanına Uygun Sadece Fotoğraf Baskısı (Vidasız Düz Metal)' 
                  : '4 Şekil Seçenekli, İsteğe Göre Sade Fotoğraf veya Fotoğraf + Dostumuzun İsmi'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
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
              <strong>DİKKAT: Mezar Mermeri satmıyoruz.</strong> Sadece taşlara yapıştırılan, 10 yıl solmama garantili beyaz metal UV baskı fotoğraf plakası üretiyoruz.
            </span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 10 Yıl Dış Mekan Solmama Garantisi
          </span>
        </div>

        {/* Modal Body: Split 2 columns (Product Showcase on left, options on right) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-neutral-50/50">
          {/* Left Column: Authentic Product Model Showcase */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="sticky top-0 space-y-4">
              {/* Product Model Visual Card */}
              <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200/90 shadow-md">
                <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                  <img
                    src={displayShowcaseImage}
                    alt={product.title}
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 bg-neutral-900/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{product.tag}</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-neutral-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md border border-neutral-200/60">
                    <span>{selectedSize.dimensions}</span>
                  </div>

                  {/* Solid Clean Metal Badge */}
                  <div className="absolute bottom-3 right-3 bg-neutral-900/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Vidasız & Deliksiz Düz Metal</span>
                  </div>
                </div>

                {/* Stone & Plate Information Footer */}
                <div className="p-3.5 bg-neutral-50 border-t border-neutral-200 text-xs text-neutral-700 leading-relaxed">
                  {isHumanModel ? (
                    <div>
                      <strong className="text-neutral-900 font-bold block mb-0.5">
                        60x60 cm Mezar Taşı Uygulama Örneği:
                      </strong>
                      <span>
                        Düz beyaz metal UV plaka, taşın üst <strong>30x60 cm</strong> boş alanına delme veya vida gerektirmeden yapışır. Fotoğraf metali komple kaplar.
                      </span>
                    </div>
                  ) : (
                    <div>
                      <strong className="text-neutral-900 font-bold block mb-0.5">
                        Can Dostumuz Anıt Plakası Uygulama Örneği:
                      </strong>
                      <span>
                        Seçtiğiniz formda ({petShape === 'dikdortgen' ? 'Dikdörtgen' : petShape === 'kare' ? 'Kare' : petShape === 'kalp' ? 'Kalp' : 'Yuvarlak'}) üretilen beyaz metal UV plaka, bahçe veya anıt taşına deliksiz vidasız kolayca yapıştırılır.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-neutral-900 font-semibold">10 Yıl Solmama Garantisi</strong>
                    <span className="text-neutral-500 text-[11px]">UV baskı teknolojisi ile güneşe ve dona dayanıklı</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-neutral-900 font-semibold">Delme & Vida Gerekmez</strong>
                    <span className="text-neutral-500 text-[11px]">Düz metal plaka, taşa delme yapmadan yapışır</span>
                  </div>
                </div>
              </div>

              {/* Easy Assembly Note */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 text-xs text-amber-950 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Pratik Montaj (Vidasız & Matkapsız):</strong>
                  <span className="text-[11px] text-amber-900 leading-relaxed">
                    Mezar taşı delinmez, vida kullanılmaz. Plakanın montajı için dilerseniz siparişinize güçlü dış mekan yapıştırıcısı Selsil Ultra Tack (+299 ₺) ekleyebilirsiniz.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {/* IF PET: STEP 1 IS SHAPE SELECTION (Dikdörtgen, Kare, Kalp, Yuvarlak) */}
            {!isHumanModel && (
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">1</span>
                    Model Şekli Seçimi (4 Form Seçeneği)
                  </label>
                  <span className="text-xs text-neutral-500">İstediğiniz şekli seçin</span>
                </div>

                <p className="text-xs text-neutral-600 mb-3">
                  Can dostumuz için Dikdörtgen, Kare, Kalp veya Yuvarlak formlardan dilediğinizi seçebilirsiniz:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PET_SHAPES.map((shape) => {
                    const isSelected = petShape === shape.id;
                    return (
                      <button
                        key={shape.id}
                        type="button"
                        onClick={() => handleShapeChange(shape.id)}
                        className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-600/20 font-bold shadow-xs'
                            : 'border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
                        }`}
                      >
                        {shape.id === 'dikdortgen' && <RectangleVertical className={`w-5 h-5 ${isSelected ? 'text-amber-600' : 'text-neutral-500'}`} />}
                        {shape.id === 'kare' && <Square className={`w-5 h-5 ${isSelected ? 'text-amber-600' : 'text-neutral-500'}`} />}
                        {shape.id === 'kalp' && <Heart className={`w-5 h-5 ${isSelected ? 'text-amber-600' : 'text-neutral-500'}`} />}
                        {shape.id === 'yuvarlak' && <Circle className={`w-5 h-5 ${isSelected ? 'text-amber-600' : 'text-neutral-500'}`} />}
                        <span className="text-xs">{shape.label.replace(' Model', '')}</span>
                        <span className="text-[10px] text-neutral-500">{shape.dimensionsSummary}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2 (OR 1 FOR HUMAN): SIZE SELECTION */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">
                    {isHumanModel ? '1' : '2'}
                  </span>
                  Ölçü ve Boyut Seçimi
                </label>
                <span className="text-xs text-neutral-500">Boyuta göre net fiyat</span>
              </div>

              {/* Headstone 60x60 and 30x60 mounting space explanation for humans */}
              {isHumanModel ? (
                <div className="mb-3 p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[11px] text-neutral-700 leading-relaxed flex items-center gap-2">
                  <span className="text-amber-600 font-bold shrink-0">ℹ️ Mezar Ölçüsü:</span>
                  <span>
                    Standart mezar taşları <strong>60x60 cm</strong> olup üst kısımda <strong>30x60 cm</strong> boş alan bulunur. Düz metal plaka vidasız olarak bu alana yapışır.
                  </span>
                </div>
              ) : (
                <div className="mb-3 p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[11px] text-neutral-700 leading-relaxed flex items-center gap-2">
                  <span className="text-amber-600 font-bold shrink-0">ℹ️ Bilgi:</span>
                  <span>
                    {petShape === 'dikdortgen' 
                      ? 'Dikdörtgen form için 10x15, 13x18, 15x21, 20x30 cm ölçüleri geçerlidir.'
                      : `${petShape === 'kare' ? 'Kare' : petShape === 'kalp' ? 'Kalp' : 'Yuvarlak'} form için 10x10, 13x13, 15x15, 20x20 cm ölçüleri geçerlidir.`}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {availableSizes.map(size => {
                  const isSelected = selectedSize.id === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => handleSizeChange(size)}
                      className={`relative p-3 rounded-xl border text-center transition-all cursor-pointer ${
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

            {/* STEP 3 (OR 2 FOR HUMAN): PHOTO UPLOAD AREA */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">
                    {isHumanModel ? '2' : '3'}
                  </span>
                  Fotoğraf Yükleme Alanı
                </label>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ücretsiz Çizik & Renk Rötuşu
                </span>
              </div>

              <p className="text-xs text-neutral-500 mb-3">
                Desteklenen formatlar: <strong>JPEG, PNG, TIFF, WEBP, JPG, HEIC, PDF</strong> (Eski vesikalık fotoğrafları telefonla net çekip yükleyebilirsiniz)
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
                        {isPdfOrTiff ? 'Yüksek çözünürlüklü belge yüklendi' : 'Fotoğraf başarıyla yüklendi'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-neutral-700 bg-white border border-neutral-200 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer"
                    >
                      Değiştir
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-neutral-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer"
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

              {/* Photo Options: 1. Canlı Renkli (Öncelikli), 2. Siyah-Beyaz (Sepia removed) */}
              <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-700 font-semibold">Baskı Renk Seçeneği:</span>
                  <div className="inline-flex rounded-lg border border-neutral-200 p-0.5 bg-neutral-100">
                    <button
                      type="button"
                      onClick={() => setOptions(prev => ({ ...prev, photoColorMode: 'original' }))}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
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
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                        options.photoColorMode === 'bw'
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'text-neutral-700 hover:text-neutral-900'
                      }`}
                    >
                      2. Siyah-Beyaz
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SELSIL ULTRA TACK ADHESIVE OPTIONAL ADD-ON */}
            <div className={`p-4 rounded-xl border transition-all ${
              options.includeGlue 
                ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-500/20 shadow-xs' 
                : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-xs'
            }`}>
              <div className="flex items-start gap-3.5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-xl border border-neutral-200 p-1 shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={SELSIL_GLUE_IMAGE}
                    alt="Selsil Ultra Tack 50ml Montaj Yapıştırıcısı"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      Önerilen Montaj Ürünü
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-500">
                      50 ml • 350 kg/m² Anında Tutunma
                    </span>
                  </div>
                  <h4 className="font-bold text-neutral-900 text-sm">
                    Selsil Ultra Tack Montaj Yapıştırıcısı (50ml)
                  </h4>
                  <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                    Mermer, taş ve dış mekan yüzeylerine delme veya vidaya gerek olmadan ultra güçlü anında yapışma sağlar. Suya, kara ve güneşe 10 yıl tam dayanıklıdır.
                  </p>
                  <div className="mt-2.5 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm font-extrabold text-amber-900">
                      +{SELSIL_GLUE_PRICE} ₺
                    </span>
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={options.includeGlue || false}
                        onChange={(e) => setOptions(prev => ({ ...prev, includeGlue: e.target.checked }))}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
                      />
                      <span className="text-xs font-bold text-neutral-900">
                        {options.includeGlue ? '✓ Sepete Eklendi (+299 ₺)' : '+ Sepete Ekle (+299 ₺)'}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 4 (OR 3 FOR HUMAN): DETAILS & TEXT OPTIONS */}
            {isHumanModel ? (
              /* HUMAN: ONLY PHOTO PRINTING SERVICE */
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200 text-xs">
                <div className="flex items-start gap-2.5">
                  <Camera className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-950 text-sm">
                      Sadece Fotoğraf Baskısı Hizmeti
                    </h4>
                    <p className="text-amber-900 mt-1 leading-relaxed">
                      İnsan mezarlarında plaka üzerine <strong>sadece yüksek çözünürlüklü fotoğraf baskısı</strong> yapılmaktadır. 
                      Fotoğraf metali komple kaplar. İsim, tarihler ve dua mermere taş ustası tarafından kazındığından; plakanız mermerin üst 60x30 cm boş alanına mezar fotoğrafı olarak yapıştırılmaktadır.
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
                    placeholder="Örn: Arka planı temizleyin, yüzdeki lekeyi kaldırın..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-neutral-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            ) : (
              /* PET: OPTIONAL PHOTO ONLY OR PHOTO + TEXT (NO RELIGIOUS TEXT / FATIHA) */
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-neutral-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <label className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">4</span>
                    Baskı Seçeneği (Can Dostumuza Özel)
                  </label>
                  <span className="text-xs text-neutral-500">İsteğe Bağlı</span>
                </div>

                {/* Toggle: Sadece Fotoğraf vs Fotoğraf + Yazı */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOptions(prev => ({ ...prev, includeText: false }))}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      !options.includeText
                        ? 'border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-600/20 font-bold'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <Camera className="w-4 h-4 text-amber-600" />
                    <span className="text-xs">Sadece Fotoğraf</span>
                    <span className="text-[10px] text-neutral-500">Metali komple kaplayan sade fotoğraf</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOptions(prev => ({ ...prev, includeText: true }))}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                      options.includeText
                        ? 'border-amber-600 bg-amber-50 text-amber-950 ring-2 ring-amber-600/20 font-bold'
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <Type className="w-4 h-4 text-amber-600" />
                    <span className="text-xs">Fotoğraf + Yazı</span>
                    <span className="text-[10px] text-neutral-500">Dostumuzun adı ve sevgi sözü</span>
                  </button>
                </div>

                {/* If includeText is active for pets, show inputs */}
                {options.includeText && (
                  <div className="space-y-3 pt-2 border-t border-neutral-100 animate-fadeIn">
                    <div className="p-2.5 bg-amber-50 rounded-lg text-[11px] text-amber-900 border border-amber-200">
                      <strong>⚠️ Önemli Not:</strong> Can dostlarımız için 'Ruhuna Fatiha' veya insan mezar yazıları uygun değildir. Sadece dostumuzun ismi, yılları ve sevgi dolu anma cümlesi yer alır.
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Can Dostumuzun Adı (İsim):
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
                        Birlikte Geçirdiğimiz Yıllar (Tarih):
                      </label>
                      <input
                        type="text"
                        value={options.dates || ''}
                        onChange={(e) => setOptions(prev => ({ ...prev, dates: e.target.value }))}
                        placeholder="2014 - 2024"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-neutral-700">
                          Sevgi & Anma Cümlesi:
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
                            className={`text-[11px] px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
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
                    placeholder="Örn: Arka planı hafif aydınlatın..."
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
                {!isHumanModel && (
                  <span className="ml-1 text-amber-700 font-bold">
                    [{petShape === 'dikdortgen' ? 'Dikdörtgen' : petShape === 'kare' ? 'Kare' : petShape === 'kalp' ? 'Kalp' : 'Yuvarlak'}]
                  </span>
                )}
              </div>
              <div className="text-2xl font-black text-neutral-900 flex items-baseline gap-2 flex-wrap">
                <span>{(selectedSize.price + (options.includeGlue ? SELSIL_GLUE_PRICE : 0)).toLocaleString('tr-TR')} ₺</span>
                {options.includeGlue && (
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                    +299 ₺ Selsil Ultra Dahil
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Ücretsiz Sigortalı Kargo
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 sm:w-auto px-4 py-2.5 text-xs font-semibold text-neutral-700 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-2/3 sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-xl shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Sepete Ekle</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
