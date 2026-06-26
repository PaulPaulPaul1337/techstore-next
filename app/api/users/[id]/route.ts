// PATCH /api/users/[id]  → update isAdmin / banned flags, admin only
// Admins cannot ban or demote themselves (avoids locking everyone out).
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const data = await req.json();

  if (id === session.userId && (data.banned === true || data.isAdmin === false)) {
    return Response.json({ error: 'Cannot modify your own admin/ban status' }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(typeof data.isAdmin === 'boolean' ? { isAdmin: data.isAdmin } : {}),
      ...(typeof data.banned === 'boolean' ? { banned: data.banned } : {}),
    },
    select: { id: true, name: true, email: true, isAdmin: true, banned: true, createdAt: true },
  });

  return Response.json(user);
}
