import { Product, ProductSize } from '../types';

export const RECTANGULAR_SIZES: ProductSize[] = [
  { id: 'size-10x15', label: 'Küçük Boy', dimensions: '10 x 15 cm', price: 1600 },
  { id: 'size-13x18', label: 'Orta Boy', dimensions: '13 x 18 cm', price: 1900 },
  { id: 'size-15x21', label: 'Standart / Popüler', dimensions: '15 x 21 cm', price: 2200, popular: true },
  { id: 'size-20x30', label: 'Büyük Boy', dimensions: '20 x 30 cm', price: 3200 },
];

export const SQUARE_SIZES: ProductSize[] = [
  { id: 'size-10x10', label: 'Küçük Boy', dimensions: '10 x 10 cm', price: 1600 },
  { id: 'size-13x13', label: 'Orta Boy', dimensions: '13 x 13 cm', price: 1900 },
  { id: 'size-15x15', label: 'Standart / Popüler', dimensions: '15 x 15 cm', price: 2200, popular: true },
  { id: 'size-20x20', label: 'Büyük Boy', dimensions: '20 x 20 cm', price: 3200 },
];

export const HEART_SIZES: ProductSize[] = [
  { id: 'size-10x10', label: 'Küçük Boy', dimensions: '10 x 10 cm', price: 1600 },
  { id: 'size-13x13', label: 'Orta Boy', dimensions: '13 x 13 cm', price: 1900 },
  { id: 'size-15x15', label: 'Standart / Popüler', dimensions: '15 x 15 cm', price: 2200, popular: true },
  { id: 'size-20x20', label: 'Büyük Boy', dimensions: '20 x 20 cm', price: 3200 },
];

export const ROUND_SIZES: ProductSize[] = [
  { id: 'size-10x10', label: 'Küçük Boy', dimensions: '10 x 10 cm', price: 1600 },
  { id: 'size-13x13', label: 'Orta Boy', dimensions: '13 x 13 cm', price: 1900 },
  { id: 'size-15x15', label: 'Standart / Popüler', dimensions: '15 x 15 cm', price: 2200, popular: true },
  { id: 'size-20x20', label: 'Büyük Boy', dimensions: '20 x 20 cm', price: 3200 },
];

export const getSizesForShape = (shape: 'dikdortgen' | 'kare' | 'kalp' | 'yuvarlak'): ProductSize[] => {
  if (shape === 'dikdortgen') {
    return RECTANGULAR_SIZES;
  }
  return SQUARE_SIZES; // 10x10, 13x13, 15x15, 20x20
};

export const SELSIL_GLUE_PRICE = 299;
export const SELSIL_GLUE_IMAGE = '/images/selsil_ultra_tack.jpg';

export const PET_SHAPES: { id: 'dikdortgen' | 'kare' | 'kalp' | 'yuvarlak'; label: string; dimensionsSummary: string; desc: string }[] = [
  { id: 'dikdortgen', label: 'Dikdörtgen Model', dimensionsSummary: '10x15 - 20x30 cm', desc: 'Klasik dikey dikdörtgen form' },
  { id: 'kare', label: 'Kare Model', dimensionsSummary: '10x10 - 20x20 cm', desc: '1:1 Eşit kenarlı simetrik kare form' },
  { id: 'kalp', label: 'Kalp Model', dimensionsSummary: '10x10 - 20x20 cm', desc: 'Özel CNC lazer kesimli kalp formu' },
  { id: 'yuvarlak', label: 'Yuvarlak Model', dimensionsSummary: '10x10 - 20x20 cm', desc: 'Kusursuz dairesel madalyon form' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'dikdortgen-model',
    modelType: 'dikdortgen',
    title: 'Dikdörtgen Model Mezar Plakası',
    subtitle: '60x60 Mezar Taşı Üst 60x30 Alanına Uygun (Sadece Fotoğraf Baskılı)',
    category: 'insan',
    tag: 'En Çok Tercih Edilen',
    image: '/images/dikdortgen_60x60_model.jpg',
    basePrice: 1600,
    sizes: RECTANGULAR_SIZES,
    description: '60x60 cm mezar baş taşının üst 60x30 cm boş alanına yapıştırılır. İthal beyaz paslanmaz metal plaka üzerine sadece yüksek çözünürlüklü fotoğraf baskısı uygulanır (full-bleed, vidasız düz levha). 10 yıl dış mekan solmama garantilidir. Güçlü montaj için Selsil Ultra Tack yapıştırıcı opsiyonel olarak sepete eklenebilir (+299 ₺).',
    shapeDetails: 'Düzgün pahlanmış kenarlar, hafif yuvarlatılmış köşeler. 60x30 cm alana dikey yerleşim için ideal orantı.',
    features: [
      'Ölçüler: 10x15 (1.600 ₺), 13x18 (1.900 ₺), 15x21 (2.200 ₺), 20x30 (3.200 ₺)',
      '60x60 Mezar Taşı Üst 60x30 cm Alanına Birebir Uyumlu',
      'Sadece Fotoğraf Baskısı (Fotoğraf Metali Komple Kaplar)',
      'Düz Vidasız Metal Levha (Taşı Delmeye Gerek Yoktur)',
      '10 Yıl Güneş & Yağmur Solmama Garantisi',
    ],
    dimensionsInfo: 'Marmara mermeri baş taşının üst 60x30 cm boş alanı için uygundur.',
    defaultTextPreset: {
      title: '',
      dates: '',
      quote: '',
    },
  },
  {
    id: 'kare-model',
    modelType: 'kare',
    title: 'Kare Model Mezar Plakası',
    subtitle: '60x60 Mezar Taşı Üst 60x30 Alanına Uygun Kare Fotoğraf Plakası',
    category: 'insan',
    tag: 'Zarif & Sade',
    image: '/images/kare_60x60_model.jpg',
    basePrice: 1600,
    sizes: SQUARE_SIZES,
    description: '60x60 cm mezar taşının üst 60x30 cm boş alanına simetrik ve dengeli biçimde yapışır. Fotoğraf kare metal levhanın tüm yüzeyini komple kaplar. Vida deliği bulunmaz. İthal beyaz metal üzerine 10 yıl garantili UV baskı.',
    shapeDetails: 'Simetrik 1:1 kare form, vidasız pürüzsüz düz metal.',
    features: [
      'Ölçüler: 10x10 (1.600 ₺), 13x13 (1.900 ₺), 15x15 (2.200 ₺), 20x20 (3.200 ₺)',
      '60x60 Mezar Taşının Üst 60x30 cm Alanı İçin Tasarlandı',
      'Sadece Yüksek Çözünürlüklü Fotoğraf Baskısı (Full-Bleed)',
      'Vidasız ve Deliksiz Düz Metal (Montaj Yapıştırıcısı ile Uygulanır)',
      '10 Yıl Solmama & Çatlamama Garantisi',
    ],
    dimensionsInfo: 'Marmara mermeri baş taşının üst 60x30 cm boş alanına tam oturur.',
    defaultTextPreset: {
      title: '',
      dates: '',
      quote: '',
    },
  },
  {
    id: 'kalp-model',
    modelType: 'kalp',
    title: 'Kalp Model Mezar Plakası',
    subtitle: '60x60 Mezar Taşı Üst 60x30 Alanına Uygun Kalp Kesim Fotoğraf Plakası',
    category: 'insan',
    tag: 'Duygusal Tasarım',
    image: '/images/kalp_60x60_model.jpg',
    basePrice: 1600,
    sizes: HEART_SIZES,
    description: 'Özel lazer kesimli kalp şeklindeki beyaz metal plaka üzerine sadece merhumun fotoğrafı kenardan kenara basılır. 60x60 cm mezar taşının üst 60x30 cm alanına vidasız yapıştırılır.',
    shapeDetails: 'Hassas CNC lazer kesimli pürüzsüz kalp formu, vidasız saf beyaz metal.',
    features: [
      'Ölçüler: 10x10 (1.600 ₺), 13x13 (1.900 ₺), 15x15 (2.200 ₺), 20x20 (3.200 ₺)',
      '60x60 Mezar Taşı Üst 60x30 cm Alanına Uygun Kalp Formu',
      'Sadece Fotoğraf Baskısı (Mezar Taşı Resmi)',
      'Düz Yapışkanlı Yüzey (Vida Deliği Yoktur)',
      '10 Sene Güneş ve Yağmur Dayanım Garantisi',
    ],
    dimensionsInfo: 'Marmara mermeri mezar taşının üst 60x30 cm boş alanı için duygusal anma plakası.',
    defaultTextPreset: {
      title: '',
      dates: '',
      quote: '',
    },
  },
  {
    id: 'yuvarlak-model',
    modelType: 'yuvarlak',
    title: 'Yuvarlak / Oval Model Mezar Plakası',
    subtitle: '60x60 Mezar Taşı Üst 60x30 Alanına Uygun Madalyon Fotoğraf Plakası',
    category: 'insan',
    tag: 'Klasik Asalet',
    image: '/images/yuvarlak_60x60_model.jpg',
    basePrice: 1600,
    sizes: ROUND_SIZES,
    description: 'Geleneksel porselen madalyon mezar fotoğrafı formunda, kırılmaz ithal metal plaka. 60x60 cm mezar taşının üst 60x30 cm alanına vidalamadan yapıştırılır. Fotoğraf dairesel metali komple kaplar.',
    shapeDetails: 'Kusursuz dairesel form, vidasız düz yapışkanlı metal levha.',
    features: [
      'Ölçüler: 10x10 (1.600 ₺), 13x13 (1.900 ₺), 15x15 (2.200 ₺), 20x20 (3.200 ₺)',
      '60x60 Mezar Taşı Üst 60x30 cm Boş Alanına Tam Uyumlu',
      'Sadece Fotoğraf Baskısı (Madalyon Mezar Resmi)',
      'Vida Deliği Yoktur (Montaj Yapıştırıcısı ile Monte Edilir)',
      'Kırılmaz, Porselen Gibi Çatlamaz İthal Metal Levha',
    ],
    dimensionsInfo: 'Klasik dairesel madalyon tasarımı sevenler için en zarif seçim.',
    defaultTextPreset: {
      title: '',
      dates: '',
      quote: '',
    },
  },
  {
    id: 'kedi-model',
    modelType: 'kedi',
    title: 'Can Dostlarımız İçin (Kedi) Anma Plakası',
    subtitle: 'Dikdörtgen, Kare, Kalp veya Yuvarlak Şekil Seçenekli UV Metal Plaka',
    category: 'hayvan',
    tag: 'Can Dostlarımıza Özel',
    image: '/images/kedi_anma_model.jpg',
    basePrice: 1600,
    sizes: RECTANGULAR_SIZES,
    description: 'Aramızdan ayrılan sevgili kedinizin anısına; Dikdörtgen (10x15 - 20x30), Kare, Kalp veya Yuvarlak (10x10 - 20x20) form seçenekleri ile hazırlanır. İsteğinize göre sadece fotoğraf veya isim ve sevgi sözü ile hazırlanır. Can dostlarımıza uygun sevgi dolu tasarımdır (Ruhuna Fatiha ve dini yazılar yer almaz). Vidasız, deliksiz pürüzsüz düz levhadır.',
    shapeDetails: 'Dikdörtgen, Kare, Kalp ve Yuvarlak form seçenekleri, pürüzsüz lazer kesim beyaz metal (vidasız).',
    features: [
      '4 Model Şekli: Dikdörtgen, Kare, Kalp, Yuvarlak',
      'Dikdörtgen: 10x15 (1.600 ₺), 13x18 (1.900 ₺), 15x21 (2.200 ₺), 20x30 (3.200 ₺)',
      'Kare / Kalp / Yuvarlak: 10x10 (1.600 ₺), 13x13 (1.900 ₺), 15x15 (2.200 ₺), 20x20 (3.200 ₺)',
      'İsteğe Göre Sadece Fotoğraf veya Fotoğraf + Dostumuzun İsmi & Anma Sözü',
      'Düz Metal Levha (Vida Deliği Yoktur, Yapıştırıcı ile Kolay Montaj)',
      '10 Yıl Dış Mekan Solmama Garantisi (Yağmur ve Neme Dayanıklı)',
    ],
    dimensionsInfo: 'Bahçedeki anma taşları, çiçeklik veya can dost mezarlıkları için uygundur.',
    defaultTextPreset: {
      title: 'PAMUK',
      dates: '2014 - 2024',
      quote: 'KALBİMİZDE YAŞIYORSUN',
    },
  },
  {
    id: 'kopek-model',
    modelType: 'kopek',
    title: 'Can Dostlarımız İçin (Köpek) Anma Plakası',
    subtitle: 'Dikdörtgen, Kare, Kalp veya Yuvarlak Şekil Seçenekli UV Metal Plaka',
    category: 'hayvan',
    tag: 'Sadık Dostlarımıza Özel',
    image: '/images/kopek_anma_model.jpg',
    basePrice: 1600,
    sizes: RECTANGULAR_SIZES,
    description: 'Sadık can dostunuzun hatırasını yaşatmak için; Dikdörtgen (10x15 - 20x30), Kare, Kalp veya Yuvarlak (10x10 - 20x20) form seçenekleri ile üretilir. İster sadece yüksek çözünürlüklü fotoğrafı, ister ismi ve sevgi sözü ile hazırlanır. Ruhuna Fatiha gibi dini yazılar yer almaz, sadık dostumuza özeldir. Vidasız, deliksiz pürüzsüz düz levhadır.',
    shapeDetails: 'Dikdörtgen, Kare, Kalp ve Yuvarlak form seçenekleri, vidasız düz beyaz metal.',
    features: [
      '4 Model Şekli: Dikdörtgen, Kare, Kalp, Yuvarlak',
      'Dikdörtgen: 10x15 (1.600 ₺), 13x18 (1.900 ₺), 15x21 (2.200 ₺), 20x30 (3.200 ₺)',
      'Kare / Kalp / Yuvarlak: 10x10 (1.600 ₺), 13x13 (1.900 ₺), 15x15 (2.200 ₺), 20x20 (3.200 ₺)',
      'İsteğe Göre Sadece Fotoğraf veya Fotoğraf + Dostumuzun İsmi & Anma Sözü',
      'Düz Metal Levha (Vida Deliği Yoktur, Yapıştırıcı ile Kolay Montaj)',
      '10 Yıl Solmama ve Dış Mekan Dayanıklılık Garantisi',
    ],
    dimensionsInfo: 'Sadık dostumuzun bahçedeki anıt taşına veya anma köşesine kolayca yapışır.',
    defaultTextPreset: {
      title: 'ÇAKIL',
      dates: '2012 - 2023',
      quote: 'HER ZAMAN KALBİMİZDESİN',
    },
  },
];

export const BANK_ACCOUNTS = [
  {
    bankName: 'Ziraat Bankası',
    accountHolder: 'EBEDİ HATIRA METAL BASKI SAN. TİC. LTD. ŞTİ.',
    iban: 'TR42 0001 0002 3456 7890 1234 56',
    branch: 'Kadıköy Şubesi (Kod: 1042)',
    badge: 'En Çok Tercih Edilen Banka',
  },
  {
    bankName: 'Vakıfbank',
    accountHolder: 'EBEDİ HATIRA METAL BASKI SAN. TİC. LTD. ŞTİ.',
    iban: 'TR15 0001 5001 5800 7300 9876 54',
    branch: 'Kızılay Şubesi (Kod: 0158)',
    badge: 'Hızlı EFT / FAST',
  },
  {
    bankName: 'Garanti BBVA',
    accountHolder: 'EBEDİ HATIRA METAL BASKI SAN. TİC. LTD. ŞTİ.',
    iban: 'TR62 0006 2000 0001 2987 6543 21',
    branch: 'Alsancak Şubesi (Kod: 0062)',
    badge: 'Hızlı EFT / FAST',
  },
];

export const SAMPLE_QUOTES = {
  insan: [],
  hayvan: [
    'KALBİMİZDE YAŞIYORSUN',
    'HER ZAMAN KALBİMİZDESİN',
    'SENİ ASLA UNUTMAYACAĞIZ',
    'CAN DOSTUMUZ, GÜZEL MELEĞİMİZ',
    'GÖKKUŞAĞI KÖPRÜSÜNDE BULUŞMAK ÜZERE',
    'EVİMİZİN NEŞESİYDİN, HUZURLA UYU',
    'BİZE KATTIĞIN TÜM SEVGİ VE NEŞE İÇİN TEŞEKKÜRLER',
    'ASLA UNUTULMAYACAKSIN',
  ],
};
