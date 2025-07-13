import { getMeals } from '@/actions/mealsActions';
import DividerLine from '@/components/DividerLine';
import PageWrapper from '@/components/PageWrapper';
import Image from 'next/image';
import React from 'react';

export const dynamic = 'force-dynamic';

const FoodsPage = async () => {
  const meals = await getMeals();
  console.log(meals);

  return (
    <>
      <PageWrapper>
        <p className="title">Comidas</p>
        {!!meals.length && (
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
                          product.quantity / product.product.presentationSize >
                            1
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
        )}
      </PageWrapper>
    </>
  );
};

export default FoodsPage;
