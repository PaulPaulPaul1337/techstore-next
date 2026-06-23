// PATCH /api/orders/[id]  → update order status / tracking number (admin only)
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

const VALID_STATUSES = ['processing', 'shipped', 'delivered'];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const data = await req.json();

  if (data.status && !VALID_STATUSES.includes(data.status)) {
    return Response.json({ error: 'Invalid status' }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(data.status ? { status: data.status } : {}),
      ...(data.trackingNumber !== undefined ? { trackingNumber: data.trackingNumber } : {}),
    },
    include: { items: true },
  });

  return Response.json(order);
}
