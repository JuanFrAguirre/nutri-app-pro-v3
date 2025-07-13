import { ProductWithQuantity } from '@/types/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ProductState = {
  products: ProductWithQuantity[];
  addProductToStore: (product: ProductWithQuantity) => void;
  removeProductFromStore: (id: string) => void;
  editProductInStore: (product: ProductWithQuantity) => void;
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
              quantity: product.quantity || 1,
              quantityType: product.quantityType || 'absolute',
            },
          ],
        });
      },
      removeProductFromStore: (id) => {
        const { products } = get();
        set({ products: products.filter((p) => p._id !== id) });
      },
      editProductInStore: (product) => {
        const { products } = get();
        set({
          products: products.map((eachProduct) =>
            eachProduct._id === product._id ? product : eachProduct,
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
