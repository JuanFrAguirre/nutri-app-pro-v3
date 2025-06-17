import { Product } from '@prisma/client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProductState = {
  products: Product[];
  addProductToStore: (product: Product) => void;
  removeProductFromStore: (product: Product) => void;
  editProductInStore: (product: Product) => void;
  clearProductsStore: () => void;
};

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      addProductToStore: (product) => {
        const { products } = get();
        set({
          products: [
            ...products,
            {
              ...product,
            },
          ],
        });
      },
      removeProductFromStore: (product) => {
        const { products } = get();
        set({ products: products.filter((p) => p.id !== product.id) });
      },
      editProductInStore: (product) => {
        const { products } = get();
        set({
          products: products.map((eachProduct) =>
            eachProduct.id === product.id ? product : eachProduct,
          ),
        });
      },
      clearProductsStore: () => {
        set({ products: [] });
      },
    }),
    {
      name: 'products',
    },
  ),
);
