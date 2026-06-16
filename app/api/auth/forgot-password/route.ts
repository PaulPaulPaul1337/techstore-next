// POST /api/auth/forgot-password
// Final step: verifies the confirmation code again and sets the new password
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const { email, code, newPassword } = await req.json();

  if (!email || !code || !newPassword) {
    return Response.json({ error: 'Заповніть усі поля' }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return Response.json({ error: 'Пароль мінімум 6 символів' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    console.log(`[forgot-password] no user found for email="${email.toLowerCase()}"`);
    return Response.json({ error: 'notfound' }, { status: 404 });
  }

  console.log(`[forgot-password] user=${user.id} submitted code=${code} stored=${user.resetCode} expires=${user.resetCodeExpires?.toISOString()} now=${new Date().toISOString()}`);

  if (!user.resetCode || !user.resetCodeExpires || user.resetCode !== code || user.resetCodeExpires < new Date()) {
    console.log(`[forgot-password] rejected (hasCode=${!!user.resetCode}, codeMatch=${user.resetCode === code}, expired=${user.resetCodeExpires ? user.resetCodeExpires < new Date() : 'n/a'})`);
    return Response.json({ error: 'invalid' }, { status: 400 });
  }

  const hashedPassword = await hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, resetCode: null, resetCodeExpires: null },
  });

  console.log(`[forgot-password] password updated successfully for user=${user.id} newPasswordLength=${newPassword.length} newHashPrefix=${hashedPassword.slice(0, 10)}`);

  return Response.json({ ok: true });
}
