import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/data/products';

interface AdminProductsState {
  products: Product[];
  add: (product: Omit<Product, 'id'>) => void;
  upsert: (id: string, data: Omit<Product, 'id'>) => void; // add or override by id
  remove: (id: string) => void;
}

export const useAdminProductsStore = create<AdminProductsState>()(
  persist(
    (set, get) => ({
      products: [],

      add: (data) =>
        set((state) => ({
          products: [
            ...state.products,
            { ...data, id: `custom-${Date.now()}` },
          ],
        })),

      upsert: (id, data) => {
        const exists = get().products.some((p) => p.id === id);
        if (exists) {
          set((state) => ({
            products: state.products.map((p) => (p.id === id ? { ...data, id } : p)),
          }));
        } else {
          set((state) => ({ products: [...state.products, { ...data, id }] }));
        }
      },

      remove: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
    }),
    { name: 'techstore-admin-products' }
  )
);
