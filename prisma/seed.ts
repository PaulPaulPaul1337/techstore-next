//  script — fills the Seeddatabase with initial data
// Run with: npx prisma db seed
//
// What this does:
// 1. Creates the admin user
// 2. Inserts all static products from data/products.ts into PostgreSQL

import 'dotenv/config';
import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const staticProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro 256GB Titanium',
    brand: 'Apple',
    category: 'smartphones' as const,
    price: 37999,
    emoji: '📱',
    badge: 'new' as const,
    colors: ['#8a8a8a', '#2d2926', '#d4c5a9', '#4e4e4e'],
    specs: ['Чіп A17 Pro', '48 МП камера', 'USB-C USB 3', '6.1" ProMotion'],
    description: 'Найпотужніший iPhone з чіпом A17 Pro, камерою 48 МП та USB-C з USB 3 швидкістю.',
    inStock: true,
    rating: 5,
    reviewCount: 142,
  },
  {
    id: '2',
    name: 'MacBook Air 13" M3 16GB / 512GB',
    brand: 'Apple',
    category: 'laptops' as const,
    price: 54999,
    emoji: '💻',
    badge: 'hit' as const,
    colors: ['#c0c0c0', '#1d1d1d', '#d4a76a'],
    specs: ['Чіп Apple M3', '16 ГБ RAM', '512 ГБ SSD', '18 год батарея'],
    description: 'Найтонший та найлегший MacBook Air з потужним чіпом M3.',
    inStock: true,
    rating: 4,
    reviewCount: 89,
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5 Wireless',
    brand: 'Sony',
    category: 'headphones' as const,
    price: 9999,
    oldPrice: 12499,
    emoji: '🎧',
    badge: 'sale' as const,
    colors: ['#111111', '#d4c8b8'],
    specs: ['Шумоподавлення', '30 год батарея', 'Hi-Res Audio', 'Multipoint'],
    description: 'Флагманські навушники з найкращим у класі шумоподавленням.',
    inStock: true,
    rating: 5,
    reviewCount: 234,
  },
  {
    id: '4',
    name: 'Samsung Odyssey 27" 4K 144Hz',
    brand: 'Samsung',
    category: 'monitors' as const,
    price: 17999,
    emoji: '🖥️',
    badge: 'new' as const,
    colors: ['#111111'],
    specs: ['27" IPS 4K', '144 Hz', 'HDR600', 'USB-C 90W'],
    description: 'Ігровий монітор 4K з частотою оновлення 144 Гц та підтримкою HDR600.',
    inStock: true,
    rating: 4,
    reviewCount: 56,
  },
  {
    id: '5',
    name: 'Apple Watch Series 9 45mm GPS',
    brand: 'Apple',
    category: 'watches' as const,
    price: 16499,
    emoji: '⌚',
    badge: 'hit' as const,
    colors: ['#c0c0c0', '#d4a76a', '#c0392b', '#111111'],
    specs: ['Чіп S9', 'Double Tap', 'ECG', '18 год батарея'],
    description: 'Розумний годинник з новим жестом Double Tap та ЕКГ.',
    inStock: true,
    rating: 5,
    reviewCount: 178,
  },
  {
    id: '6',
    name: 'Samsung Galaxy S24 Ultra 256GB',
    brand: 'Samsung',
    category: 'smartphones' as const,
    price: 30499,
    oldPrice: 33899,
    emoji: '📱',
    badge: 'sale' as const,
    colors: ['#8a7a6a', '#111111', '#6a8a7a'],
    specs: ['Snapdragon 8 Gen 3', '200 МП камера', 'S Pen', '5000 мАг'],
    description: 'Флагман Samsung з вбудованим стилусом S Pen та камерою 200 МП.',
    inStock: true,
    rating: 4,
    reviewCount: 97,
  },
  {
    id: '7',
    name: 'Sony PlayStation 5 Disc Edition',
    brand: 'Sony',
    category: 'consoles' as const,
    price: 23299,
    emoji: '🎮',
    badge: 'hit' as const,
    colors: ['#e8e8e8', '#111111'],
    specs: ['SSD 825 ГБ', '4K 120 FPS', 'Ray Tracing', 'DualSense'],
    description: 'Ігрова консоль нового покоління з SSD 825 ГБ та підтримкою 4K/120 FPS.',
    inStock: false,
    rating: 5,
    reviewCount: 312,
  },
  {
    id: '8',
    name: 'Sony Alpha A7 IV Full-Frame 33MP',
    brand: 'Sony',
    category: 'cameras' as const,
    price: 71999,
    oldPrice: 84999,
    emoji: '📷',
    badge: 'sale' as const,
    colors: ['#111111'],
    specs: ['33 МП сенсор', '4K 60 FPS відео', '759 AF точок', 'Dual SD'],
    description: 'Повнокадрова камера для фото та відео з 33 МП сенсором.',
    inStock: true,
    rating: 4,
    reviewCount: 43,
  },
  {
    id: '9',
    name: 'ASUS ROG Zephyrus G14 RTX 4060',
    brand: 'ASUS',
    category: 'laptops' as const,
    price: 44899,
    oldPrice: 50999,
    emoji: '💻',
    badge: 'sale' as const,
    colors: ['#333333', '#e8e8e8'],
    specs: ['RTX 4060', 'Ryzen 9 7940HS', '16 ГБ DDR5', '1 ТБ SSD'],
    description: 'Компактний ігровий ноутбук з NVIDIA RTX 4060 та AMD Ryzen 9.',
    inStock: true,
    rating: 5,
    reviewCount: 67,
  },
  {
    id: '10',
    name: 'AirPods Pro 2 MagSafe USB-C',
    brand: 'Apple',
    category: 'headphones' as const,
    price: 8999,
    emoji: '🎧',
    badge: 'new' as const,
    colors: ['#e8e8e8'],
    specs: ['ANC H2 чіп', 'Adaptive Audio', 'USB-C зарядка', '6 год музики'],
    description: 'Навушники з активним шумоподавленням та зарядкою через USB-C.',
    inStock: true,
    rating: 4,
    reviewCount: 189,
  },
  {
    id: '11',
    name: 'iPad Pro 11" M4 256GB Wi-Fi',
    brand: 'Apple',
    category: 'accessories' as const,
    price: 29999,
    emoji: '📱',
    badge: 'new' as const,
    colors: ['#c0c0c0', '#1d1d1d'],
    specs: ['Чіп Apple M4', 'OLED 11"', '256 ГБ', 'Apple Pencil Pro'],
    description: 'Найтонший iPad з OLED дисплеєм та чіпом M4.',
    inStock: true,
    rating: 5,
    reviewCount: 75,
  },
  {
    id: '12',
    name: 'Logitech MX Master 3S Mouse',
    brand: 'Logitech',
    category: 'accessories' as const,
    price: 3299,
    oldPrice: 3999,
    emoji: '🖱️',
    badge: 'sale' as const,
    colors: ['#111111', '#e8e8e8', '#c0392b'],
    specs: ['8000 DPI', 'MagSpeed колесо', 'Bluetooth + USB', '70 год батарея'],
    description: 'Ергономічна бездротова миша з MagSpeed колесом та 70 годинами автономії.',
    inStock: true,
    rating: 5,
    reviewCount: 201,
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@techstore.ua' },
    update: {},
    create: {
      name: 'Адміністратор',
      email: 'admin@techstore.ua',
      password: adminPassword,
      isAdmin: true,
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // Insert products (upsert — safe to run multiple times)
  for (const p of staticProducts) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: { ...p, isStatic: true },
      create: { ...p, isStatic: true },
    });
  }
  console.log(`✅ ${staticProducts.length} products seeded`);

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
