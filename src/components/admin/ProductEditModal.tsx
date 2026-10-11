import React, { useState, useRef } from 'react';
import { Product, ProductSize, ShapeModel } from '../../types';
import { 
  X, Save, Upload, Plus, Trash2, Tag, Percent, 
  DollarSign, Image as ImageIcon, Layers, Sparkles, 
  Globe, Search, ShieldCheck, Check, AlertCircle, 
  Info, RefreshCw, Eye, Package, CheckCircle2, ChevronRight
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface ProductEditModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (updatedProduct: Product) => void;
}

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  product,
  isOpen,
  onClose,
  onSaveSuccess,
}) => {
  // Navigation tabs within modal
  const [activeTab, setActiveTab] = useState<
    'general' | 'pricing' | 'stock' | 'media' | 'variants' | 'descriptions' | 'seo'
  >('general');

  // Form states
  const [title, setTitle] = useState(product.title || '');
  const [subtitle, setSubtitle] = useState(product.subtitle || '');
  const [category, setCategory] = useState<'insan' | 'hayvan'>(product.category || 'insan');
  const [modelType, setModelType] = useState<ShapeModel>(product.modelType || 'dikdortgen');
  const [tag, setTag] = useState(product.tag || 'En Çok Tercih Edilen');
  const [isActive, setIsActive] = useState(product.isActive !== false);

  // Pricing & Tax & Discount
  const [basePrice, setBasePrice] = useState<number>(product.basePrice || 690);
  const [compareAtPrice, setCompareAtPrice] = useState<number | string>(
    product.compareAtPrice ? product.compareAtPrice : ''
  );
  const [discountPrice, setDiscountPrice] = useState<number | string>(
    product.discountPrice ? product.discountPrice : ''
  );
  const [taxRate, setTaxRate] = useState<number>(product.taxRate ?? 20);
  const [taxIncluded, setTaxIncluded] = useState<boolean>(product.taxIncluded ?? true);

  // Stock
  const [stockStatus, setStockStatus] = useState<'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order'>(
    product.stockStatus || 'in_stock'
  );
  const [stockQuantity, setStockQuantity] = useState<number>(product.stockQuantity ?? 100);

  // Media
  const [imageUrl, setImageUrl] = useState(product.image || '');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Variants / Combinations (sizes)
  const [sizes, setSizes] = useState<ProductSize[]>(
    product.sizes ? JSON.parse(JSON.stringify(product.sizes)) : []
  );

  // Descriptions & Features
  const [description, setDescription] = useState(product.description || '');
  const [shapeDetails, setShapeDetails] = useState(product.shapeDetails || '');
  const [featuresList, setFeaturesList] = useState<string[]>(
    Array.isArray(product.features) ? [...product.features] : []
  );
  const [newFeatureText, setNewFeatureText] = useState('');

  // SEO
  const [seoTitle, setSeoTitle] = useState(product.seoTitle || product.title || '');
  const [seoDescription, setSeoDescription] = useState(
    product.seoDescription || product.description || ''
  );
  const [slug, setSlug] = useState(
    product.slug || product.id || ''
  );

  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  // Calculate discount percentage
  const numCompare = Number(compareAtPrice) || 0;
  const numBase = Number(basePrice) || 0;
  const discountPercent = numCompare > numBase 
    ? Math.round(((numCompare - numBase) / numCompare) * 100) 
    : 0;

  // Handle image file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingImage(true);

      // If Supabase Storage is configured, upload to order-photos or public bucket
      if (isSupabaseConfigured && supabase) {
        try {
          const cleanName = `prod-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const { data, error } = await supabase.storage.from('order-photos').upload(cleanName, file, {
            contentType: file.type,
            upsert: true,
          });

          if (!error && data) {
            // Get public or signed url
            const { data: urlData } = supabase.storage.from('order-photos').getPublicUrl(cleanName);
            if (urlData?.publicUrl) {
              setImageUrl(urlData.publicUrl);
            } else {
              setImageUrl(`order-photos/${cleanName}`);
            }
          }
        } catch (err) {
          console.error('Fotoğraf yükleme hatası:', err);
        }
      }

      // Also set preview as base64 reader if storage failed or offline
      const reader = new FileReader();
      reader.onload = (re) => {
        if (re.target?.result) {
          setImageUrl(re.target.result as string);
        }
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Variant operations
  const handleAddSizeVariant = () => {
    const newVariant: ProductSize = {
      id: `v_${Date.now()}`,
      label: 'Yeni Ebat',
      dimensions: '15 x 21 cm',
      price: basePrice || 890,
      compareAtPrice: numCompare || undefined,
      stockQuantity: 25,
      popular: false,
    };
    setSizes([...sizes, newVariant]);
  };

  const handleUpdateSizeVariant = (index: number, field: keyof ProductSize, value: any) => {
    const updated = [...sizes];
    updated[index] = { ...updated[index], [field]: value };
    setSizes(updated);
  };

  const handleRemoveSizeVariant = (index: number) => {
    if (sizes.length <= 1) {
      alert('Üründe en az bir ebat kombinasyonu bulunmalıdır.');
      return;
    }
    setSizes(sizes.filter((_, i) => i !== index));
  };

  // Features list operations
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeaturesList([...featuresList, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== index));
  };

  // Save changes
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFeedbackMsg(null);

    try {
      const payload = {
        productId: product.id,
        title: title.trim(),
        subtitle: subtitle.trim(),
        category,
        tag: tag.trim(),
        imageUrl: imageUrl.trim(),
        basePrice: Number(basePrice),
        description: description.trim(),
        shapeDetails: shapeDetails.trim(),
        sizes,
        isActive,
        stockStatus,
        compareAtPrice: numCompare > 0 ? numCompare : null,
        discountPrice: Number(discountPrice) || null,
        taxRate: Number(taxRate),
        taxIncluded: Boolean(taxIncluded),
        stockQuantity: Number(stockQuantity),
        seoTitle: seoTitle.trim(),
        seoDescription: seoDescription.trim(),
        slug: slug.trim(),
        featuresList,
      };

      // Call Netlify Function admin-api
      const res = await fetch('/api/admin-api?action=update_product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || 'Ürün güncellenirken bir hata oluştu.');
      }

      // Create updated Product object for local state sync
      const updatedProduct: Product = {
        ...product,
        title: payload.title,
        subtitle: payload.subtitle,
        category: payload.category,
        modelType,
        tag: payload.tag,
        image: payload.imageUrl,
        basePrice: payload.basePrice,
        compareAtPrice: numCompare > 0 ? numCompare : undefined,
        discountPrice: Number(discountPrice) || undefined,
        taxRate: payload.taxRate,
        taxIncluded: payload.taxIncluded,
        stockStatus: payload.stockStatus,
        stockQuantity: payload.stockQuantity,
        sizes: payload.sizes,
        description: payload.description,
        shapeDetails: payload.shapeDetails,
        features: payload.featuresList,
        seoTitle: payload.seoTitle,
        seoDescription: payload.seoDescription,
        slug: payload.slug,
        isActive: payload.isActive,
      };

      setFeedbackMsg({ type: 'success', text: 'Ürün başarıyla güncellendi ve canlı mağazaya yansıtıldı.' });
      setTimeout(() => {
        onSaveSuccess(updatedProduct);
        onClose();
      }, 700);
    } catch (err: any) {
      console.error('Ürün kaydetme hatası:', err);
      setFeedbackMsg({ type: 'error', text: err.message || 'Ürün kaydedilemedi.' });
    } finally {
      setIsSaving(false);
    }
  };

  const presetImages = [
    { label: 'Dikdörtgen Mezar', path: '/images/dikdortgen_60x60_model.jpg' },
    { label: 'Kare Mezar', path: '/images/kare_60x60_model.jpg' },
    { label: 'Kalp Mezar', path: '/images/kalp_60x60_model.jpg' },
    { label: 'Yuvarlak Mezar', path: '/images/yuvarlak_60x60_model.jpg' },
    { label: 'Kedi Anma', path: '/images/kedi_anma_model.jpg' },
    { label: 'Köpek Anma', path: '/images/kopek_anma_model.jpg' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">Ürün Düzenle: {product.title}</h2>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {isActive ? 'Yayında / Aktif' : 'Pasif / Gizli'}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono">ID: {product.id} • Model: {product.modelType}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white p-2 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="bg-stone-100 border-b border-stone-200 px-4 sm:px-6 flex overflow-x-auto gap-2 py-2.5 text-xs font-bold text-stone-600 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'general' ? 'bg-white text-stone-900 shadow-xs border border-stone-200 text-amber-700' : 'hover:bg-stone-200/60'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>1. Ürün İsmi & Genel</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pricing' ? 'bg-white text-stone-900 shadow-xs border border-stone-200 text-amber-700' : 'hover:bg-stone-200/60'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>2. Fiyat & İndirim & Vergi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stock')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'stock' ? 'bg-white text-stone-900 shadow-xs border border-stone-200 text-amber-700' : 'hover:bg-stone-200/60'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>3. Stok Bilgisi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'media' ? 'bg-white text-stone-900 shadow-xs border border-stone-200 text-amber-700' : 'hover:bg-stone-200/60'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>4. Görsel Düzenleme</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('variants')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'variants' ? 'bg-white text-stone-900 shadow-xs border border-stone-200 text-amber-700' : 'hover:bg-stone-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5. Kombinasyonlar ({sizes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('descriptions')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'descriptions' ? 'bg-white text-stone-900 shadow-xs border border-stone-200 text-amber-700' : 'hover:bg-stone-200/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>6. Açıklamalar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'seo' ? 'bg-white text-stone-900 shadow-xs border border-stone-200 text-amber-700' : 'hover:bg-stone-200/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>7. SEO Ayarları</span>
          </button>
        </div>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div className={`px-6 py-2.5 text-xs font-semibold flex items-center gap-2 ${
            feedbackMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200' : 'bg-red-50 text-red-800 border-b border-red-200'
          }`}>
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: GENEL & İSİM */}
          {activeTab === 'general' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="text-sm font-bold text-stone-900">Ürün Temel Bilgileri & Başlık</h3>
                <p className="text-xs text-stone-500">Müşterilerin mağaza vitrininde ve aramalarda gördüğü isim ve etiket bilgileri.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Ürün İsmi (Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Örn: Klasik Dikdörtgen Mezar Fotoğraf Plakası"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Alt Başlık / Vurgu Sloganı
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Örn: 10 Yıl Solmama Garantili UV Beyaz Metal Baskı"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as 'insan' | 'hayvan')}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="insan">İnsan Mezar Plakası (Standart 60x60 Mezar Taşı)</option>
                    <option value="hayvan">Can Dostu Evcil Hayvan Anma Plakası</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Rozet / Etiket (Badge)
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="Örn: En Çok Tercih Edilen, Yeni Tasarım, Fırsat Ürünü"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Mağazada Yayın Durumu</h4>
                    <p className="text-[11px] text-stone-500">Bu ürünü ziyaretçilere açık tutun veya geçici olarak gizleyin.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FİYAT & İNDİRİM & VERGİ */}
          {activeTab === 'pricing' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="text-sm font-bold text-stone-900">Fiyatlandırma, İndirimli Fiyat ve KDV</h3>
                <p className="text-xs text-stone-500">Ürünün satış fiyatını, kampanya indirimlerini ve vergilendirme kurallarını belirleyin.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
                  <label className="block text-xs font-bold text-amber-950 mb-1">
                    Satış Fiyatı (Taban Fiyat) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={1}
                      step={1}
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="w-full pl-3 pr-8 py-2.5 bg-white border border-amber-300 rounded-xl text-sm font-black text-amber-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-stone-500">₺</span>
                  </div>
                  <span className="text-[10px] text-amber-800 mt-1 block">Müşterinin ödeyeceği güncel taban fiyat</span>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    İndirim Öncesi Eski Fiyat (Compare-at)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                      placeholder="Örn: 890"
                      className="w-full pl-3 pr-8 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-bold text-stone-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-stone-500">₺</span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1 block">Üstü çizili olarak gösterilir</span>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col justify-center">
                  <span className="text-xs font-bold text-stone-700 mb-1">Hesaplanan İndirim Oranı</span>
                  {discountPercent > 0 ? (
                    <div className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 px-3 py-1.5 rounded-xl font-black text-sm w-fit border border-red-200">
                      <Percent className="w-4 h-4 text-red-600" />
                      <span>%{discountPercent} İndirim</span>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400 font-medium">İndirim uygulanmıyor</span>
                  )}
                  <span className="text-[10px] text-stone-400 mt-1">Eski fiyat taban fiyattan yüksek olduğunda otomatik hesaplanır</span>
                </div>
              </div>

              {/* Taxation settings */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold text-stone-900">Vergilendirme & KDV Düzenleme</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Uygulanan KDV Oranı (%)
                    </label>
                    <select
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value={20}>%20 KDV (Genel Oran)</option>
                      <option value={10}>%10 KDV (İndirimli Oran)</option>
                      <option value={1}>%1 KDV</option>
                      <option value={0}>%0 (KDV Muaf)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id="taxIncludedCheck"
                      checked={taxIncluded}
                      onChange={(e) => setTaxIncluded(e.target.checked)}
                      className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                    />
                    <label htmlFor="taxIncludedCheck" className="text-xs font-bold text-stone-800 cursor-pointer">
                      Görüntülenen Fiyatlara KDV Dahildir (Tavsiye Edilen)
                    </label>
                  </div>
                </div>

                <div className="text-[11px] text-stone-500 bg-white p-3 rounded-xl border border-stone-200">
                  Örnek Hesaplama: <strong>{basePrice} ₺</strong> satış fiyatı için %{taxRate} KDV tutarı yaklaşık <strong>{((basePrice * taxRate) / (100 + taxRate)).toFixed(2)} ₺</strong> olarak faturaya yansır.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STOK BİLGİSİ */}
          {activeTab === 'stock' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="text-sm font-bold text-stone-900">Stok Yönetimi & Envanter Bilgisi</h3>
                <p className="text-xs text-stone-500">Ürünün stok durumunu ve depodaki hazır plaka adedini yönetin.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Stok Durumu *
                  </label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="in_stock">🟢 Stokta Mevcut (Hemen Teslim / 24 Saat)</option>
                    <option value="low_stock">🟡 Kritik Stok (Son Birkaç Adet)</option>
                    <option value="out_of_stock">🔴 Tükendi (Satışa Kapalı)</option>
                    <option value="pre_order">🔵 Ön Sipariş (Özel İmalat Süreci)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Stok Adedi (Envanter)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-stone-500 mt-1 block">Atölyedeki ham beyaz metal plaka adedi</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Üretim Notu:</strong> Mezar plakaları UV lak korumalı fırınlanmış beyaz alüminyum metal levha üzerine sipariş geldikten sonra 24 saat içinde kişiye özel basılmaktadır. Stok adedi boş levha envanterinizi temsil eder.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GÖRSEL DÜZENLEME */}
          {activeTab === 'media' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="text-sm font-bold text-stone-900">Ürün Görseli Düzenleme</h3>
                <p className="text-xs text-stone-500">Müşterinin vitrinde ve detay modalında gördüğü yüksek çözünürlüklü ürün fotoğrafı.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left Preview */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-stone-200 bg-stone-100 shadow-md">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).src = '/images/dikdortgen_60x60_model.jpg';
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Canlı Önizleme
                    </div>
                  </div>
                  <span className="text-[11px] text-stone-500 mt-2 text-center">Mezar taşındaki montaj simülasyonu</span>
                </div>

                {/* Right Edit & Upload Controls */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Görsel Bağlantısı (Image URL / Path) *
                    </label>
                    <input
                      type="text"
                      required
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="/images/dikdortgen_60x60_model.jpg veya https://..."
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Yeni Görsel Yükle (Bilgisayardan)
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 border border-dashed border-stone-400 rounded-xl text-xs font-bold text-stone-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Upload className={`w-4 h-4 ${isUploadingImage ? 'animate-bounce text-amber-600' : 'text-stone-600'}`} />
                      <span>{isUploadingImage ? 'Görsel Yükleniyor...' : 'Bilgisayardan Yeni Fotoğraf Seç & Yükle'}</span>
                    </button>
                  </div>

                  {/* Quick Preset Selector */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Hazır Mezar Taşı Modellerinden Seç:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {presetImages.map((preset) => (
                        <button
                          key={preset.path}
                          type="button"
                          onClick={() => setImageUrl(preset.path)}
                          className={`p-1.5 rounded-xl border text-left flex flex-col items-center gap-1 transition-all ${
                            imageUrl === preset.path
                              ? 'border-amber-600 bg-amber-50 ring-2 ring-amber-500/20'
                              : 'border-stone-200 hover:bg-stone-50'
                          }`}
                        >
                          <img src={preset.path} alt={preset.label} className="w-12 h-10 object-cover rounded-lg" />
                          <span className="text-[10px] font-semibold text-stone-700 text-center line-clamp-1">{preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KOMBİNASYONLAR (SIZE VARIANTS) */}
          {activeTab === 'variants' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Ebat Kombinasyonları & Fiyat Varyantları</h3>
                  <p className="text-xs text-stone-500">Müşterinin mezar taşının büyüklüğüne göre seçebileceği ebat seçenekleri.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSizeVariant}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Ebat Ekle</span>
                </button>
              </div>

              <div className="space-y-3">
                {sizes.map((variant, index) => (
                  <div
                    key={variant.id || index}
                    className="p-4 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                  >
                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-bold text-stone-600 mb-1">Ebat / Ölçü</label>
                      <input
                        type="text"
                        value={variant.dimensions}
                        onChange={(e) => handleUpdateSizeVariant(index, 'dimensions', e.target.value)}
                        placeholder="Örn: 15 x 21 cm"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] font-bold text-stone-600 mb-1">Satış Fiyatı (₺)</label>
                      <input
                        type="number"
                        min={1}
                        value={variant.price}
                        onChange={(e) => handleUpdateSizeVariant(index, 'price', Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-black text-amber-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-stone-600 mb-1">Eski Fiyat (₺)</label>
                      <input
                        type="number"
                        min={0}
                        value={variant.compareAtPrice || ''}
                        onChange={(e) => handleUpdateSizeVariant(index, 'compareAtPrice', Number(e.target.value) || undefined)}
                        placeholder="Örn: 1390"
                        className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3 flex items-center gap-2 pt-4">
                      <input
                        type="checkbox"
                        id={`popular_${index}`}
                        checked={Boolean(variant.popular)}
                        onChange={(e) => handleUpdateSizeVariant(index, 'popular', e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                      />
                      <label htmlFor={`popular_${index}`} className="text-xs font-bold text-amber-900 cursor-pointer">
                        ⭐ Popüler Ebat Rozeti
                      </label>
                    </div>

                    <div className="sm:col-span-1 flex justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => handleRemoveSizeVariant(index)}
                        className="p-2 text-stone-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                        title="Varyantı Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: AÇIKLAMALAR & TEKNİK */}
          {activeTab === 'descriptions' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="text-sm font-bold text-stone-900">Açıklamalar & Teknik Detaylar</h3>
                <p className="text-xs text-stone-500">Müşterinin okuyacağı detaylı ürün açıklaması ve montaj bilgisi.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Detaylı Ürün Açıklaması *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ürünün mezar taşına yapıştırılması, malzeme kalitesi ve özellikleri hakkında bilgi..."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Şekil ve Montaj Detayı (Örn: Mezar Taşı Uyum Bilgisi)
                </label>
                <input
                  type="text"
                  value={shapeDetails}
                  onChange={(e) => setShapeDetails(e.target.value)}
                  placeholder="Standart 60x60 mezar baş taşının üst 60x30 boşluğuna tam uyumludur."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Bullet Features */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  Öne Çıkan Özellik Maddeleri (Maddeli Liste)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Örn: 10 Yıl Dış Mekan Güneş ve Yağmur Solmama Garantisi"
                    className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold"
                  >
                    Ekle
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {featuresList.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 border border-stone-300 rounded-xl text-xs text-stone-800"
                    >
                      <span>✓ {feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-stone-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SEO AYARLARI */}
          {activeTab === 'seo' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="text-sm font-bold text-stone-900">Arama Motoru Optimizasyonu (SEO)</h3>
                <p className="text-xs text-stone-500">Google ve diğer arama motorlarında ürünün listelenme başlığı ve açıklaması.</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-stone-700">SEO Başlığı (Meta Title)</label>
                  <span className={`text-[10px] ${seoTitle.length > 60 ? 'text-amber-600 font-bold' : 'text-stone-400'}`}>
                    {seoTitle.length} / 60 karakter
                  </span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Klasik Dikdörtgen Mezar Fotoğraf Plakası | 10 Yıl Garantili UV Baskı"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-stone-700">SEO Açıklaması (Meta Description)</label>
                  <span className={`text-[10px] ${seoDescription.length > 160 ? 'text-amber-600 font-bold' : 'text-stone-400'}`}>
                    {seoDescription.length} / 160 karakter
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Mezar taşları için 10 yıl solmama garantili, güneş ve yağmura dayanıklı beyaz metal UV baskı fotoğraf plakaları. Vidasız ve deliksiz kolay montaj."
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">URL Uzantısı (Slug)</label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-stone-200 border border-r-0 border-stone-300 rounded-l-xl text-xs text-stone-500 font-mono">
                    https://eyfeltasarim.com/urun/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    placeholder="klasik-dikdortgen-mezar-plakasi"
                    className="flex-1 px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-r-xl text-xs font-mono text-stone-900 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Google SERP Live Preview Card */}
              <div className="mt-4 p-4 rounded-2xl bg-white border border-stone-300 shadow-xs space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                  Google Arama Sonucu Önizlemesi
                </span>
                <div className="text-xs text-stone-600 flex items-center gap-1 font-sans">
                  <span>https://eyfeltasarim.com › urun › {slug || product.id}</span>
                </div>
                <h4 className="text-base text-blue-700 font-medium hover:underline cursor-pointer font-sans">
                  {seoTitle || title || product.title}
                </h4>
                <p className="text-xs text-stone-600 line-clamp-2 font-sans leading-relaxed">
                  {seoDescription || description || product.description}
                </p>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-bold text-xs transition-colors cursor-pointer"
            >
              İptal
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet & Canlıya Al'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
