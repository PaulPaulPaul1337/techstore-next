// POST /api/auth/forgot-password/verify
// Checks that the confirmation code matches and hasn't expired
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return Response.json({ error: 'Введіть email та код' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !user.resetCode || !user.resetCodeExpires) {
    console.log(`[forgot-password/verify] no pending reset for email="${email.toLowerCase()}" (user=${user ? user.id : 'null'}, resetCode=${user?.resetCode}, resetCodeExpires=${user?.resetCodeExpires})`);
    return Response.json({ error: 'invalid' }, { status: 400 });
  }

  console.log(`[forgot-password/verify] user=${user.id} submitted code=${code} stored=${user.resetCode} expires=${user.resetCodeExpires.toISOString()} now=${new Date().toISOString()}`);

  if (user.resetCode !== code || user.resetCodeExpires < new Date()) {
    console.log(`[forgot-password/verify] mismatch or expired (codeMatch=${user.resetCode === code}, expired=${user.resetCodeExpires < new Date()})`);
    return Response.json({ error: 'invalid' }, { status: 400 });
  }

  return Response.json({ ok: true });
}
