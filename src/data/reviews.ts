export interface Review {
  id: string;
  name: string;
  city: string;
  productTitle: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Mehmet Yılmaz',
    city: 'İstanbul (Zincirlikuyu Mezarlığı)',
    productTitle: 'Dikdörtgen Model (15x21 cm)',
    rating: 5,
    date: '3 hafta önce',
    comment: 'Babamın mezar taşı için sipariş verdik. Gelen baskı kalitesi porselen kadar pürüzsüz ve canlı. Yanında gönderdiğiniz yapıştırıcı ile taşın üzerine sımsıkı yapıştı, 1 yıldır kar kış gördü en ufak solma veya oynama yok. Ellerinize sağlık.',
    verified: true,
  },
  {
    id: 'rev-2',
    name: 'Zeynep Kaya',
    city: 'Ankara (Karşıyaka Mezarlığı)',
    productTitle: 'Kalp Model (15x21 cm)',
    rating: 5,
    date: '1 ay önce',
    comment: 'Annemin gençlik fotoğrafını yüklemiştik, siyah beyaz baskısı o kadar net çıkmış ki gözlerimiz doldu. Mermerciye deldirme derdi olmadan kutudan çıkan yapıştırıcıyla 1 dakikada yapıştırdık. Çok saygılı ve özenli bir paketleme.',
    verified: true,
  },
  {
    id: 'rev-3',
    name: 'Av. Serdar Öztürk',
    city: 'İzmir (Doğançay Mezarlığı)',
    productTitle: 'Yuvarlak Model (13x18 cm)',
    rating: 5,
    date: '2 ay önce',
    comment: 'Dedemizin mezarı için madalyon şeklinde yuvarlak modeli seçtik. Metal plakanın kalitesi çok yüksek, güneşten hiç etkilenmiyor. 10 yıl garanti vermeleri de güven verdi. Teşekkürler.',
    verified: true,
  },
  {
    id: 'rev-4',
    name: 'Buse Demir',
    city: 'Bursa',
    productTitle: 'Can Dostumuz İçin (Kedi) Anma Plakası',
    rating: 5,
    date: '3 hafta önce',
    comment: '14 yıllık kedimiz Pamuk vefat ettiğinde bahçemizdeki anı taşı için yaptırdık. Pati detayları ve fotoğrafı çok güzel oldu. Hem hızlı kargo hem nazik müşteri ilgisi için minnettarım.',
    verified: true,
  },
  {
    id: 'rev-5',
    name: 'Emre Çakır',
    city: 'Antalya (Uncalı Kent Mezarlığı)',
    productTitle: 'Kare Model (20x20 cm)',
    rating: 5,
    date: '2 ay önce',
    comment: 'Antalya sıcağında ve yakıcı güneşinde solmasından endişeliydim, UV baskı gerçekten çok dayanıklı. Ürün geldiğinde mermere uyguladık, kaya gibi tuttu. Kesinlikle tavsiye ederim.',
    verified: true,
  },
];
