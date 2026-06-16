// GET    /api/products/[id]  → get one product
// PUT    /api/products/[id]  → update product (admin only)
// DELETE /api/products/[id]  → delete product (admin only, non-static only)
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { Category, Badge } from '@/app/generated/prisma/client';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(product);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const data = await req.json();

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      brand: data.brand,
      category: data.category as Category,
      price: Number(data.price),
      oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
      emoji: data.emoji,
      image: data.image || '',
      badge: (data.badge || null) as Badge | null,
      specs: data.specs,
      description: data.description,
      inStock: Boolean(data.inStock),
      colors: data.colors || [],
      rating: Number(data.rating),
      reviewCount: Number(data.reviewCount),
    },
  });

  return Response.json(product);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) return Response.json({ error: 'Not found' }, { status: 404 });
  if (product.isStatic) return Response.json({ error: 'Cannot delete static products' }, { status: 400 });

  await prisma.product.delete({ where: { id } });
  return Response.json({ ok: true });
}
