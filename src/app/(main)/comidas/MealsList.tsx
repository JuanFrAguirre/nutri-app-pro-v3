'use client';
import DividerLine from '@/components/DividerLine';
import { useLoadingContext } from '@/contexts/LoadingContext';
import useAuth from '@/hooks/useAuth';
import { MealWithQuantity } from '@/types/types';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { IoRestaurant } from 'react-icons/io5';
import { toast } from 'react-toastify';

const MealsList = () => {
  const [meals, setMeals] = useState<MealWithQuantity[]>([]);
  const { getHeaders } = useAuth();
  const { isLoading, setIsLoading } = useLoadingContext();

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setIsLoading(true);
        const headers = await getHeaders();
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/meals',
          { headers },
        );
        setMeals(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Error al obtener las comidas');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeals();
  }, [getHeaders, setIsLoading]);

  if (isLoading) return '';

  return (
    <>
      {!!meals.length ? (
        <div className="flex flex-col gap-10 xl:grid grid-cols-2">
          {meals.map((meal) => (
            <div
              key={meal._id}
              className="bg-brand-whiter shadow-xl p-4 md:p-7 lg:p-10 rounded-sm border-brand-grayer/20 flex flex-col gap-6 lg:gap-10 grow"
            >
              <p className="text-3xl font-thin text-center">{meal.title}</p>
              <div className="flex flex-col gap-6 lg:gap-10 grow">
                <DividerLine />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 xl:grid-cols-2">
                  {meal.mealProducts.map((product) => (
                    <div
                      key={product._id}
                      className="flex flex-col justify-between gap-4 items-center border-light p-2"
                    >
                      <p className="font-extralight text-sm md:text-base custom-ellipsis text-center">
                        {product.product.title}
                      </p>
                      <Image
                        src={product.product.image || ''}
                        alt={product.product.title}
                        width={200}
                        height={200}
                        className="bg-white h-32 w-32 border-lighter rounded-sm grid place-items-center object-contain"
                      />
                      <p className="font-light text-sm custom-ellipsis text-center">
                        {product.quantity}g
                        {product.quantity !==
                          product.product.presentationSize &&
                        product.quantity / product.product.presentationSize > 1
                          ? ` - ${
                              product.quantity /
                              product.product.presentationSize
                            } unidades`
                          : product.quantity /
                              product.product.presentationSize ===
                            1
                          ? ' - 1 unidad'
                          : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <p className="subtitle">
            No hay comidas disponibles aún. Creá algunas para comenzar a
            trackear tu nutrición!
          </p>
          <Link
            href="/productos"
            className="btn btn-plain font-semibold text-lg self-center flex items-center gap-4"
          >
            Crear comida
            <IoRestaurant />
          </Link>
        </div>
      )}
    </>
  );
};

export default MealsList;
