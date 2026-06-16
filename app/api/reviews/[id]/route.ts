// DELETE /api/reviews/[id]
// Admin-only: deletes a review and recalculates the product's rating/reviewCount
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.isAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }

  await prisma.review.delete({ where: { id } });

  const remaining = await prisma.review.findMany({
    where: { productId: review.productId },
    select: { rating: true },
  });
  const rating = remaining.length
    ? Math.round(remaining.reduce((s, r) => s + r.rating, 0) / remaining.length)
    : 0;

  await prisma.product.update({
    where: { id: review.productId },
    data: { rating, reviewCount: remaining.length },
  });

  return Response.json({ ok: true });
}
