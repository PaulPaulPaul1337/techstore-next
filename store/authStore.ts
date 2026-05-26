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

  logout: async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    set({ user: null });
  },
}));
