export const dynamic = 'force-dynamic';

import HomeContent from '@/components/HomeContent';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  // Direct DB query — runs server-side, never exposed to the client
  let featured: Awaited<ReturnType<typeof prisma.product.findMany>> = [];
  let hits: typeof featured = [];

  try {
    featured = await prisma.product.findMany({ take: 8, orderBy: { createdAt: 'asc' } });
    hits = await prisma.product.findMany({ where: { badge: 'hit' }, take: 8 });
  } catch {
    // DB not configured yet — show empty state
  }

  return <HomeContent featured={featured} hits={hits} />;
}
