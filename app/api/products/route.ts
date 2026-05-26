// GET  /api/products          → list all products (optional ?category=X&q=X&badge=X)
// POST /api/products          → create new product (admin only)
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Category, Badge } from '@/app/generated/prisma/client';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') as Category | null;
  const badge = searchParams.get('badge') as Badge | null;
  const q = searchParams.get('q');

  const products = await prisma.product.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(badge ? { badge } : {}),
      ...(q ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { brand: { contains: q, mode: 'insensitive' } },
        ],
      } : {}),
    },
    orderBy: { createdAt: 'asc' },
  });

  return Response.json(products);
}

export async function POST(req: Request) {
  // Only admins can create products
  const session = await getSession();
  if (!session?.isAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const data = await req.json();

  const product = await prisma.product.create({
    data: {
      name: data.name,
      brand: data.brand,
      category: data.category as Category,
      price: Number(data.price),
      oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
      emoji: data.emoji || '📦',
      badge: data.badge || null,
      specs: data.specs || [],
      description: data.description || '',
      inStock: Boolean(data.inStock),
      colors: data.colors || [],
      rating: Number(data.rating) || 5,
      reviewCount: Number(data.reviewCount) || 0,
      isStatic: false,
    },
  });

  return Response.json(product, { status: 201 });
}
