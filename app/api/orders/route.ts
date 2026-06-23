// GET  /api/orders         → list current user's orders (newest first)
// GET  /api/orders?all=1   → list all orders, admin only (newest first)
// POST /api/orders         → create a new order
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const wantsAll = searchParams.get('all') === '1';

  if (wantsAll && !session.isAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    where: wantsAll ? {} : { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });

  return Response.json(orders);
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const data = await request.json();

    if (!data.customerName || !data.phone || !data.address || !data.paymentMethod || !Array.isArray(data.items) || data.items.length === 0) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderNumber = `TS-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNumber = `2045${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        trackingNumber,
        userId: session?.userId ?? null,
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        paymentMethod: data.paymentMethod,
        total: Number(data.total) || 0,
        items: {
          create: data.items.map((item: { productId: string; name: string; emoji: string; price: number; qty: number }) => ({
            productId: item.productId,
            name: item.name,
            emoji: item.emoji,
            price: Number(item.price),
            qty: Number(item.qty),
          })),
        },
      },
      include: { items: true },
    });

    return Response.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
