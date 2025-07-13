'use client';

import DividedTextLine from '@/components/DividedTextLine';
import DividerLine from '@/components/DividerLine';
import Modal from '@/components/Modal';
import { useLoadingContext } from '@/contexts/LoadingContext';
import { customFixedRound } from '@/lib/utils';
import {
  Log,
  Meal,
  MealWithQuantity,
  Product,
  ProductWithQuantity,
} from '@/types/types';
import axios, { AxiosError } from 'axios';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FaArrowLeft,
  FaArrowRight,
  FaMinus,
  FaPlus,
  FaTrashAlt,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useModal } from '../../../hooks/useModal';
import useAuth from '@/hooks/useAuth';

const LogList = () => {
  const searchParams = useSearchParams();
  const logDate = useMemo(
    () =>
      searchParams.get('date')
        ? new Date(searchParams.get('date') || '').toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    [searchParams],
  );

  const [products, setProducts] = useState<ProductWithQuantity[]>([]);
  const [meals, setMeals] = useState<MealWithQuantity[]>([]);
  const { getHeaders, getUser } = useAuth();

  const [date, setDate] = useState<string>(logDate);
  const [log, setLog] = useState<Log | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<MealWithQuantity[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    ProductWithQuantity[]
  >([]);
  const [selectedTab, setSelectedTab] = useState<'meals' | 'products'>('meals');
  const { isLoading, setIsLoading } = useLoadingContext();
  const router = useRouter();

  const { isOpen, setIsOpen } = useModal();

  const handleMealQuantity = (mealId: string, quantity: number) => {
    setSelectedMeals((prev) =>
      prev.map((meal) =>
        meal._id === mealId
          ? {
              ...meal,
              quantity,
            }
          : meal,
      ),
    );
  };

  const handleFetchLog = useCallback(
    async (date: string) => {
      try {
        const headers = await getHeaders();
        setIsLoading(true);
        setLog(null);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/logs?date=${date}`,
          { headers },
        );
        setLog(response.data);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          setIsLoading(false);
          return;
        } else {
          console.error(error);
          toast.error('Error al cargar el registro');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, getHeaders],
  );

  const handleProductQuantity = (productId: string, quantity: number) => {
    setSelectedProducts((prev) =>
      prev.map((product) =>
        product._id === productId
          ? {
              ...product,
              quantity,
            }
          : product,
      ),
    );
  };

  const handleCreateLog = async () => {
    try {
      const headers = await getHeaders();
      const user = await getUser();
      setIsLoading(true);
      const mealsToCreate = selectedMeals
        .filter((meal) => meal.quantity > 0)
        .map((meal) => ({
          meal: meal._id,
          quantity: meal.quantity,
        }));
      const productsToCreate = selectedProducts
        .filter((product) => product.quantity > 0)
        .map((product) => ({
          product: product._id,
          quantity: product.quantity,
        }));
      await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + '/logs',
        {
          date,
          user: user.id,
          logMeals: mealsToCreate,
          logProducts: productsToCreate,
        },
        { headers },
      );
      handleCloseModal();
      toast.success('Registro creado correctamente');
    } catch (error) {
      console.error(error);
      toast.error('Error al crear el registro');
    } finally {
      handleFetchLog(date);
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedMeals(meals);
    setSelectedProducts(products);
    setSelectedTab('meals');
    setIsOpen(false);
  };

  const handleChangeDate = (direction: number) => {
    const currentStr = date || logDate;
    let currentDate: Date;
    if (currentStr.includes('/')) {
      const [day, month, year] = currentStr.split('/').map(Number);
      currentDate = new Date(year, month - 1, day);
    } else {
      currentDate = new Date(currentStr);
    }
    currentDate.setDate(currentDate.getDate() + direction);
    const isoDate = currentDate.toISOString().split('T')[0];
    setDate(isoDate);
    handleFetchLog(isoDate);
    router.push(`/registros?date=${isoDate}`);
  };

  const handleFetchProductsAndMeals = useCallback(async () => {
    try {
      const headers = await getHeaders();
      const [productsResponse, mealsResponse] = await Promise.all([
        axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/products', {
          headers,
        }),
        axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + '/meals', {
          headers,
        }),
      ]);
      const productsData = productsResponse.data.map((product: Product) => ({
        ...product,
        quantity: 0,
      }));
      const mealsData = mealsResponse.data.map((meal: Meal) => ({
        ...meal,
        quantity: 0,
      }));
      setProducts(productsData);
      setMeals(mealsData);
      setSelectedProducts(productsData);
      setSelectedMeals(mealsData);
    } catch (error) {
      toast.error('Error al cargar los productos y comidas');
      console.error(error);
    }
  }, [getHeaders]);

  const handleDeleteProductOrMealFromEntry = async (
    id: string,
    type: 'product' | 'meal',
  ) => {
    try {
      if (confirm('¿Estás seguro de querer eliminar esta entrada?')) {
        const headers = await getHeaders();
        setIsLoading(true);
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/logs/${id}`,
          {
            headers,
            data: { type },
          },
        );
        handleFetchLog(date);
        toast.success('Entrada eliminada correctamente');
      } else return;
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar la entrada');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchLog(logDate);
    handleFetchProductsAndMeals();
  }, [logDate, handleFetchLog, handleFetchProductsAndMeals]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-4">
        <button
          className="btn-primary btn"
          onClick={() => {
            handleChangeDate(-1);
          }}
        >
          <FaArrowLeft />
        </button>
        <p className="font-thin text-2xl">{date || logDate}</p>
        <button
          className="btn-primary btn"
          onClick={() => {
            handleChangeDate(+1);
          }}
        >
          <FaArrowRight />
        </button>
      </div>

      <button
        className="btn-plain btn py-2! px-4! border-light rounded-sm! text-sm!"
        onClick={() => setIsOpen(true)}
        disabled={isLoading}
      >
        Añadir al registro
      </button>
      {/* CURRENT DATE LOG MEALS & PRODUCTS */}
      {!log || (!log?.logMeals.length && !log?.logProducts.length) ? (
        <div className="flex flex-col items-center gap-4 justify-between">
          <div className="h-50 grid place-items-center">
            <p className="text-brand-black text-lg font-light">
              No hay nada registrado aún en esta fecha.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col p-2 gap-4">
            {!!log?.logMeals.length &&
              log?.logMeals
                ?.sort((a, b) => a.meal.title.localeCompare(b.meal.title))
                .map((logMeal) => (
                  <div
                    key={logMeal._id}
                    className="flex flex-col gap-4 border-light p-4 bg-brand-whiter rounded-sm"
                  >
                    <div className="flex items-center">
                      <p className="grow font-semibold text-center">
                        {logMeal.meal.title}
                      </p>
                      <button
                        className="self-start"
                        onClick={() => {
                          handleDeleteProductOrMealFromEntry(
                            logMeal._id,
                            'meal',
                          );
                        }}
                      >
                        <FaTrashAlt className="text-red-700 h-4 w-4" />
                      </button>
                    </div>
                    <DividerLine />
                    <div className="flex items-center gap-4 justify-between max-md:flex-col">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 grow">
                        {logMeal.meal.mealProducts.map((mealProduct) => (
                          <div
                            key={mealProduct.product._id}
                            className="flex items-center gap-4 flex-col border-light rounded-sm p-4"
                          >
                            <div className="grow flex items-center justify-center">
                              <p className="custom-ellipsis text-center text-sm">
                                {mealProduct.product.title}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Image
                                src={mealProduct.product.image || ''}
                                width={200}
                                height={200}
                                alt={mealProduct.product.title}
                                className="w-20 h-20 border-light rounded-sm"
                              />
                              <p className="text-brand-black text-center font-semibold text-sm">
                                x{' '}
                                {Number(
                                  customFixedRound(
                                    mealProduct.quantity /
                                      mealProduct.product.presentationSize,
                                    true,
                                  ),
                                ) >= 1
                                  ? customFixedRound(
                                      mealProduct.quantity /
                                        mealProduct.product.presentationSize,
                                      true,
                                    ) + ' unidades'
                                  : mealProduct.quantity + 'g'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="md:min-w-[20%] max-md:w-full">
                        <p className="text-xs text-brand-grayer text-center mb-2">
                          {logMeal.quantity}
                          {logMeal.quantity > 1 ? ' unidades' : ' unidad'}
                        </p>
                        <DividedTextLine
                          first="Calorías"
                          second={
                            customFixedRound(
                              Number(
                                logMeal.meal.mealProducts.reduce(
                                  (acc, curr) =>
                                    acc +
                                    curr.product.calories *
                                      curr.quantity *
                                      0.01,
                                  0,
                                ) * logMeal.quantity,
                              ),
                              true,
                            ) + 'kcal'
                          }
                        />
                        <DividedTextLine
                          first="Grasas"
                          second={
                            customFixedRound(
                              Number(
                                logMeal.meal.mealProducts.reduce(
                                  (acc, curr) =>
                                    acc +
                                    curr.product.fats * curr.quantity * 0.01,
                                  0,
                                ) * logMeal.quantity,
                              ),
                              true,
                            ) + 'g'
                          }
                        />
                        <DividedTextLine
                          first="Carbohidratos"
                          second={
                            customFixedRound(
                              Number(
                                logMeal.meal.mealProducts.reduce(
                                  (acc, curr) =>
                                    acc +
                                    curr.product.carbs * curr.quantity * 0.01,
                                  0,
                                ) * logMeal.quantity,
                              ),
                              true,
                            ) + 'g'
                          }
                        />
                        <DividedTextLine
                          first="Proteína"
                          second={
                            customFixedRound(
                              Number(
                                logMeal.meal.mealProducts.reduce(
                                  (acc, curr) =>
                                    acc +
                                    curr.product.protein * curr.quantity * 0.01,
                                  0,
                                ) * logMeal.quantity,
                              ),
                              true,
                            ) + 'g'
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-2">
            {!!log?.logProducts.length &&
              log?.logProducts
                ?.sort((a, b) => a.product.title.localeCompare(b.product.title))
                .map((product) => (
                  <div
                    key={product._id}
                    className="flex flex-col gap-4 border-light p-4 relative bg-brand-whiter rounded-sm"
                  >
                    <div className="flex grow items-center">
                      <p className="grow font-semibold text-center">
                        {product.product.title}
                      </p>
                      <button
                        className="self-start"
                        onClick={() => {
                          handleDeleteProductOrMealFromEntry(
                            product._id,
                            'product',
                          );
                        }}
                      >
                        <FaTrashAlt className="text-red-700 h-4 w-4" />
                      </button>
                    </div>
                    <DividerLine />
                    <div className="flex items-center gap-4 justify-between max-md:flex-col">
                      <div className="flex items-center gap-2 justify-center grow">
                        <Image
                          src={product.product.image || ''}
                          width={200}
                          height={200}
                          alt={product.product.title}
                          className="w-20 h-20 border-light rounded-sm"
                        />
                      </div>
                      <div className="md:min-w-[50%] max-md:w-full">
                        <p className="text-xs text-brand-grayer text-center mb-2">
                          {product.quantity}
                          {product.quantity > 1 ? ' unidades' : ' unidad'}
                        </p>
                        <DividedTextLine
                          first="Calorías"
                          second={
                            customFixedRound(
                              Number(
                                product.quantity *
                                  product.product.calories *
                                  0.01 *
                                  product.product.presentationSize,
                              ),
                              true,
                            ) + 'kcal'
                          }
                        />
                        <DividedTextLine
                          first="Grasas"
                          second={
                            customFixedRound(
                              Number(
                                product.quantity *
                                  product.product.fats *
                                  0.01 *
                                  product.product.presentationSize,
                              ),
                              true,
                            ) + 'g'
                          }
                        />
                        <DividedTextLine
                          first="Carbohidratos"
                          second={
                            customFixedRound(
                              Number(
                                product.quantity *
                                  product.product.carbs *
                                  0.01 *
                                  product.product.presentationSize,
                              ),
                              true,
                            ) + 'g'
                          }
                        />
                        <DividedTextLine
                          first="Proteína"
                          second={
                            customFixedRound(
                              Number(
                                product.quantity *
                                  product.product.protein *
                                  0.01 *
                                  product.product.presentationSize,
                              ),
                              true,
                            ) + 'g'
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      )}
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onClose={() => handleCloseModal()}
      >
        <div className="flex flex-col">
          {!!selectedMeals?.length ? (
            <div className="flex flex-col gap-4">
              <div className="w-fit flex justify-center self-center">
                <input
                  type="date"
                  className="input-search bg-brand-white! border! border-brand-grayer/30! rounded-xs!"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                />
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  className={clsx(
                    'btn',
                    selectedTab === 'meals' ? 'btn-primary' : 'btn-plain',
                  )}
                  onClick={() => setSelectedTab('meals')}
                >
                  Comidas
                </button>
                <button
                  className={clsx(
                    'btn',
                    selectedTab === 'products' ? 'btn-primary' : 'btn-plain',
                  )}
                  onClick={() => setSelectedTab('products')}
                >
                  Productos
                </button>
              </div>
              <div className="flex flex-col w-full gap-4 h-[25vh] overflow-y-auto">
                {selectedTab === 'meals'
                  ? selectedMeals.map((meal) => (
                      <div
                        key={meal._id}
                        className={clsx(
                          'flex border rounded-sm items-center gap-2 p-2 justify-between cursor-pointer',
                          meal.quantity > 0
                            ? 'border-brand-black bg-brand-whiter'
                            : 'border-light',
                        )}
                        onClick={() => {
                          if (meal.quantity === 0)
                            handleMealQuantity(meal._id, +1);
                          else handleMealQuantity(meal._id, 0);
                        }}
                      >
                        <p>{meal.title}</p>
                        <div className="flex items-center gap-2">
                          <button
                            className="btn btn-plain p-1! text-sm! rounded-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMealQuantity(meal._id, meal.quantity - 1);
                            }}
                            disabled={meal.quantity === 0}
                          >
                            <FaMinus />
                          </button>
                          <p>{meal.quantity}</p>
                          <button
                            className="btn btn-plain p-1! text-sm! rounded-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMealQuantity(meal._id, meal.quantity + 1);
                            }}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    ))
                  : selectedProducts.map((product) => (
                      <div
                        key={product._id}
                        className={clsx(
                          'flex border rounded-sm items-center gap-2 p-2 justify-between cursor-pointer',
                          product.quantity > 0
                            ? 'border-brand-black bg-brand-whiter'
                            : 'border-light',
                        )}
                        onClick={() => {
                          if (product.quantity === 0)
                            handleProductQuantity(product._id, 1);
                          else handleProductQuantity(product._id, 0);
                        }}
                      >
                        <p>{product.title}</p>
                        <div className="flex items-center gap-2">
                          <button
                            className="btn btn-plain p-1! text-sm! rounded-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductQuantity(
                                product._id,
                                product.quantity - 1,
                              );
                            }}
                            disabled={product.quantity === 0}
                          >
                            <FaMinus />
                          </button>
                          <p>{product.quantity}</p>
                          <button
                            className="btn btn-plain p-1! text-sm! rounded-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductQuantity(
                                product._id,
                                product.quantity + 1,
                              );
                            }}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    ))}
              </div>
              <div className="h-[10vh] overflow-y-auto border-light p-2 flex flex-col gap-2">
                <p className="font-semibold text-brand-black! text-center">
                  Fecha: {date}
                </p>
                <div className="flex flex-col gap-2 grow">
                  {!!selectedProducts.filter((sp) => sp.quantity > 0)
                    .length && (
                      <p className="font-semibold text-brand-black! text-center">
                        Productos:
                      </p>
                    ) &&
                    selectedProducts
                      .filter((sp) => sp.quantity > 0)
                      .map((sp) => (
                        <div key={sp._id}>
                          <DividedTextLine
                            first={sp.title}
                            second={'x' + sp.quantity}
                          />
                        </div>
                      ))}
                  {!!selectedMeals.filter((sm) => sm.quantity > 0) && (
                      <p className="font-semibold text-brand-black! text-center">
                        Comidas:
                      </p>
                    ) &&
                    selectedMeals
                      .filter((sm) => sm.quantity > 0)
                      .map((sm) => (
                        <div key={sm._id}>
                          <DividedTextLine
                            first={sm.title}
                            second={'x' + sm.quantity}
                          />
                        </div>
                      ))}
                  {!selectedMeals.filter((sm) => sm.quantity > 0).length &&
                    !selectedProducts.filter((sp) => sp.quantity > 0)
                      .length && (
                      <div className="text-center grow flex items-center justify-center">
                        <p>Agregá algún producto o comida.</p>
                      </div>
                    )}
                </div>
              </div>
              <div className="flex items-center gap-4 self-center">
                <button className="btn btn-plain" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button
                  className="btn-primary btn"
                  onClick={handleCreateLog}
                  disabled={
                    (selectedMeals.every((meal) => meal.quantity === 0) &&
                      selectedProducts.every(
                        (product) => product.quantity === 0,
                      )) ||
                    isLoading ||
                    !date
                  }
                >
                  Crear registro
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-brand-grayer">
                No hay comidas para mostrar. Creá alguna en la sección de
                productos.
              </p>
              <Link href="/productos">Productos</Link>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LogList;
