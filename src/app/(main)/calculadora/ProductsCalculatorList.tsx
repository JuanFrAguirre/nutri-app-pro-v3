'use client';
import React from 'react';
import { useProductStore } from '@/store/productStore';
import Image from 'next/image';
import { Product } from '@prisma/client';
import clsx from 'clsx';
import Link from 'next/link';

const ProductsCalculatorList = () => {
  const { products: productsInStore } = useProductStore();

  return (
    <>
      {!!productsInStore.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productsInStore.map((product: Product) => (
            <div
              key={product.id}
              className={clsx(
                'border rounded-sm p-4 bg-brand-whiter shadow-xl flex flex-col gap-2 text-black border-brand-gray/5',
              )}
            >
              <p className="font-thin h-12 text-center text-sm md:text-base custom-ellipsis">
                {product.title}
              </p>
              <Image
                src={product.image}
                alt={product.title}
                width={100}
                height={100}
                className="w-full h-auto rounded-xs border border-brand-grayer/10"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-10">
          <p className="text-center text-sm md:text-base">
            Aún no tenés productos para calcular, agregá alguno para comenzar
          </p>
          <Link href="/productos" className="btn">
            Ir a productos
          </Link>
        </div>
      )}
    </>
  );
};

export default ProductsCalculatorList;
