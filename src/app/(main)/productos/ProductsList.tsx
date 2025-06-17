'use client';
import React from 'react';
import { useProductStore } from '@/store/productStore';
import Image from 'next/image';
import { Product } from '@prisma/client';
import clsx from 'clsx';

const ProductsList = ({ products }: { products: Product[] }) => {
  const {
    addProductToStore,
    removeProductFromStore,
    products: productsInStore,
  } = useProductStore();

  const handleProductClick = (product: Product) => {
    if (productsInStore.find((p) => p.id === product.id)) {
      removeProductFromStore(product);
    } else {
      addProductToStore(product);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product: Product) => {
        const isInStore = productsInStore.find((p) => p.id === product.id);
        return (
          <div
            key={product.id}
            className={clsx(
              'border rounded-sm p-4 bg-brand-whiter shadow-xl flex flex-col gap-2 text-black',
              isInStore ? 'border-brand-black' : 'border-brand-gray/5',
            )}
            onClick={() => handleProductClick(product)}
          >
            <p className="font-thin h-12 text-center text-sm md:text-base custom-ellipsis">
              {product.title}
            </p>
            <Image
              src={product.image}
              alt={product.title}
              width={400}
              height={400}
              className="w-full h-auto rounded-xs border border-brand-grayer/10"
            />
          </div>
        );
      })}
    </div>
  );
};

export default ProductsList;
