// Auth store — manages current user state on the client.
// The source of truth is the httpOnly JWT cookie on the server.
// This store is a client-side cache of the current session.
import { create } from 'zustand';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  init: () => Promise<void>;              // Call on app mount to restore session
  login: (email: string, password: string) => Promise<'ok' | 'invalid'>;
  register: (name: string, email: string, password: string) => Promise<'ok' | 'exists'>;
  requestPasswordReset: (email: string) => Promise<{ status: 'ok' | 'notfound'; code?: string }>;
  verifyResetCode: (email: string, code: string) => Promise<'ok' | 'invalid'>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<'ok' | 'invalid' | 'notfound'>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  loading: true,

  // Restore session from the JWT cookie by calling /api/auth/me.
  // Guard: if login/register already set a user, skip the fetch to avoid a race
  // where the pre-cookie /api/auth/me response overwrites the freshly set user.
  init: async () => {
    if (get().user) { set({ loading: false }); return; }
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const user = await res.json();
        set({ user, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch {
      set({ user: null, loading: false });
    }
  },

  login: async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    console.log('[authStore.login] email=%s passwordLength=%d status=%d', email, password.length, res.status);
    if (!res.ok) return 'invalid';
    const user = await res.json();
    set({ user });
    return 'ok';
  },

  register: async (name, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (res.status === 409) return 'exists';
    if (!res.ok) return 'exists';
    const user = await res.json();
    set({ user });
    return 'ok';
  },

  requestPasswordReset: async (email) => {
    const res = await fetch('/api/auth/forgot-password/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    console.log('[authStore.requestPasswordReset] email=%s status=%d', email, res.status);
    if (res.status === 404) return { status: 'notfound' };
    if (!res.ok) {
      console.log('[authStore.requestPasswordReset] error body:', await res.text());
      return { status: 'notfound' };
    }
    const data = await res.json();
    console.log('[authStore.requestPasswordReset] response:', data);
    return { status: 'ok', code: data.code };
  },

  verifyResetCode: async (email, code) => {
    const res = await fetch('/api/auth/forgot-password/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    console.log('[authStore.verifyResetCode] email=%s code=%s status=%d', email, code, res.status);
    if (!res.ok) console.log('[authStore.verifyResetCode] error body:', await res.text());
    return res.ok ? 'ok' : 'invalid';
  },

  resetPassword: async (email, code, newPassword) => {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword }),
    });
    console.log('[authStore.resetPassword] email=%s code=%s newPasswordLength=%d status=%d', email, code, newPassword.length, res.status);
    if (!res.ok) {
      console.log('[authStore.resetPassword] error body:', await res.text());
      if (res.status === 404) return 'notfound';
      return 'invalid';
    }
    return 'ok';
  },

  logout: async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    set({ user: null });
  },
}));
