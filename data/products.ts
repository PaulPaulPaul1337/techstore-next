export type Category =
  | 'smartphones'
  | 'laptops'
  | 'monitors'
  | 'headphones'
  | 'cameras'
  | 'consoles'
  | 'watches'
  | 'accessories';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  emoji: string;
  badge?: 'new' | 'hit' | 'sale';
  colors?: string[];
  specs: string[];
  description: string;
  inStock: boolean;
}

export const categoryLabels: Record<Category, string> = {
  smartphones: 'Смартфони',
  laptops: 'Ноутбуки',
  monitors: 'Монітори',
  headphones: 'Навушники',
  cameras: 'Камери',
  consoles: 'Консолі',
  watches: 'Смарт-годинники',
  accessories: 'Аксесуари',
};

export const categoryEmojis: Record<Category, string> = {
  smartphones: '📱',
  laptops: '💻',
  monitors: '🖥️',
  headphones: '🎧',
  cameras: '📷',
  consoles: '🎮',
  watches: '⌚',
  accessories: '🔌',
};

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro 256GB Titanium',
    brand: 'Apple',
    category: 'smartphones',
    price: 37999,
    rating: 5,
    reviewCount: 142,
    emoji: '📱',
    badge: 'new',
    colors: ['#8a8a8a', '#2d2926', '#d4c5a9', '#4e4e4e'],
    specs: ['Чіп A17 Pro', '48 МП камера', 'USB-C USB 3', '6.1" ProMotion'],
    description: 'Найпотужніший iPhone з чіпом A17 Pro, камерою 48 МП та USB-C з USB 3 швидкістю. Корпус із авіаційного титану.',
    inStock: true,
  },
  {
    id: '2',
    name: 'MacBook Air 13" M3 16GB / 512GB',
    brand: 'Apple',
    category: 'laptops',
    price: 54999,
    rating: 4,
    reviewCount: 89,
    emoji: '💻',
    badge: 'hit',
    colors: ['#c0c0c0', '#1d1d1d', '#d4a76a'],
    specs: ['Чіп Apple M3', '16 ГБ RAM', '512 ГБ SSD', '18 год батарея'],
    description: 'Найтонший та найлегший MacBook Air з потужним чіпом M3. До 18 годин автономної роботи.',
    inStock: true,
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5 Wireless',
    brand: 'Sony',
    category: 'headphones',
    price: 9999,
    oldPrice: 12499,
    rating: 5,
    reviewCount: 234,
    emoji: '🎧',
    badge: 'sale',
    colors: ['#111111', '#d4c8b8'],
    specs: ['Шумоподавлення', '30 год батарея', 'Hi-Res Audio', 'Multipoint'],
    description: 'Флагманські навушники з найкращим у класі шумоподавленням. 30 годин музики без підзарядки.',
    inStock: true,
  },
  {
    id: '4',
    name: 'Samsung Odyssey 27" 4K 144Hz',
    brand: 'Samsung',
    category: 'monitors',
    price: 17999,
    rating: 4,
    reviewCount: 56,
    emoji: '🖥️',
    badge: 'new',
    colors: ['#111111'],
    specs: ['27" IPS 4K', '144 Hz', 'HDR600', 'USB-C 90W'],
    description: 'Ігровий монітор 4K з частотою оновлення 144 Гц та підтримкою HDR600. Зарядка ноутбука через USB-C.',
    inStock: true,
  },
  {
    id: '5',
    name: 'Apple Watch Series 9 45mm GPS',
    brand: 'Apple',
    category: 'watches',
    price: 16499,
    rating: 5,
    reviewCount: 178,
    emoji: '⌚',
    badge: 'hit',
    colors: ['#c0c0c0', '#d4a76a', '#c0392b', '#111111'],
    specs: ['Чіп S9', 'Double Tap', 'ECG', '18 год батарея'],
    description: 'Розумний годинник з новим жестом Double Tap, ЕКГ та покращеним датчиком кисню в крові.',
    inStock: true,
  },
  {
    id: '6',
    name: 'Samsung Galaxy S24 Ultra 256GB',
    brand: 'Samsung',
    category: 'smartphones',
    price: 30499,
    oldPrice: 33899,
    rating: 4,
    reviewCount: 97,
    emoji: '📱',
    badge: 'sale',
    colors: ['#8a7a6a', '#111111', '#6a8a7a'],
    specs: ['Snapdragon 8 Gen 3', '200 МП камера', 'S Pen', '5000 мАг'],
    description: 'Флагман Samsung з вбудованим стилусом S Pen, камерою 200 МП та найпотужнішим процесором Snapdragon.',
    inStock: true,
  },
  {
    id: '7',
    name: 'Sony PlayStation 5 Disc Edition',
    brand: 'Sony',
    category: 'consoles',
    price: 23299,
    rating: 5,
    reviewCount: 312,
    emoji: '🎮',
    badge: 'hit',
    colors: ['#e8e8e8', '#111111'],
    specs: ['SSD 825 ГБ', '4K 120 FPS', 'Ray Tracing', 'DualSense'],
    description: 'Ігрова консоль нового покоління з SSD 825 ГБ, підтримкою 4K/120 FPS та революційним контролером DualSense.',
    inStock: false,
  },
  {
    id: '8',
    name: 'Sony Alpha A7 IV Full-Frame 33MP',
    brand: 'Sony',
    category: 'cameras',
    price: 71999,
    oldPrice: 84999,
    rating: 4,
    reviewCount: 43,
    emoji: '📷',
    badge: 'sale',
    colors: ['#111111'],
    specs: ['33 МП сенсор', '4K 60 FPS відео', '759 AF точок', 'Dual SD'],
    description: 'Повнокадрова камера для фото та відео. 33 МП сенсор, 4K/60p відео та найшвидша автофокусування.',
    inStock: true,
  },
  {
    id: '9',
    name: 'ASUS ROG Zephyrus G14 RTX 4060',
    brand: 'ASUS',
    category: 'laptops',
    price: 44899,
    oldPrice: 50999,
    rating: 5,
    reviewCount: 67,
    emoji: '💻',
    badge: 'sale',
    colors: ['#333333', '#e8e8e8'],
    specs: ['RTX 4060', 'Ryzen 9 7940HS', '16 ГБ DDR5', '1 ТБ SSD'],
    description: 'Компактний ігровий ноутбук з NVIDIA RTX 4060, процесором AMD Ryzen 9 та дисплеєм 120 Гц.',
    inStock: true,
  },
  {
    id: '10',
    name: 'AirPods Pro 2 MagSafe USB-C',
    brand: 'Apple',
    category: 'headphones',
    price: 8999,
    rating: 4,
    reviewCount: 189,
    emoji: '🎧',
    badge: 'new',
    colors: ['#e8e8e8'],
    specs: ['ANC H2 чіп', 'Adaptive Audio', 'USB-C зарядка', '6 год музики'],
    description: 'Навушники-вкладиші з активним шумоподавленням, Adaptive Audio та зарядкою через USB-C.',
    inStock: true,
  },
  {
    id: '11',
    name: 'iPad Pro 11" M4 256GB Wi-Fi',
    brand: 'Apple',
    category: 'accessories',
    price: 29999,
    rating: 5,
    reviewCount: 75,
    emoji: '📱',
    badge: 'new',
    colors: ['#c0c0c0', '#1d1d1d'],
    specs: ['Чіп Apple M4', 'OLED 11"', '256 ГБ', 'Apple Pencil Pro'],
    description: 'Найтонший iPad з OLED дисплеєм та чіпом M4. Підтримка Apple Pencil Pro та Magic Keyboard.',
    inStock: true,
  },
  {
    id: '12',
    name: 'Logitech MX Master 3S Mouse',
    brand: 'Logitech',
    category: 'accessories',
    price: 3299,
    oldPrice: 3999,
    rating: 5,
    reviewCount: 201,
    emoji: '🖱️',
    badge: 'sale',
    colors: ['#111111', '#e8e8e8', '#c0392b'],
    specs: ['8000 DPI', 'MagSpeed колесо', 'Bluetooth + USB', '70 год батарея'],
    description: 'Ергономічна бездротова миша з MagSpeed колесом, тихими кнопками та 70 годинами автономії.',
    inStock: true,
  },
];
