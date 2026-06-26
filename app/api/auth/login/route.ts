// POST /api/auth/login
// Validates credentials and returns a JWT cookie
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, buildAuthCookie } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return Response.json({ error: 'Введіть email та пароль' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    console.log(`[login] no user found for email="${email.toLowerCase()}"`);
    return Response.json({ error: 'invalid' }, { status: 401 });
  }

  // compare() safely checks the password against the bcrypt hash
  const valid = await compare(password, user.password);
  console.log(`[login] user=${user.id} email="${user.email}" passwordLength=${password.length} hashPrefix=${user.password.slice(0, 10)} valid=${valid}`);
  if (!valid) {
    return Response.json({ error: 'invalid' }, { status: 401 });
  }

  if (user.banned) {
    return Response.json({ error: 'banned' }, { status: 403 });
  }

  const token = await signToken({ userId: user.id, isAdmin: user.isAdmin });
  const cookie = buildAuthCookie(token);

  return Response.json(
    { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    {
      headers: { 'Set-Cookie': `${cookie.name}=${cookie.value}; Path=${cookie.path}; Max-Age=${cookie.maxAge}; HttpOnly; SameSite=Lax` },
    }
  );
}
