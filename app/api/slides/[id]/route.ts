import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const data = await req.json();

  const slide = await prisma.slide.update({
    where: { id },
    data: {
      title: data.title,
      subtitle: data.subtitle,
      badge: data.badge,
      badgeColor: data.badgeColor,
      bg: data.bg,
      emoji: data.emoji,
      href: data.href,
      imageUrl: data.imageUrl ?? null,
      active: data.active ?? true,
    },
  });
  return Response.json(slide);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  await prisma.slide.delete({ where: { id } });
  return Response.json({ ok: true });
}
