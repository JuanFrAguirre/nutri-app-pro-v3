'use client';
import React, { useEffect, useState } from 'react';
import { useProductStore } from '@/store/productStore';
import Image from 'next/image';
import clsx from 'clsx';
import { IoMdCheckmark, IoMdSearch } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import { Product } from '@/types/types';
import { toast } from 'react-toastify';
import { useLoadingContext } from '@/contexts/LoadingContext';
import axios from 'axios';
import useAuth from '@/hooks/useAuth';

const ProductsList = () => {
  const {
    addProductToStore,
    removeProductFromStore,
    products: productsInStore,
  } = useProductStore();

  const { isLoading, setIsLoading } = useLoadingContext();
  const [search, setSearch] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const { getHeaders } = useAuth();

  const handleProductClick = (product: Product) => {
    if (productsInStore.find((p) => p._id === product._id)) {
      removeProductFromStore(product._id);
    } else {
      addProductToStore({
        ...product,
        quantity: product.presentationSize,
        quantityType: 'relative',
      });
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const headers = await getHeaders();
        const response: { data: Product[] } = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/products',
          { headers },
        );
        setFilteredProducts(
          response.data.filter(
            (p) =>
              p.title.toLowerCase().includes(search.toLowerCase()) ||
              p.tags?.toLowerCase().includes(search.toLowerCase()),
          ),
        );
      } catch (error) {
        console.error(error);
        toast.error('Error al obtener los productos');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [search, setIsLoading, getHeaders]);

  if (isLoading) return '';

  return (
    <div className="mb-20">
      <div className=" z-[10] fixed bottom-10 md:left-1/2 md:-translate-x-1/2 md:max-w-[300px] bg-brand-whiter shadow-xl shadow-brand-black/20">
        <div className="absolute left-1.5 top-0 bottom-0 flex items-center p-1">
          <IoMdSearch className=" text-brand-grayer" />
        </div>
        <input
          type="text"
          className={clsx(
            'input-search focus-visible:border-transparent px-7 border-[1px] border-brand-blacker md:py-4! md:px-10! md:text-lg!',
          )}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ej: arroz..."
        />
        {!!search && (
          <div
            className="absolute right-1 top-0 bottom-0 flex items-center p-1"
            onClick={() => setSearch('')}
          >
            <MdClose className=" text-brand-black " />
          </div>
        )}
      </div>
      <div
        className={clsx(
          'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4',
          // !!productsInStore.length && 'lg:grid-cols-3! xl:grid-cols-4!',
        )}
      >
        {filteredProducts.map((product: Product) => {
          const isInStore = productsInStore.find((p) => p._id === product._id);
          return (
            <div
              key={product._id}
              className={clsx(
                'border rounded-sm p-4 pt-7 bg-brand-whiter shadow-xl flex flex-col items-center gap-2 text-black relative',
                isInStore ? 'border-brand-black' : 'border-brand-gray/5',
              )}
              onClick={() => handleProductClick(product)}
            >
              <div
                className={clsx(
                  'absolute -top-[1px] -right-[1px] flex items-center justify-center btn-secondary rounded-bl-lg p-0.5',
                  !isInStore && 'hidden ',
                )}
              >
                <IoMdCheckmark className="text-brand-whiter w-5 h-5" />
              </div>
              <p className="font-thin h-12 text-center text-sm md:text-base custom-ellipsis">
                {product.title}
              </p>
              <Image
                src={product.image || ''}
                alt={product.title}
                width={500}
                height={500}
                className="w-40 h-40 rounded-xs border border-brand-grayer/10 object-contain"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsList;
