// POST /api/auth/forgot-password/request
// Generates a 6-digit confirmation code and "sends" it to the user's email
import { prisma } from '@/lib/prisma';

const CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return Response.json({ error: 'Введіть email' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    console.log(`[forgot-password/request] no user found for email="${email.toLowerCase()}"`);
    return Response.json({ error: 'notfound' }, { status: 404 });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(Date.now() + CODE_TTL_MS);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetCode: code, resetCodeExpires: expires },
  });

  console.log(`[forgot-password/request] generated code for user=${user.id} email="${user.email}" code=${code} expires=${expires.toISOString()}`);

  // No email service is configured in this project — simulate sending by logging.
  console.log(`[Email] (simulated) -> ${user.email}: код підтвердження ${code}`);

  return Response.json({ ok: true, simulated: true, code });
}
