import { create } from 'zustand';

export type Lang = 'uk' | 'ru' | 'en';

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  init: () => void;
}

export const useLangStore = create<LangState>()((set) => ({
  lang: 'uk',

  init: () => {
    const saved = localStorage.getItem('lang') as Lang | null;
    if (saved && ['uk', 'ru', 'en'].includes(saved)) {
      set({ lang: saved });
    }
  },

  setLang: (lang) => {
    localStorage.setItem('lang', lang);
    set({ lang });
  },
}));
