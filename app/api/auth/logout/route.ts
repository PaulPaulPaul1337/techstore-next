// POST /api/auth/logout
// Clears the JWT cookie
import { buildLogoutCookie } from '@/lib/auth';

export async function POST() {
  const cookie = buildLogoutCookie();
  return Response.json(
    { ok: true },
    {
      headers: { 'Set-Cookie': `${cookie.name}=${cookie.value}; Path=${cookie.path}; Max-Age=0; HttpOnly; SameSite=Lax` },
    }
  );
}
