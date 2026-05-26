// POST /api/auth/register
// Creates a new user account and returns a JWT cookie
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, buildAuthCookie } from '@/lib/auth';

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return Response.json({ error: 'Всі поля обовʼязкові' }, { status: 400 });
  }
  if (password.length < 6) {
    return Response.json({ error: 'Пароль мінімум 6 символів' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) {
    return Response.json({ error: 'exists' }, { status: 409 });
  }

  // hash(password, saltRounds) — saltRounds=12 is a good balance of security vs speed
  const hashedPassword = await hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin: false,
    },
  });

  const token = await signToken({ userId: user.id, isAdmin: user.isAdmin });
  const cookie = buildAuthCookie(token);

  return Response.json(
    { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    {
      status: 201,
      headers: { 'Set-Cookie': `${cookie.name}=${cookie.value}; Path=${cookie.path}; Max-Age=${cookie.maxAge}; HttpOnly; SameSite=Lax` },
    }
  );
}
