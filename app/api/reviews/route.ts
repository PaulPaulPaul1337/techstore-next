// GET /api/reviews  → list all reviews across all products, admin only (newest first)
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session?.isAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: { product: { select: { id: true, name: true, emoji: true } } },
  });

  return Response.json(reviews);
}
