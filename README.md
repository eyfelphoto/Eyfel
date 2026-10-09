# Ebedi Hatıra - UV Baskı Mezar Plakaları E-Ticaret ve Tasarım Simülatörü

Türkiye'deki vefat eden sevdiklerimiz ve can dostlarımız (kedi & köpek) için **Beyaz Metal Plaka Üzerine UV Baskılı Mezar Anma Plakası** e-ticaret platformu ve canlı tasarım simülatörü.

---

## 🌟 Projenin Temel Özellikleri

1. **6 Farklı Ürün Modeli:**
   - Dikdörtgen Model (Klasik Mezar Taşı Formu)
   - Kare Model (Modern & Simetrik)
   - Kalp Model (Özel Lazer Kesim)
   - Yuvarlak / Oval Model (Madalyon Formu)
   - Can Dostlarımız İçin Kedi Anma Plakası
   - Can Dostlarımız İçin Köpek Anma Plakası

2. **4 Standart Ebat ve Fiyatlandırma:**
   - **10 x 15 cm:** 1.600 TL
   - **13 x 18 cm:** 1.900 TL
   - **15 x 21 cm:** 2.200 TL *(En çok tercih edilen)*
   - **20 x 30 cm:** 3.200 TL

3. **Özel Baskı Kuralları:**
   - **İnsan Mezarları:** Sadece yüksek çözünürlüklü fotoğraf baskısı (Mezar mermerine taş ustası tarafından isim ve dua kazındığı için plaka saf porselen/metal mezar resmi olarak yapıştırılır).
   - **Can Dostlarımız (Kedi/Köpek):** İsteğe bağlı olarak **Sadece Fotoğraf** veya **Fotoğraf + Yazı** (İsim, tarih, anma sözü).
   - **Baskı Renk Seçenekleri:** 1. Canlı Renkli (Öncelikli), 2. Siyah-Beyaz.
   - **Full-Bleed:** Fotoğraf metal plakanın tüm yüzeyini kenardan kenara %100 kaplar.
   - **Vidasız & Düz Metal:** Kesinlikle vida deliği yoktur; arkasına sürülen özel hibrit yapıştırıcı ile mezar taşına yapıştırılır.

4. **60x60 cm Mezar Taşı Canlı Simülatörü:**
   - Mezar taşının üst kısmındaki **30x60 cm'lik boş mermer alan** modellenmiştir.
   - Seçilen her ebat (10x15, 13x18, 15x21, 20x30 cm) taş üzerinde birebir gerçek ölçeğinde simüle edilir.

5. **Geniş Dosya Desteği:**
   - JPEG, JPG, PNG, WEBP, TIFF, HEIC (iPhone) ve PDF dosyaları yüklenebilir.

6. **Ödeme Altyapısı:**
   - Kredi Kartı (3D Secure simülasyonu & taksit seçenekleri)
   - Havale / EFT (Ziraat, Vakıfbank, Garanti IBAN kopyalama ve %5 indirim)

---

## 🚀 1. GitHub'a Yükleme Adımları

Projeyi bilgisayarınızdan GitHub'a yüklemek için terminalde şu komutları çalıştırabilirsiniz:

```bash
# 1. Git deposunu başlatın (eğer henüz başlatılmadıysa)
git init

# 2. Tüm dosyaları ekleyin
git add .

# 3. İlk commit'i oluşturun
git commit -m "feat: Ebedi Hatira UV Baski Mezar Plakasi E-Ticaret Projesi"

# 4. GitHub'da oluşturduğunuz deponun adresini ekleyin (URL'i kendi deponuzla değiştirin)
git remote add origin https://github.com/KULLANICI_ADINIZ/ebedi-hatira-mezar-plakasi.git

# 5. Ana dala gönderin
git branch -M main
git push -u origin main
```

---

## 🛒 2. Shopify Entegrasyon Seçenekleri

Bu React uygulamasını Shopify mağazanıza entegre etmenin en pratik 3 yolu:

### Yöntem A: Subdomain / Alt Alan Adı Olarak Bağlamak (En Çok Tercih Edilen & Hızlı Yöntem)
Bu proje modern bir Single Page Application (SPA) olduğu için;
1. GitHub deponuzu **Vercel** (`vercel.com`) veya **Netlify** (`netlify.com`) üzerine 1 tıkla ücretsiz bağlayın.
2. Özel alan adınızı tanımlayın: Örn. `tasarla.siteniz.com` veya `siparis.siteniz.com`.
3. Shopify panelinizde **Online Mağaza > Gezinme (Navigation)** bölümünden ana menünüze **"Mezar Plakası Tasarla"** bağlantısı ekleyerek bu adrese yönlendirin.

### Yöntem B: Shopify Sayfasına İframe / Özel Sayfa Olarak Gömmek
1. Vercel veya Netlify'da yayınlanan projenizin URL'ini alın (örn: `https://ebedi-hatira.vercel.app`).
2. Shopify panelinizde **Online Store > Pages (Sayfalar) > Add Page (Sayfa Ekle)** deyin.
3. Başlık olarak *"Mezar Plakanızı Tasarlayın"* yazın.
4. İçerik kutusundaki **HTML Göster (<>)** butonuna tıklayıp aşağıdaki kodu yapıştırın:

```html
<div style="width: 100%; height: 950px; overflow: hidden; border-radius: 16px;">
  <iframe 
    src="https://ebedi-hatira.vercel.app" 
    style="width: 100%; height: 100%; border: none;"
    title="Mezar Plakası Canlı Tasarım"
    allow="clipboard-write">
  </iframe>
</div>
```

### Yöntem C: Derlenmiş Kodları (dist/) Statik Tema Varlığı Olarak Yükleme
```bash
# 1. Projeyi derleyin
npm run build

# 2. dist/ klasöründeki index.html, index.js ve index.css dosyalarını
# Shopify temanızın Assets (Varlıklar) veya Custom Liquid bölümüne aktarabilirsiniz.
```

---

## 💻 Yerel Geliştirme (Localhost)

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
# Tarayıcıda http://localhost:3000 adresini açın

# Üretim derlemesi alın
npm run build
```

---

## 📁 Proje Klasör Yapısı

```
/
├── public/                 # Statik genel varlıklar
├── src/
│   ├── assets/images/      # Gerçekçi 60x60 mezar taşı ve model fotoğrafları
│   ├── components/         # Modüler React bileşenleri
│   │   ├── LiveSimulator.tsx        # 60x60 mermer mezar taşı ve tam kaplama simülatörü
│   │   ├── ProductCustomizerModal.tsx # Canlı tasarım & fotoğraf yükleme modali
│   │   ├── ProductCard.tsx          # 4 boyut ve fiyatlı ürün kartları
│   │   ├── CartDrawer.tsx           # Sepet çekmecesi
│   │   ├── CheckoutModal.tsx        # Kredi Kartı (3D Secure) & Havale/EFT
│   │   ├── OrderSuccessModal.tsx    # Sipariş teyit fişi & takip kodu
│   │   ├── OrderTrackingModal.tsx   # Canlı sipariş takip sorgulama
│   │   ├── InstallationGuide.tsx    # 3 adımda yapıştırıcı montaj rehberi
│   │   ├── MarbleNoticeBanner.tsx   # "Mermer satılmamaktadır" uyarı bandı
│   │   ├── CustomerReviews.tsx      # Müşteri geri bildirimleri
│   │   └── FaqSection.tsx           # Sıkça sorulan sorular
│   ├── data/
│   │   ├── products.ts     # 6 model, 4 boyut ve 1.600 - 3.200 TL fiyatlandırma
│   │   ├── reviews.ts      # Doğrulanmış müşteri yorumları
│   │   └── faq.ts          # SSS verileri
│   ├── types.ts            # TypeScript tip tanımları
│   ├── App.tsx             # Ana uygulama bileşeni
│   └── main.tsx            # Giriş noktası
├── package.json
└── vite.config.ts
```

© Ebedi Hatıra Metal Baskı San. Tic. Ltd. Şti.
