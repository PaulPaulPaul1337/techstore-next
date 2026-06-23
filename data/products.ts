export type Category =
  | 'smartphones'
  | 'laptops'
  | 'monitors'
  | 'headphones'
  | 'cameras'
  | 'consoles'
  | 'watches'
  | 'accessories';

// Mirrors the Prisma Product model shape returned by /api/products — keep in sync with prisma/schema.prisma
export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  oldPrice?: number | null;
  rating: number;
  reviewCount: number;
  emoji: string;
  image: string;
  badge?: 'new' | 'hit' | 'sale' | null;
  colors: string[];
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
