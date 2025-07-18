'use client';

import DividedTextLine from '@/components/DividedTextLine';
import DividerLine from '@/components/DividerLine';
import Modal from '@/components/Modal';
import { useLoadingContext } from '@/contexts/LoadingContext';
import { useModal } from '@/hooks/useModal';
import { useAxios } from '@/lib/axios';
import { getUserData } from '@/lib/userData';
import {
  customFixedRound,
  getTotalMacros,
  macrosIndexed,
  macrosKeys,
} from '@/lib/utils';
import {
  Log,
  Meal,
  MealWithQuantity,
  Product,
  ProductWithQuantity,
} from '@/types/types';
import { AxiosError } from 'axios';
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
import { LuCalendarPlus } from 'react-icons/lu';
import { toast } from 'react-toastify';

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
  const api = useAxios();

  const [date, setDate] = useState<string>(logDate);
  const [log, setLog] = useState<Log | null>(null);
  // const [bufferLogs, setBufferLogs] = useState<Log[]>([]);
  // const [isFirstLoad, setIsFirstLoad] = useState(true);
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
        setIsLoading(true);
        setLog(null);
        const response = await api.get(`/logs?date=${date}`);
        console.log(response.data);
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
    [setIsLoading, api],
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
      const user = await getUserData();
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
      await api.post('/logs', {
        date,
        user: user.id,
        logMeals: mealsToCreate,
        logProducts: productsToCreate,
      });
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
      const [productsResponse, mealsResponse] = await Promise.all([
        api.get('/products'),
        api.get('/meals'),
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
  }, [api]);

  const handleDeleteProductOrMealFromEntry = useCallback(
    async (id: string, type: 'product' | 'meal') => {
      try {
        if (confirm('¿Estás seguro de querer eliminar esta entrada?')) {
          setIsLoading(true);
          await api.delete(`/logs/${id}`, { data: { type } });
          handleFetchLog(date);
          toast.success('Entrada eliminada correctamente');
        } else return;
      } catch (error) {
        console.error(error);
        toast.error('Error al eliminar la entrada', { autoClose: false });
      } finally {
        setIsLoading(false);
      }
    },
    [date, handleFetchLog, setIsLoading, api],
  );

  const handleUpdateProductOrMealQuantityFromEntry = useCallback(
    async (id: string, type: 'product' | 'meal', quantity: number) => {
      try {
        setIsLoading(true);
        await api.put(`/logs/${id}/quantity`, { type, quantity });
        handleFetchLog(date);
        toast.success('Cantidad actualizada correctamente');
      } catch (error) {
        console.error(error);
        toast.error('Error al actualizar la cantidad');
      } finally {
        setIsLoading(false);
      }
    },
    [date, handleFetchLog, setIsLoading, api],
  );

  useEffect(() => {
    handleFetchLog(logDate);
    handleFetchProductsAndMeals();
  }, [logDate, handleFetchLog, handleFetchProductsAndMeals]);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* DATE SELECTOR */}
      <div className="flex items-center gap-4">
        <button
          className="btn-primary btn"
          onClick={() => {
            handleChangeDate(-1);
          }}
        >
          <FaArrowLeft />
        </button>
        <p className="font-thin text-2xl text-brand-pink">{date || logDate}</p>
        <button
          className="btn-primary btn"
          onClick={() => {
            handleChangeDate(+1);
          }}
        >
          <FaArrowRight />
        </button>
      </div>

      {/* ADD TO LOG BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        disabled={isLoading}
        className="fixed max-md:bottom-28 right-6 bg-brand-whiter border border-brand-black p-1 rounded-sm shadow-xl shadow-brand-black/20 md:top-28 md:right-6"
      >
        <LuCalendarPlus
          className={clsx(
            'w-10 h-10 md:w-12 md:h-12 transition-all duration-500',
          )}
        />
      </button>
      {/* CURRENT DATE LOG MEALS & PRODUCTS */}
      {!log || (!log?.logMeals.length && !log?.logProducts.length) ? (
        // NO LOG
        <div className="flex flex-col items-center gap-4 justify-between">
          <div className="h-50 grid place-items-center">
            <p className="text-brand-black text-lg font-light">
              No hay nada registrado aún en esta fecha.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="max-h-[50vh] pb-5 mb-3 md:mb-5 overflow-y-auto">
            {/* LOG MEALS */}
            <div className="flex flex-col p-2 gap-4 xl:grid xl:grid-cols-2">
              {!!log?.logMeals.length &&
                log?.logMeals
                  ?.sort((a, b) => a.meal.title.localeCompare(b.meal.title))
                  .map((logMeal) => (
                    <div
                      key={logMeal._id}
                      className="flex flex-col max-md:gap-3 gap-4 border-light p-4 bg-brand-whiter rounded-sm shadow-xl"
                    >
                      <div className="h-12! flex items-center">
                        <p className="grow font-semibold max-md:text-sm max-md:leading-none! text-center custom-ellipsis">
                          {logMeal.meal.title}
                        </p>
                      </div>
                      <DividerLine />
                      <div className="items-center max-md:gap-3 gap-4 justify-between max-md:flex-col">
                        <div
                          className={clsx(
                            'grid  grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 max-md:gap-3 gap-4 md:grow max-md:overflow-x-auto md:overflow-y-auto max-h-[450px]',
                          )}
                        >
                          {logMeal.meal.mealProducts.map((mealProduct) => (
                            <div
                              key={mealProduct.product._id}
                              className="max-md:basis-[45%] flex items-center max-md:gap-3 gap-4 flex-col border-light rounded-sm p-4 shadow-md"
                            >
                              <div className="grow flex items-center justify-center">
                                <p className="custom-ellipsis text-center text-sm ">
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
                        <div className="md:min-w-[20%] xl:min-w-[30%] max-md:w-full self-stretch flex flex-col justify-start max-md:flex-col-reverse max-md:gap-3 gap-4">
                          <div className="flex flex-col justify-center md:items-center">
                            <div className="flex flex-col-reverse max-md:flex-row justify-between items-center max-md:gap-3 gap-4 grow">
                              <div className="flex gap-2 max-md:justify-between grow">
                                <button
                                  onClick={() => {
                                    if (logMeal.quantity === 1)
                                      handleDeleteProductOrMealFromEntry(
                                        logMeal._id,
                                        'meal',
                                      );
                                    else
                                      handleUpdateProductOrMealQuantityFromEntry(
                                        logMeal._id,
                                        'meal',
                                        logMeal.quantity - 1,
                                      );
                                  }}
                                  className={clsx(
                                    'btn rounded-sm! btn-primary',
                                  )}
                                >
                                  {logMeal.quantity === 1 ? (
                                    <FaTrashAlt className="w-5 h-5" />
                                  ) : (
                                    <FaMinus className="w-5 h-5" />
                                  )}
                                </button>
                                <p className="md:hidden font-semibold md:text-lg text-center text-brand-gray self-center">
                                  {customFixedRound(logMeal.quantity, true)}
                                  {logMeal.quantity > 1
                                    ? ' unidades'
                                    : ' unidad'}
                                </p>
                                <button
                                  onClick={() => {
                                    handleUpdateProductOrMealQuantityFromEntry(
                                      logMeal._id,
                                      'meal',
                                      logMeal.quantity + 1,
                                    );
                                  }}
                                  className="btn btn-primary rounded-sm!"
                                >
                                  <FaPlus className="w-5 h-5" />
                                </button>
                              </div>
                              <p className="max-md:hidden font-semibold md:text-lg text-center text-brand-gray">
                                {customFixedRound(logMeal.quantity, true)}
                                {logMeal.quantity > 1 ? ' unidades' : ' unidad'}
                              </p>
                            </div>
                          </div>
                          <div className="border-light p-2">
                            {macrosKeys.map((mk) => (
                              <DividedTextLine
                                key={mk}
                                first={macrosIndexed[mk].label}
                                second={
                                  customFixedRound(
                                    Number(
                                      getTotalMacros('logMeal', [logMeal])[mk],
                                    ),
                                    true,
                                  ) + macrosIndexed[mk].unit
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>

            {/* LOG PRODUCTS */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-md:gap-3 gap-4 p-2">
              {!!log?.logProducts.length &&
                log?.logProducts
                  ?.sort((a, b) =>
                    a.product.title.localeCompare(b.product.title),
                  )
                  .map((product) => (
                    <div
                      key={product._id}
                      className="flex flex-col max-md:gap-3 gap-4 border-light p-4 relative bg-brand-whiter rounded-sm shadow-xl"
                    >
                      <p className="grow font-semibold max-md:text-sm max-md:leading-none! text-center custom-ellipsis">
                        {product.product.title}
                      </p>
                      <DividerLine />
                      <div className="flex items-center max-md:gap-3 gap-4 justify-between max-md:flex-col">
                        <div className="flex items-center gap-2 justify-between grow">
                          <Image
                            src={product.product.image || ''}
                            width={200}
                            height={200}
                            alt={product.product.title}
                            className="w-20 h-20 border-light rounded-sm"
                          />
                        </div>
                        <div className="md:min-w-[50%] max-md:w-full">
                          {macrosKeys.map((mk) => (
                            <DividedTextLine
                              key={mk}
                              first={macrosIndexed[mk].label}
                              second={
                                customFixedRound(
                                  Number(
                                    getTotalMacros('logProduct', [product])[mk],
                                  ),
                                  true,
                                ) + macrosIndexed[mk].unit
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="font-semibold md:text-lg text-center text-brand-gray md:hidden">
                          {customFixedRound(
                            product.quantity / product.product.presentationSize,
                            true,
                          )}
                          {product.quantity / product.product.presentationSize >
                          1
                            ? ' unidades'
                            : ' unidad'}
                        </p>
                        <div className="flex justify-between items-center mb-2">
                          <button
                            onClick={() => {
                              if (
                                product.quantity ===
                                product.product.presentationSize
                              )
                                handleDeleteProductOrMealFromEntry(
                                  product._id,
                                  'product',
                                );
                              else
                                handleUpdateProductOrMealQuantityFromEntry(
                                  product._id,
                                  'product',
                                  product.quantity -
                                    product.product.presentationSize,
                                );
                            }}
                            className={clsx(
                              'btn rounded-sm!',
                              product.quantity ===
                                product.product.presentationSize
                                ? // ? 'btn-danger-plain'
                                  'btn-primary'
                                : 'btn-primary',
                            )}
                          >
                            {product.quantity ===
                            product.product.presentationSize ? (
                              <FaTrashAlt className="w-5 h-5" />
                            ) : (
                              <FaMinus className="w-5 h-5" />
                            )}
                          </button>
                          <p className="font-semibold md:text-lg text-center text-brand-gray max-md:hidden">
                            {customFixedRound(
                              product.quantity /
                                product.product.presentationSize,
                              true,
                            )}
                            {product.quantity /
                              product.product.presentationSize >
                            1
                              ? ' unidades'
                              : ' unidad'}
                          </p>
                          <button
                            onClick={() => {
                              handleUpdateProductOrMealQuantityFromEntry(
                                product._id,
                                'product',
                                product.quantity +
                                  product.product.presentationSize,
                              );
                            }}
                            className="btn btn-primary rounded-sm!"
                          >
                            <FaPlus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          <div className="bg-brand-whiter border-light shadow-xl p-4 max-md:max-w-[75%]">
            <p className="font-semibold! text-brand-pink! text-center py-2">
              Totales diarios
            </p>
            {macrosKeys.map((mk) => (
              <DividedTextLine
                key={mk}
                first={macrosIndexed[mk].label}
                second={
                  customFixedRound(
                    Number(
                      getTotalMacros('logMeal', log?.logMeals)[mk] +
                        getTotalMacros('logProduct', log?.logProducts)[mk],
                    ),
                    true,
                  ) + macrosIndexed[mk].unit
                }
                className="text-lg! font-semibold!"
                classNameSecond="text-brand-blacker"
              />
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
                    'btn max-md:text-sm!',
                    selectedTab === 'meals' ? 'btn-primary' : 'btn-plain',
                  )}
                  onClick={() => setSelectedTab('meals')}
                >
                  Comidas
                </button>
                <button
                  className={clsx(
                    'btn max-md:text-sm!',
                    selectedTab === 'products' ? 'btn-primary' : 'btn-plain',
                  )}
                  onClick={() => setSelectedTab('products')}
                >
                  Productos
                </button>
              </div>
              <div
                className={clsx(
                  'flex flex-col w-full gap-4 h-[35vh] overflow-y-auto border-light p-2',
                  selectedTab === 'products' &&
                    'md:grid md:grid-cols-2 md:gap-x-2 md:gap-y-3',
                )}
              >
                {selectedTab === 'meals'
                  ? selectedMeals.map((meal) => (
                      <div
                        key={meal._id}
                        className={clsx(
                          'flex border rounded-sm items-center gap-2 p-2 justify-between cursor-pointer shadow max-h-20 mr-1',
                          meal.quantity > 0
                            ? 'border-brand-pink bg-brand-whiter shadow-lg'
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
                          'flex border rounded-sm items-center gap-2 p-2 cursor-pointer mr-1',
                          product.quantity > 0
                            ? 'border-brand-pink bg-brand-whiter shadow-lg'
                            : 'border-light',
                        )}
                        onClick={() => {
                          if (product.quantity === 0)
                            handleProductQuantity(
                              product._id,
                              product.presentationSize,
                            );
                          else handleProductQuantity(product._id, 0);
                        }}
                      >
                        <Image
                          src={product.image || ''}
                          width={200}
                          height={200}
                          alt={product.title}
                          className="w-14 md:w-20 h-14 md:h-20 border-light rounded-sm"
                        />
                        <p className="grow text-center max-md:text-sm">
                          {product.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            className="btn btn-plain p-1! text-sm! rounded-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductQuantity(
                                product._id,
                                (product.quantity / product.presentationSize -
                                  1) *
                                  product.presentationSize,
                              );
                            }}
                            disabled={product.quantity === 0}
                          >
                            <FaMinus />
                          </button>
                          <p>{product.quantity / product.presentationSize}</p>
                          <button
                            className="btn btn-plain p-1! text-sm! rounded-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductQuantity(
                                product._id,
                                (product.quantity / product.presentationSize +
                                  1) *
                                  product.presentationSize,
                              );
                            }}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    ))}
              </div>
              <div className="h-[25vh] border-light p-2 flex flex-col gap-2 md:gap-4">
                <p className="font-semibold md:text-lg text-center py-2">
                  Fecha: {date}
                </p>
                <div className="flex flex-col gap-2 grow overflow-y-auto">
                  {(!!selectedProducts.filter((sp) => sp.quantity > 0).length ||
                    !!selectedMeals.filter((sm) => sm.quantity > 0).length) && (
                    <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
                      {!!selectedProducts.filter((sp) => sp.quantity > 0)
                        .length && (
                          <p className="font-semibold text-brand-black! text-center">
                            Productos:
                          </p>
                        ) &&
                        selectedProducts
                          .filter((sp) => sp.quantity > 0)
                          .map((sp) => (
                            <div key={sp._id} className="p-2">
                              <DividedTextLine
                                first={sp.title}
                                second={'x' + sp.quantity / sp.presentationSize}
                              />
                            </div>
                          ))}
                      {!!selectedMeals.filter((sm) => sm.quantity > 0)
                        .length && (
                          <p className="font-semibold text-brand-black! text-center">
                            Comidas:
                          </p>
                        ) &&
                        selectedMeals
                          .filter((sm) => sm.quantity > 0)
                          .map((sm) => (
                            <div key={sm._id} className="p-2">
                              <DividedTextLine
                                first={sm.title}
                                second={'x' + sm.quantity}
                              />
                            </div>
                          ))}
                    </div>
                  )}
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
                  <p className="max-md:text-sm">Cancelar</p>
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
                  <p className="max-md:text-sm">Añadir al registro</p>
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
