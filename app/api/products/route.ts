// GET  /api/products                                    → all products matching filters (plain array, capped by ?limit)
// GET  /api/products?ids=id1,id2                         → specific products by id (plain array, ignores other filters)
// GET  /api/products?page=1&limit=24&...filters          → paginated: { items, total, page, limit, totalPages }
// Filters: category, badge, q, maxPrice, inStock=1, sort=price_asc|price_desc|rating|name, excludeId
// POST /api/products                                     → create new product (admin only)
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Category, Badge } from '@/app/generated/prisma/client';

const DEFAULT_PAGE_SIZE = 24;
const MAX_LIMIT = 100;

function parseOrderBy(sort: string | null) {
  switch (sort) {
    case 'price_asc': return { price: 'asc' as const };
    case 'price_desc': return { price: 'desc' as const };
    case 'rating': return [{ rating: 'desc' as const }, { reviewCount: 'desc' as const }];
    case 'name': return { name: 'asc' as const };
    default: return { createdAt: 'asc' as const };
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get('ids');

  // Targeted lookup for a known set of products (wishlist/compare/recently-viewed) —
  // cheaper than loading the whole catalog just to filter by id client-side.
  if (ids) {
    const idList = ids.split(',').map((s) => s.trim()).filter(Boolean);
    if (idList.length === 0) return Response.json([]);
    const items = await prisma.product.findMany({ where: { id: { in: idList } } });
    return Response.json(items);
  }

  const category = searchParams.get('category') as Category | null;
  const badge = searchParams.get('badge') as Badge | null;
  const q = searchParams.get('q');
  const excludeId = searchParams.get('excludeId');
  const maxPrice = Number(searchParams.get('maxPrice'));
  const inStock = searchParams.get('inStock') === '1';
  const sort = searchParams.get('sort');
  const pageParam = searchParams.get('page');
  const limitParam = Number(searchParams.get('limit'));

  const where = {
    ...(category ? { category } : {}),
    ...(badge ? { badge } : {}),
    ...(excludeId ? { id: { not: excludeId } } : {}),
    ...(Number.isFinite(maxPrice) && maxPrice > 0 ? { price: { lte: maxPrice } } : {}),
    ...(inStock ? { inStock: true } : {}),
    ...(q ? {
      OR: [
        { name: { contains: q, mode: 'insensitive' as const } },
        { brand: { contains: q, mode: 'insensitive' as const } },
      ],
    } : {}),
  };

  const orderBy = parseOrderBy(sort);
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, MAX_LIMIT) : undefined;

  // Paginated mode — used by the catalog page so it never loads the full table into memory
  if (pageParam) {
    const page = Math.max(1, Number(pageParam) || 1);
    const pageSize = limit ?? DEFAULT_PAGE_SIZE;

    const [items, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
      prisma.product.count({ where }),
    ]);

    return Response.json({
      items,
      total,
      page,
      limit: pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  }

  // Backward-compatible plain array mode (admin product list, search suggestions, similar products)
  const products = await prisma.product.findMany({
    where,
    orderBy,
    ...(limit ? { take: limit } : {}),
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
      image: data.image || '',
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
