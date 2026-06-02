import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: id },
      orderBy: { createdAt: 'desc' },
    });
    return Response.json(reviews);
  } catch (e) {
    console.error('[GET reviews]', e);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return Response.json({ error: 'Not found' }, { status: 404 });

    const body = await req.json();
    const { rating, comment, userName: bodyName } = body;

    if (!rating || rating < 1 || rating > 5) {
      return Response.json({ error: 'Invalid rating' }, { status: 400 });
    }
    if (!comment?.trim()) {
      return Response.json({ error: 'Comment required' }, { status: 400 });
    }

    const session = await getSession();
    let userName = bodyName?.trim() || 'Анонім';
    let userId: string | null = null;

    if (session?.userId) {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, name: true },
      });
      if (dbUser) { userName = dbUser.name; userId = dbUser.id; }
    }

    const review = await prisma.review.create({
      data: { productId: id, userId, userName, rating, comment: comment.trim() },
    });

    // Recalculate average rating and count
    const all = await prisma.review.findMany({ where: { productId: id }, select: { rating: true } });
    const avg = Math.round(all.reduce((s, r) => s + r.rating, 0) / all.length);
    await prisma.product.update({
      where: { id },
      data: { rating: avg, reviewCount: all.length },
    });

    return Response.json(review, { status: 201 });
  } catch (e) {
    console.error('[POST review]', e);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
