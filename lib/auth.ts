// JWT helpers for authentication
// Uses jose (works in Edge runtime and Node.js)
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'dev-secret-change-in-production'
);

const COOKIE_NAME = 'ts_token';
const COOKIE_OPTIONS = {
  httpOnly: true,           // JS cannot read this cookie — prevents XSS attacks
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax' as const, // Prevents CSRF attacks
  maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
  path: '/',
};

export interface TokenPayload {
  userId: string;
  isAdmin: boolean;
}

// Creates a signed JWT with the user's id and role
export async function signToken(payload: TokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET);
}

// Verifies and decodes a JWT — throws if invalid or expired
export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload } = await jwtVerify(token, SECRET);
  return payload as unknown as TokenPayload;
}

// Reads the current session from the request cookie
export async function getSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    return await verifyToken(token);
  } catch {
    return null;
  }
}

// Sets the auth cookie in the response (call from route handlers)
export function buildAuthCookie(token: string) {
  return { name: COOKIE_NAME, value: token, ...COOKIE_OPTIONS };
}

// Clears the auth cookie
export function buildLogoutCookie() {
  return { name: COOKIE_NAME, value: '', maxAge: 0, path: '/' };
}
