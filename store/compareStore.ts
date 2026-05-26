import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX = 4;

interface CompareState {
  ids: string[];
  toggle: (id: string) => boolean; // returns false if max reached and not already in list
  has: (id: string) => boolean;
  clear: () => void;
  count: () => number;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const { ids } = get();
        if (ids.includes(id)) {
          set({ ids: ids.filter((i) => i !== id) });
          return true;
        }
        if (ids.length >= MAX) return false;
        set({ ids: [...ids, id] });
        return true;
      },
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
      count: () => get().ids.length,
    }),
    { name: 'techstore-compare' }
  )
);
