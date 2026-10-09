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
    answer: 'EVET. Her ürün siparişinizin yanında, dış mekan taş ve mermer yapıştırmaya özel güçlü hibrit polimer yapıştırıcı ve uygulama bezi ÜCRETSİZ olarak gönderilmektedir. Matkapla delmeye veya vidaya gerek yoktur. Plakanın arkasına dalga dalga yapıştırıcı sürüp mermere 30 saniye bastırmanız yeterlidir.',
  },
  {
    category: 'Fotoğraf & Formatlar',
    question: 'Hangi fotoğraf formatlarını yükleyebilirim? Eski vesikalık fotoğraflar uygun mu?',
    answer: 'Sistemimiz JPEG, JPG, PNG, WEBP, TIFF, HEIC (iPhone) ve PDF formatlarının tamamını desteklemektedir. Eski veya yıpranmış vesikalık fotoğraflarınızı telefonunuzla net bir şekilde çekip yükleyebilirsiniz. Grafik ekibimiz baskı öncesinde fotoğraftaki çizik ve soluklukları ücretsiz olarak rötuşlar ve optimize eder.',
  },
  {
    category: 'Kişiselleştirme',
    question: 'Yazı alanı zorunlu mu? İstediğim duayı veya sözü yazdırabilir miyim?',
    answer: 'Yazı alanı tamamen opsiyoneldir. Sadece fotoğraf bastırabileceğiniz gibi; Merhum/Merhume adı, doğum-vefat tarihi, "Ruhuna Fatiha", ayet, şiir veya özel anma sözleri de ekletebilirsiniz. Tasarım simülatörümüz ile mezar taşında nasıl duracağını anında görebilirsiniz.',
  },
  {
    category: 'Ödeme & Teslimat',
    question: 'Ödeme seçenekleri ve kargo süreci nasıldır?',
    answer: 'Ödemelerinizi tüm Kredi Kartları (3D Secure güvenli altyapı ve taksit seçenekleri) veya Havale/EFT ile (%5 indirim avantajıyla) yapabilirsiniz. Özel korumalı darbe emici kutularda tüm Türkiye\'ye 2-3 iş günü içerisinde sigortalı kargo ile teslim edilir.',
  },
];
