import React, { useState, useEffect } from 'react';
import { 
  Package, ShoppingCart, TrendingUp, Settings, 
  Search, Filter, CheckCircle2, Clock, Truck, 
  AlertCircle, Eye, Download, LogOut, ArrowLeft,
  ShieldCheck, RefreshCw, Sparkles, ExternalLink,
  ChevronRight, Calendar, User, Phone, MapPin, Tag
} from 'lucide-react';
import { Order, OrderStatus, Product } from '../../types';
import { PRODUCTS } from '../../data/products';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface AdminPanelProps {
  onBackToStore: () => void;
  onLogout: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToStore, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'reports' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status update & shipping state in modal
  const [editStatus, setEditStatus] = useState<OrderStatus>('Ödeme Bekliyor');
  const [editCarrier, setEditCarrier] = useState('');
  const [editTracking, setEditTracking] = useState('');
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [signedPhotoUrl, setSignedPhotoUrl] = useState<string | null>(null);

  // Load orders from Supabase (or localStorage fallback)
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const mappedOrders: Order[] = data.map((d: any) => ({
            orderId: d.order_number,
            createdAt: new Date(d.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            items: d.items || [],
            customer: d.customer_info || { fullName: 'Müşteri', phone: '', email: '', city: '', district: '', address: '' },
            paymentMethod: d.payment_method || 'paytr',
            subtotal: Number(d.subtotal || 0),
            discount: 0,
            shipping: Number(d.shipping_fee || 0),
            total: Number(d.total_amount || 0),
            status: d.status as OrderStatus,
            paymentStatus: d.payment_status,
            trackingNumber: d.tracking_number,
            shippingCarrier: d.shipping_carrier,
          }));
          setOrders(mappedOrders);
          setIsLoading(false);
          return;
        }
      }

      // Fallback: localStorage orders
      const saved = localStorage.getItem('ebedi_hatira_orders');
      if (saved) {
        setOrders(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Siparişleri çekme hatası:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // When an order is selected, initialize edit states
  useEffect(() => {
    if (selectedOrder) {
      setEditStatus(selectedOrder.status);
      setEditCarrier(selectedOrder.shippingCarrier || 'Yurtiçi Kargo');
      setEditTracking(selectedOrder.trackingNumber || '');
      setSignedPhotoUrl(null);

      // If item has a photo, check if we need a signed URL
      const itemWithPhoto = selectedOrder.items?.find(i => i.customization?.photoUrl);
      if (itemWithPhoto?.customization?.photoUrl) {
        const rawUrl = itemWithPhoto.customization.photoUrl;
        if (rawUrl.startsWith('order-photos/')) {
          // Call get-signed-url
          fetch(`/api/get-signed-url?filePath=${encodeURIComponent(rawUrl)}`)
            .then(res => res.json())
            .then(data => {
              if (data.signedUrl) setSignedPhotoUrl(data.signedUrl);
            })
            .catch(console.error);
        } else {
          setSignedPhotoUrl(rawUrl);
        }
      }
    }
  }, [selectedOrder]);

  const handleSaveOrderChanges = async () => {
    if (!selectedOrder) return;
    setIsUpdatingOrder(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase
          .from('orders')
          .update({
            status: editStatus,
            shipping_carrier: editCarrier,
            tracking_number: editTracking,
            updated_at: new Date().toISOString(),
          })
          .eq('order_number', selectedOrder.orderId);
      }

      // Update local state
      const updatedList = orders.map(o => {
        if (o.orderId === selectedOrder.orderId) {
          return {
            ...o,
            status: editStatus,
            shippingCarrier: editCarrier,
            trackingNumber: editTracking,
          };
        }
        return o;
      });

      setOrders(updatedList);
      localStorage.setItem('ebedi_hatira_orders', JSON.stringify(updatedList));
      setSelectedOrder(prev => prev ? ({ ...prev, status: editStatus, shippingCarrier: editCarrier, trackingNumber: editTracking }) : null);
      alert('Sipariş durumu ve kargo bilgileri başarıyla güncellendi.');
    } catch (err: any) {
      alert('Güncelleme hatası: ' + err.message);
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.phone.includes(searchTerm);

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && order.status === statusFilter;
  });

  // Calculate Reports stats
  const totalRevenue = orders
    .filter(o => o.status === 'Ödeme Alındı' || o.status === 'Baskı Sırasında' || o.status === 'Kalite Kontrol' || o.status === 'Kargolandı' || o.status === 'Teslim Edildi' || o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter(o => o.status === 'Ödeme Bekliyor').length;
  const inProgressCount = orders.filter(o => o.status === 'Ödeme Alındı' || o.status === 'Baskı Sırasında' || o.status === 'Kalite Kontrol').length;
  const shippedCount = orders.filter(o => o.status === 'Kargolandı' || o.status === 'Teslim Edildi').length;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
      {/* Top Admin Navbar */}
      <header className="bg-stone-950 text-white sticky top-0 z-30 shadow-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBackToStore}
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Mağazaya Dön"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Canlı Mağazaya Dön</span>
              </button>
              <div className="h-6 w-px bg-stone-800 mx-1 hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                  E
                </div>
                <div>
                  <h1 className="text-sm font-bold tracking-tight">Yönetici Paneli</h1>
                  <p className="text-[10px] text-amber-500 font-medium">Ebedi Hatıra E-Ticaret Yönetimi</p>
                </div>
              </div>
            </div>

            {/* Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'orders' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Siparişler ({orders.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('products')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'products' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Ürünler ({products.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reports')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'reports' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Raporlar</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'settings' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-400 hover:text-white'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Entegrasyonlar</span>
              </button>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onLogout}
                className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: SİPARİŞLER (ORDERS) */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div>
                <h2 className="text-lg font-extrabold text-stone-900">Gelen Siparişler</h2>
                <p className="text-xs text-stone-500 mt-0.5">Müşteri siparişlerini inceleyin, fotoğraf baskılarını indirin ve kargo takip numarası girin.</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={fetchOrders}
                  disabled={isLoading}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Yenile</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Sipariş no, müşteri adı veya telefon ile ara..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="Ödeme Bekliyor">Ödeme Bekliyor</option>
                <option value="Ödeme Alındı">Ödeme Alındı</option>
                <option value="Baskı Sırasında">Baskı Sırasında</option>
                <option value="Kalite Kontrol">Kalite Kontrol</option>
                <option value="Kargolandı">Kargolandı</option>
                <option value="Teslim Edildi">Teslim Edildi</option>
                <option value="İptal Edildi">İptal Edildi</option>
              </select>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Sipariş No</th>
                      <th className="py-3.5 px-4">Tarih</th>
                      <th className="py-3.5 px-4">Müşteri</th>
                      <th className="py-3.5 px-4">Ürün(ler)</th>
                      <th className="py-3.5 px-4">Ödeme</th>
                      <th className="py-3.5 px-4">Tutar</th>
                      <th className="py-3.5 px-4">Durum</th>
                      <th className="py-3.5 px-4 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-stone-400">
                          {searchTerm || statusFilter !== 'all' 
                            ? 'Filtreye uygun sipariş bulunamadı.' 
                            : 'Henüz kayıtlı bir sipariş bulunmuyor.'}
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const hasPhoto = order.items?.some(i => i.customization?.photoUrl);
                        return (
                          <tr key={order.orderId} className="hover:bg-amber-50/40 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-amber-900">
                              {order.orderId}
                            </td>
                            <td className="py-3.5 px-4 text-stone-500">
                              {order.createdAt}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-stone-900">{order.customer.fullName}</div>
                              <div className="text-[11px] text-stone-500 font-mono">{order.customer.phone}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-stone-900">
                                {order.items?.[0]?.product?.title || 'Mezar Plakası'}
                                {order.items?.length > 1 && ` (+${order.items.length - 1} ürün)`}
                              </div>
                              <div className="text-[10px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                                {hasPhoto && <span className="text-emerald-700 bg-emerald-50 px-1 rounded font-semibold">📷 Fotoğraflı</span>}
                                {order.items?.some(i => i.includeGlue) && <span className="text-amber-800 bg-amber-50 px-1 rounded font-semibold">🧴 Selsil Yapıştırıcı Dahil</span>}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="capitalize text-stone-600 font-semibold">
                                {order.paymentMethod === 'credit_card' || order.paymentMethod === 'paytr' ? '💳 PayTR Kart' : '🏦 Havale/EFT'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-extrabold text-stone-900">
                              {order.total} ₺
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10.5px] font-bold ${
                                order.status === 'Teslim Edildi' 
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.status === 'Kargolandı'
                                  ? 'bg-blue-100 text-blue-800'
                                  : order.status === 'Baskı Sırasında' || order.status === 'Kalite Kontrol'
                                  ? 'bg-amber-100 text-amber-900'
                                  : order.status === 'Ödeme Alındı'
                                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                                  : 'bg-stone-100 text-stone-700'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                className="px-3 py-1.5 bg-stone-900 hover:bg-amber-600 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer"
                              >
                                İncele & Yönet
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ÜRÜNLER (PRODUCTS) */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-stone-900">Ürün & Model Kataloğu</h2>
                <p className="text-xs text-stone-500 mt-0.5">Mağazadaki 6 plaka modelinin stok ve fiyat bilgilerini denetleyin.</p>
              </div>
              <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
                {products.length} Aktif Model
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(prod => (
                <div key={prod.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs p-4 flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 mb-3">
                      <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 bg-stone-900 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {prod.category === 'insan' ? 'İnsan Modeli' : 'Can Dostu'}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-stone-900">{prod.title}</h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">{prod.description}</p>
                    <div className="mt-3 pt-3 border-t border-stone-100 text-xs">
                      <div className="flex justify-between font-bold text-stone-900 mb-1">
                        <span>Başlangıç Fiyatı:</span>
                        <span className="text-amber-800 font-extrabold">{prod.basePrice} ₺</span>
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {prod.sizes.length} Ebat Seçeneği (10x15 - 20x30 cm)
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Stokta Mevcut
                    </span>
                    <button
                      type="button"
                      onClick={() => alert(`${prod.title} için fiyat düzenleme yakında eklenecektir.`)}
                      className="text-stone-700 hover:text-amber-700 font-bold underline"
                    >
                      Düzenle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RAPORLAR (REPORTS) */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <h2 className="text-lg font-extrabold text-stone-900">Satış & Ciro Performansı</h2>
              <p className="text-xs text-stone-500 mt-0.5">PayTR ve Havale üzerinden tamamlanan siparişlerin genel özeti.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Toplam Ciro</span>
                <span className="text-2xl font-black text-amber-900 mt-2 block">{totalRevenue.toLocaleString('tr-TR')} ₺</span>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">✓ Onaylanan siparişler</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Toplam Sipariş</span>
                <span className="text-2xl font-black text-stone-900 mt-2 block">{orders.length}</span>
                <span className="text-[11px] text-stone-500 mt-1 block">Tüm kayıtlı siparişler</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Baskıda / Hazırlanan</span>
                <span className="text-2xl font-black text-blue-900 mt-2 block">{inProgressCount}</span>
                <span className="text-[11px] text-blue-600 font-semibold mt-1 block">Atölye sürecinde</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Kargolanan / Teslim</span>
                <span className="text-2xl font-black text-emerald-900 mt-2 block">{shippedCount}</span>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Yola çıkan paketler</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ENTEGRASYONLAR (SETTINGS) */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <h2 className="text-lg font-extrabold text-stone-900">Entegrasyon & Güvenlik Ayarları</h2>
              <p className="text-xs text-stone-500 mt-0.5">PayTR iFrame ve Supabase bağlantı durumlarını buradan kontrol edebilirsiniz.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PayTR Card */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-600 text-white font-black flex items-center justify-center text-xs">
                      TR
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-stone-900">PayTR iFrame Ödeme API</h3>
                      <p className="text-[11px] text-stone-500">Kredi Kartı 3D Secure Tahsilat</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    Test / Canlı Modu
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2 text-stone-700 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span>merchant_id:</span>
                    <span className="font-bold text-stone-900">.env üzerinden okunur</span>
                  </div>
                  <div className="flex justify-between">
                    <span>merchant_key:</span>
                    <span className="text-emerald-700 font-bold">✓ Sunucu tarafında gizli</span>
                  </div>
                  <div className="flex justify-between">
                    <span>merchant_salt:</span>
                    <span className="text-emerald-700 font-bold">✓ Sunucu tarafında gizli</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bildirim Webhook:</span>
                    <span className="text-blue-700 font-semibold">/api/paytr-callback</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Netlify Dashboard &gt; Site configuration &gt; Environment variables ekranından PayTR anahtarlarınızı tanımladığınızda canlı ödeme akışı hemen aktifleşir.
                </p>
              </div>

              {/* Supabase Card */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                      ⚡
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-stone-900">Supabase Veritabanı & Storage</h3>
                      <p className="text-[11px] text-stone-500">PostgreSQL, RLS ve Private Storage</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isSupabaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {isSupabaseConfigured ? 'Bağlantı Aktif' : 'Yapılandırma Bekleniyor'}
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2 text-stone-700 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span>order-photos Bucket:</span>
                    <span className="text-emerald-700 font-bold">Özel (Private)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RLS Politikaları:</span>
                    <span className="text-emerald-700 font-bold">Aktif</span>
                  </div>
                  <div className="flex justify-between">
                    <span>İmzalı URL Süresi:</span>
                    <span className="font-bold">15 Dakika</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Projenizdeki <code>supabase/schema.sql</code> dosyasını Supabase SQL Editor'de çalıştırarak tabloları ve private depoyu tek tıkla oluşturabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ORDER DETAIL & MANAGEMENT MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-stone-300 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-stone-950 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <Package className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm sm:text-base">
                  Sipariş Detayı #{selectedOrder.orderId}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800"
              >
                ✕ Kapat
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Customer & Address Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                  <h4 className="font-bold text-stone-900 text-xs mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-700" />
                    Müşteri Bilgileri
                  </h4>
                  <div className="space-y-1 text-stone-700 leading-relaxed">
                    <div><strong>Ad Soyad:</strong> {selectedOrder.customer.fullName}</div>
                    <div><strong>Telefon:</strong> <a href={`tel:${selectedOrder.customer.phone}`} className="text-blue-600 underline">{selectedOrder.customer.phone}</a></div>
                    <div><strong>E-Posta:</strong> {selectedOrder.customer.email}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-stone-900 text-xs mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-700" />
                    Teslimat Adresi
                  </h4>
                  <div className="space-y-1 text-stone-700 leading-relaxed">
                    <div><strong>İl / İlçe:</strong> {selectedOrder.customer.city} / {selectedOrder.customer.district}</div>
                    <div><strong>Açık Adres:</strong> {selectedOrder.customer.address}</div>
                    {selectedOrder.customer.notes && (
                      <div className="text-amber-900 bg-amber-50 p-1.5 rounded mt-1">
                        <strong>Müşteri Notu:</strong> {selectedOrder.customer.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items & Customer Photo */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 text-xs">Sipariş Edilen Ürünler & Baskı Fotoğrafı:</h4>
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-4 bg-white border border-stone-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                        <img src={item.product?.image} alt={item.product?.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-bold text-stone-900">{item.product?.title}</h5>
                        <p className="text-stone-500">{item.selectedSize?.dimensions} • {item.quantity} Adet</p>
                        {item.includeGlue && (
                          <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">
                            + Selsil Ultra Tack 50ml (+299 ₺)
                          </span>
                        )}
                        {item.customization?.fullName && (
                          <div className="text-[11px] text-stone-700 mt-1">
                            <strong>İsim:</strong> {item.customization.fullName} {item.customization.dates && `(${item.customization.dates})`}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Customer Photo Download Action */}
                    <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0">
                      <span className="font-extrabold text-stone-900 text-sm">{item.unitPrice * item.quantity} ₺</span>
                      
                      {signedPhotoUrl ? (
                        <a
                          href={signedPhotoUrl}
                          target="_blank"
                          rel="noreferrer"
                          download="baski_fotografi.jpg"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Baskı Fotoğrafını İndir</span>
                        </a>
                      ) : (
                        <span className="text-[11px] text-stone-400 italic">Fotoğraf yüklenmedi</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Status & Shipping Management Form */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
                <h4 className="font-bold text-stone-900 text-xs">Sipariş Durumu ve Kargo Yönetimi</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Sipariş Durumu:
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as OrderStatus)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Ödeme Bekliyor">Ödeme Bekliyor</option>
                      <option value="Ödeme Alındı">Ödeme Alındı</option>
                      <option value="Baskı Sırasında">Baskı Sırasında</option>
                      <option value="Kalite Kontrol">Kalite Kontrol</option>
                      <option value="Kargolandı">Kargolandı</option>
                      <option value="Teslim Edildi">Teslim Edildi</option>
                      <option value="İptal Edildi">İptal Edildi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Kargo Firması:
                    </label>
                    <select
                      value={editCarrier}
                      onChange={(e) => setEditCarrier(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Yurtiçi Kargo">Yurtiçi Kargo</option>
                      <option value="Aras Kargo">Aras Kargo</option>
                      <option value="MNG Kargo">MNG Kargo</option>
                      <option value="PTT Kargo">PTT Kargo</option>
                      <option value="Sürat Kargo">Sürat Kargo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Kargo Takip Kodu:
                    </label>
                    <input
                      type="text"
                      value={editTracking}
                      onChange={(e) => setEditTracking(e.target.value)}
                      placeholder="Örn: 1234567890"
                      className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleSaveOrderChanges}
                    disabled={isUpdatingOrder}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-colors shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    {isUpdatingOrder ? 'Kaydediliyor...' : '✓ Değişiklikleri Kaydet'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
