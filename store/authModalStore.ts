import { create } from 'zustand';

type Mode = 'login' | 'register' | 'forgot';

interface AuthModalState {
  isOpen: boolean;
  mode: Mode;
  openLogin: () => void;
  openRegister: () => void;
  openForgot: () => void;
  openAccount: () => void;
  close: () => void;
}

export const useAuthModalStore = create<AuthModalState>()((set) => ({
  isOpen: false,
  mode: 'login',
  openLogin: () => set({ isOpen: true, mode: 'login' }),
  openRegister: () => set({ isOpen: true, mode: 'register' }),
  openForgot: () => set({ isOpen: true, mode: 'forgot' }),
  openAccount: () => set({ isOpen: true, mode: 'login' }),
  close: () => set({ isOpen: false }),
}));
