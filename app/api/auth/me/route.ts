// GET /api/auth/me
// Returns the current user based on JWT cookie, or 401 if not logged in
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, isAdmin: true },
  });

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  return Response.json(user);
}
