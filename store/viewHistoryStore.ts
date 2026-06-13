import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_ITEMS = 30;

interface ViewHistoryState {
  ids: string[];
  addView: (id: string) => void;
  clear: () => void;
}

export const useViewHistoryStore = create<ViewHistoryState>()(
  persist(
    (set) => ({
      ids: [],
      addView: (id) =>
        set((state) => ({
          ids: [id, ...state.ids.filter((i) => i !== id)].slice(0, MAX_ITEMS),
        })),
      clear: () => set({ ids: [] }),
    }),
    { name: 'techstore-view-history' }
  )
);
