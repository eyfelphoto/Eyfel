export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQS: FAQItem[] = [
  {
    category: 'Ürün & Malzeme',
    question: 'Mezar taşı veya mermeri de satıyor musunuz?',
    answer: 'HAYIR. Firmamız mezar mermeri veya mezar taşı satışı yapmamaktadır. Biz ithal beyaz metal plaka üzerine yüksek çözünürlüklü UV baskı yapmaktayız. Ürünlerimiz, mevcut mezar taşlarına veya bahçe anıt taşlarına yapıştırılmak üzere tasarlanmıştır.',
  },
  {
    category: 'Dayanıklılık',
    question: '10 Yıl Solmama Garantisi neleri kapsar? Yağmurda veya güneşte solar mı?',
    answer: 'Ürünlerimiz doğrudan dış mekan koşullarına uygun endüstriyel UV (ultraviyole) kürleme teknolojisiyle üretilmektedir. Türkiye\'nin aşırı sıcak yaz güneşine, dondurucu kış soğuklarına, yağmur, kar ve neme karşı 10 yıl boyunca renk solmama, soyulmama ve çatlamama garantilidir.',
  },
  {
    category: 'Montaj & Yapıştırıcı',
    question: 'Mezar taşına nasıl yapıştırılır? Yanında yapıştırıcı gönderiyor musunuz?',
    answer: 'Metal plakalarımız vida deliği veya delme işlemi gerektirmez, pürüzsüz düz plakalardır. Mermer veya taş yüzeye montaj için sipariş esnasında güçlü ve ağır yük taşıma kapasiteli "Selsil Ultra Tack No Nail (50ml)" profesyonel montaj yapıştırıcısını opsiyonel olarak (+299 ₺) sepetinize ekleyebilirsiniz. Plakanın arkasına şeritler halinde yapıştırıcı sürüp mermere 30-40 saniye bastırmanız yeterlidir; güneş, don ve şiddetli yağmura karşı tam dayanıklıdır.',
  },
  {
    category: 'Fotoğraf & Formatlar',
    question: 'Hangi fotoğraf formatlarını yükleyebilirim? Eski vesikalık fotoğraflar uygun mu?',
    answer: 'Sistemimiz JPEG, JPG, PNG, WEBP, TIFF, HEIC (iPhone) ve PDF formatlarının tamamını desteklemektedir. Eski veya yıpranmış vesikalık fotoğraflarınızı telefonunuzla net bir şekilde çekip yükleyebilirsiniz. Grafik ekibimiz baskı öncesinde fotoğraftaki çizik ve soluklukları ücretsiz olarak rötuşlar ve optimize eder.',
  },
  {
    category: 'Baskı Seçenekleri',
    question: 'İnsan mezarları ile can dostlarımız (evcil hayvan) arasındaki baskı farkı nedir?',
    answer: 'İnsan mezarlarında sadece yüksek çözünürlüklü fotoğraf baskısı yapmaktayız; isim, tarih ve dualar mermer mezar taşına taş ustası tarafından kazındığından, plakanız taşın üst 60x30 cm boş alanına asil bir mezar fotoğrafı olarak yapıştırılır. Kedi ve köpek can dostlarımızda ise isteğe bağlı olarak sadece fotoğraf veya dostumuzun ismi ve sevgi sözü basılmaktadır (hayvan mezarlarında Ruhuna Fatiha veya insan mezar yazıları yer almaz).',
  },
  {
    category: 'Ödeme & Teslimat',
    question: 'Ödeme seçenekleri ve kargo süreci nasıldır?',
    answer: 'Ödemelerinizi tüm Kredi Kartları (3D Secure güvenli altyapı ve taksit seçenekleri) veya Havale/EFT ile (%5 indirim avantajıyla) yapabilirsiniz. Özel korumalı darbe emici kutularda tüm Türkiye\'ye 2-3 iş günü içerisinde sigortalı kargo ile teslim edilir.',
  },
];
