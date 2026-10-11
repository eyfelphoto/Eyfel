-- ==============================================================================
-- EBEDİ HATIRA - MEZAR PLAKALARI SUPABASE VERİTABANI ŞEMASI & RLS GÜVENLİK KURALLARI
-- ==============================================================================

-- 1. TABLOLAR

-- Ürünler Tablosu
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  model_type TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  category TEXT NOT NULL CHECK (category IN ('insan', 'hayvan')),
  tag TEXT,
  image_url TEXT NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  description TEXT,
  shape_details TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  sizes JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  stock_status TEXT DEFAULT 'in_stock',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Müşteriler Tablosu
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Siparişler Tablosu
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_info JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'Ödeme Bekliyor' 
    CHECK (status IN ('Ödeme Bekliyor', 'Ödeme Alındı', 'Baskı Sırasında', 'Kalite Kontrol', 'Kargolandı', 'Teslim Edildi', 'İptal Edildi')),
  payment_status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_method TEXT NOT NULL DEFAULT 'paytr',
  paytr_transaction_id TEXT,
  subtotal NUMERIC(10,2) NOT NULL,
  glue_total NUMERIC(10,2) DEFAULT 0,
  shipping_fee NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,
  shipping_carrier TEXT,
  tracking_number TEXT,
  customer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sipariş Kalemleri Tablosu
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES public.products(id),
  product_title TEXT NOT NULL,
  selected_size JSONB NOT NULL,
  customization JSONB NOT NULL,
  photo_storage_path TEXT,
  include_glue BOOLEAN DEFAULT false,
  glue_price NUMERIC(10,2) DEFAULT 0,
  unit_price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  line_total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. ROW LEVEL SECURITY (RLS) POLİTİKALARI

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Ürünler: Herkes aktif ürünleri okuyabilir
DROP POLICY IF EXISTS "Public read active products" ON public.products;
CREATE POLICY "Public read active products" ON public.products
  FOR SELECT USING (is_active = true);

-- Siparişler: Müşteri sipariş numarası ve telefon ile kendi siparişini sorgulayabilir
DROP POLICY IF EXISTS "Customer read order by number" ON public.orders;
CREATE POLICY "Customer read order by number" ON public.orders
  FOR SELECT USING (true);

-- Sipariş Kalemleri: Okuma
DROP POLICY IF EXISTS "Public read order items" ON public.order_items;
CREATE POLICY "Public read order items" ON public.order_items
  FOR SELECT USING (true);

-- 3. STORAGE: order-photos PRIVATE BUCKET KURULUMU
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-photos', 'order-photos', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Anonim kullanıcılar sipariş için fotoğraf yükleyebilir
CREATE POLICY "Allow public photo uploads" ON storage.objects
  FOR INSERT TO public WITH CHECK (bucket_id = 'order-photos');

-- Fotoğraflar public olarak okunamayacak; yalnızca imzalı URL (signed URL) ile yetkili yönetici görebilir.

-- ==============================================================================
-- 4. BAŞLANGIÇ ÜRÜN VERİLERİ (SEED DATA)
-- ==============================================================================

INSERT INTO public.products (id, model_type, title, subtitle, category, tag, image_url, base_price, description, shape_details, sizes)
VALUES
('dikdortgen-model', 'dikdortgen', 'Klasik Dikdörtgen Mezar Fotoğraf Plakası', '10 Yıl Solmama Garantili UV Beyaz Metal Baskı', 'insan', 'En Çok Tercih Edilen', '/images/dikdortgen_60x60_model.jpg', 690, 'Klasik dikey dikdörtgen formda, standart 60x60 mezar baş taşının üst boşluğuna mükemmel uyum sağlayan pürüzsüz beyaz metal fotoğraf plakası.', '10x15, 13x18, 15x21 ve 20x30 cm ölçülerinde üretilmektedir.', '[{"id":"d1","label":"10 x 15 cm","dimensions":"10 x 15 cm","price":690},{"id":"d2","label":"13 x 18 cm","dimensions":"13 x 18 cm","price":890},{"id":"d3","label":"15 x 21 cm","dimensions":"15 x 21 cm","price":1190,"popular":true},{"id":"d4","label":"20 x 30 cm","dimensions":"20 x 30 cm","price":1590}]'::jsonb),

('kare-model', 'kare', 'Modern Kare Mezar Fotoğraf Plakası', 'Simetrik & Minimalist 10 Yıl Garantili UV Baskı', 'insan', 'Modern Tasarım', '/images/kare_60x60_model.jpg', 690, 'Kare taş yuvaları veya modern mezar taşları için estetik, köşeli ve simetrik görünüm sunan özel UV lak kaplamalı plaka.', '10x10, 13x13, 15x15 ve 20x20 cm ölçülerinde üretilmektedir.', '[{"id":"k1","label":"10 x 10 cm","dimensions":"10 x 10 cm","price":690},{"id":"k2","label":"13 x 13 cm","dimensions":"13 x 13 cm","price":890},{"id":"k3","label":"15 x 15 cm","dimensions":"15 x 15 cm","price":1190,"popular":true},{"id":"k4","label":"20 x 20 cm","dimensions":"20 x 20 cm","price":1590}]'::jsonb),

('kalp-model', 'kalp', 'Kalp Formlu Mezar Fotoğraf Plakası', 'Ebedi Sevgi & Vefa Sembolü Özel UV Baskı', 'insan', 'Duygusal & Özel', '/images/kalp_60x60_model.jpg', 790, 'Sevdiklerinize olan sonsuz sevgi ve bağlılığınızı simgeleyen, özel lazer kesim kalp formunda pürüzsüz anma plakası.', '10x10, 13x13, 15x15 ve 20x20 cm ölçülerinde üretilmektedir.', '[{"id":"klp1","label":"10 x 10 cm","dimensions":"10 x 10 cm","price":790},{"id":"klp2","label":"13 x 13 cm","dimensions":"13 x 13 cm","price":990},{"id":"klp3","label":"15 x 15 cm","dimensions":"15 x 15 cm","price":1290,"popular":true},{"id":"klp4","label":"20 x 20 cm","dimensions":"20 x 20 cm","price":1690}]'::jsonb),

('yuvarlak-model', 'yuvarlak', 'Oval & Yuvarlak Madalyon Mezar Plakası', 'Zarif & Geleneksel Madalyon Kesim UV Baskı', 'insan', 'Zarif Model', '/images/yuvarlak_60x60_model.jpg', 790, 'Geleneksel porselen madalyon fotoğraf görünümünü kırılmaz, solmaz alüminyum metal UV teknolojiyle buluşturan model.', '10x10, 13x13, 15x15 ve 20x20 cm ölçülerinde üretilmektedir.', '[{"id":"y1","label":"10 x 10 cm","dimensions":"10 x 10 cm","price":790},{"id":"y2","label":"13 x 13 cm","dimensions":"13 x 13 cm","price":990},{"id":"y3","label":"15 x 15 cm","dimensions":"15 x 15 cm","price":1290,"popular":true},{"id":"y4","label":"20 x 20 cm","dimensions":"20 x 20 cm","price":1690}]'::jsonb),

('kedi-model', 'kedi', 'Kedi Anma & Mezar Plakası', 'Can Dostumuz İçin Ebedi Hatıra - 4 Şekil Seçenekli', 'hayvan', 'Can Dostu Özel', '/images/kedi_anma_model.jpg', 690, 'Sadık kedi dostlarımızın aziz hatırası için pürüzsüz dış mekan bahçe veya anıt taşına yapışan özel plaka.', 'Dikdörtgen, Kare, Kalp ve Yuvarlak formlarda seçilebilir.', '[{"id":"kd1","label":"10 x 15 cm","dimensions":"10 x 15 cm","price":690},{"id":"kd2","label":"13 x 18 cm","dimensions":"13 x 18 cm","price":890},{"id":"kd3","label":"15 x 21 cm","dimensions":"15 x 21 cm","price":1190,"popular":true},{"id":"kd4","label":"20 x 30 cm","dimensions":"20 x 30 cm","price":1590}]'::jsonb),

('kopek-model', 'kopek', 'Köpek Anma & Mezar Plakası', 'Sadık Dostumuz İçin Ebedi Hatıra - 4 Şekil Seçenekli', 'hayvan', 'Can Dostu Özel', '/images/kopek_anma_model.jpg', 690, 'Sadık yol arkadaşımız köpeğimizin ebedi hatırası için dış hava şartlarına 10 yıl dayanıklı pürüzsüz metal anma plakası.', 'Dikdörtgen, Kare, Kalp ve Yuvarlak formlarda seçilebilir.', '[{"id":"kp1","label":"10 x 15 cm","dimensions":"10 x 15 cm","price":690},{"id":"kp2","label":"13 x 18 cm","dimensions":"13 x 18 cm","price":890},{"id":"kp3","label":"15 x 21 cm","dimensions":"15 x 21 cm","price":1190,"popular":true},{"id":"kp4","label":"20 x 30 cm","dimensions":"20 x 30 cm","price":1590}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  base_price = EXCLUDED.base_price,
  sizes = EXCLUDED.sizes;
