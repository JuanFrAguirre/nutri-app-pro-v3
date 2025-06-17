import PageWrapper from '@/components/PageWrapper';
import { getProducts } from '@/actions/productActions';
import React from 'react';
import Image from 'next/image';

const ProductsPage = async () => {
  const products = await getProducts();
  return (
    <PageWrapper>
      <p className="title">Productos</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xs p-4 bg-brand-whiter border-brand-gray/5 shadow-xl flex flex-col gap-2 text-black"
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
    </PageWrapper>
  );
};

export default ProductsPage;
