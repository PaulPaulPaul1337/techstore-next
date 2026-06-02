import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const slides = await prisma.slide.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  });
  return Response.json(slides);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session?.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const data = await req.json();
  const maxOrder = await prisma.slide.aggregate({ _max: { order: true } });
  const slide = await prisma.slide.create({
    data: {
      title: data.title,
      subtitle: data.subtitle,
      badge: data.badge,
      badgeColor: data.badgeColor,
      bg: data.bg,
      emoji: data.emoji,
      href: data.href,
      imageUrl: data.imageUrl || null,
      order: (maxOrder._max.order ?? -1) + 1,
      active: true,
    },
  });
  return Response.json(slide, { status: 201 });
}
