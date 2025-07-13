'use client';
import DividedTextLine from '@/components/DividedTextLine';
import Modal from '@/components/Modal';
import { useLoadingContext } from '@/contexts/LoadingContext';
import useAuth from '@/hooks/useAuth';
import { useModal } from '@/hooks/useModal';
import { getUserData } from '@/lib/userData';
import { useProductStore } from '@/store/productStore';
import { ProductWithQuantity } from '@/types/types';
import axios from 'axios';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';

const ProductsCalculatorList = () => {
  const {
    products: cartProducts,
    clearProductsStore,
    removeProductFromStore,
    editProductInStore,
  } = useProductStore();
  const { isLoading, setIsLoading } = useLoadingContext();

  const [products, setProducts] = useState<ProductWithQuantity[]>(cartProducts);
  const [mealName, setMealName] = useState('');
  const { getHeaders } = useAuth();

  const { isOpen, setIsOpen } = useModal();

  useEffect(() => {
    setProducts(
      cartProducts.map((prod) => ({
        ...prod,
        quantity: prod.quantity ?? prod.presentationSize,
        quantityType: prod.quantityType ?? 'relative',
      })),
    );
  }, [cartProducts]);

  const handleCreateMeal = async () => {
    setIsLoading(true);
    try {
      const headers = await getHeaders();
      await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + '/meals',
        {
          title: mealName,
          user: getUserData().id,
          mealProducts: products.map((prod) => ({
            product: prod._id,
            quantity: prod.quantity,
          })),
        },
        { headers },
      );
      clearProductsStore();
      toast.success('Comida creada correctamente');
      window.location.href = '/comidas';
    } catch (error) {
      toast.error('Error al crear la comida');
      console.error(error);
    } finally {
      handleCloseModal();
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setMealName('');
  };

  const handleChangeQuantity = (id: string, value: string) => {
    const newQuantity = Number(value);
    let updatedProduct;
    setProducts((prev) =>
      prev.map((product) => {
        if (product._id === id) {
          updatedProduct = { ...product, quantity: newQuantity };
          return updatedProduct;
        }
        return product;
      }),
    );
    if (updatedProduct) {
      editProductInStore(updatedProduct);
    }
  };

  const handleChangeQuantityType = (
    id: string,
    value: 'absolute' | 'relative',
  ) => {
    let updatedProduct;
    setProducts((prev) =>
      prev.map((product) => {
        if (product._id === id) {
          if (value === 'relative') {
            updatedProduct = {
              ...product,
              quantityType: value,
              quantity: product.presentationSize,
            };
          } else {
            updatedProduct = {
              ...product,
              quantityType: value,
            };
          }
          return updatedProduct;
        }
        return product;
      }),
    );
    if (updatedProduct) {
      editProductInStore(updatedProduct);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        className="flex flex-col gap-5"
        onClose={handleCloseModal}
      >
        <p className="subtitle">¿Nombre de la comida?</p>
        <input
          type="text"
          className="input"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          placeholder="Ej: Arroz con cosas..."
        />
        <div className="flex gap-5 items-center">
          <button className="btn btn-plain" onClick={handleCloseModal}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleCreateMeal}
            disabled={!mealName || isLoading}
          >
            Confirmar
          </button>
        </div>
      </Modal>
      {!!products.length ? (
        <div className="flex flex-col gap-4 grow">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 max-md:max-h-[50vh] max-h-[55vh] overflow-y-auto pb-10">
            {products.map((product: ProductWithQuantity) => (
              // EACH PRODUCT
              <div
                key={product._id}
                className={clsx(
                  'border rounded-sm p-4 pt-6 bg-brand-whiter shadow-xl flex flex-col gap-2 text-black border-brand-grayer/20 relative',
                )}
              >
                <button
                  className="absolute top-0 right-0 btn-secondary p-0.5 rounded-bl-lg"
                  onClick={() => removeProductFromStore(product._id)}
                >
                  <MdClose className="w-5 h-5" />
                </button>
                <div className="flex flex-col grow gap-2">
                  <div className="grow">
                    <p className="font-thin text-center text-sm md:text-base custom-ellipsis">
                      {product.title}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-center">
                      <Image
                        src={product.image || ''}
                        alt={product.title}
                        width={100}
                        height={100}
                        className="w-20 h-20 md:w-32 md:h-32 rounded-xs border border-brand-grayer/10"
                      />
                    </div>

                    {/* Quantity section */}
                    <div className="flex flex-col gap-2">
                      <div className="space-y-1">
                        <p className="font-light md:text-lg! text-xs text-center">
                          Cantidad:
                        </p>
                        <p className="font-light md:text-lg! text-xs text-center">
                          {`${product.quantity.toFixed()}g${
                            product.quantity !== product.presentationSize
                              ? ` (de ${product.presentationSize.toFixed()}g)`
                              : ''
                          }`}
                        </p>
                      </div>

                      <div className="flex max-md:flex-col gap-2">
                        <button
                          className={clsx(
                            'grow border rounded-xs p-1 transition-colors cursor-pointer',
                            product.quantityType === 'relative'
                              ? 'bg-brand-black text-white border-brand-black'
                              : 'border-brand-grayer',
                          )}
                          onClick={() =>
                            product.quantityType === 'relative'
                              ? null
                              : handleChangeQuantityType(
                                  product._id,
                                  'relative',
                                )
                          }
                        >
                          Relativa
                        </button>
                        <button
                          className={clsx(
                            'grow border rounded-xs p-1 transition-colors cursor-pointer',
                            product.quantityType === 'absolute'
                              ? 'bg-brand-black text-white border-brand-black'
                              : 'border-brand-grayer',
                          )}
                          onClick={() =>
                            product.quantityType === 'absolute'
                              ? null
                              : handleChangeQuantityType(
                                  product._id,
                                  'absolute',
                                )
                          }
                        >
                          Absoluta
                        </button>
                      </div>
                      {product.quantityType === 'relative' ? (
                        <select
                          className="input"
                          value={product.quantity}
                          onChange={(e) =>
                            handleChangeQuantity(product._id, e.target.value)
                          }
                        >
                          <option value={(1 / 6) * product.presentationSize}>
                            1/6 - 16%
                          </option>
                          <option value={(1 / 5) * product.presentationSize}>
                            1/5 - 20%
                          </option>
                          <option value={(1 / 4) * product.presentationSize}>
                            1/4 - 25%
                          </option>
                          <option value={(1 / 3) * product.presentationSize}>
                            1/3 - 33%
                          </option>
                          <option value={(1 / 2) * product.presentationSize}>
                            1/2 - 50%
                          </option>
                          <option value={(2 / 3) * product.presentationSize}>
                            2/3 - 66%
                          </option>
                          <option value={(3 / 4) * product.presentationSize}>
                            3/4 - 75%
                          </option>
                          <option value={1 * product.presentationSize}>
                            1 unidad
                          </option>
                          <option value={2 * product.presentationSize}>
                            2 unidades
                          </option>
                          <option value={3 * product.presentationSize}>
                            3 unidades
                          </option>
                          <option value={4 * product.presentationSize}>
                            4 unidades
                          </option>
                          <option value={5 * product.presentationSize}>
                            5 unidades
                          </option>
                        </select>
                      ) : (
                        <input
                          type="number"
                          className="input"
                          value={product.quantity}
                          onChange={(e) =>
                            handleChangeQuantity(product._id, e.target.value)
                          }
                        />
                      )}
                    </div>

                    {/* Macros summary section */}
                    <DividedTextLine
                      first="Calorías: "
                      second={`${(
                        product.calories *
                        product.quantity *
                        0.01
                      ).toFixed(1)}kcal`}
                    />
                    <DividedTextLine
                      first="Grasas: "
                      second={`${(
                        product.fats *
                        product.quantity *
                        0.01
                      ).toFixed(1)}g`}
                    />
                    <DividedTextLine
                      first="Carbohidratos: "
                      second={`${(
                        product.carbs *
                        product.quantity *
                        0.01
                      ).toFixed(1)}g`}
                    />
                    <DividedTextLine
                      first="Proteínas: "
                      second={`${(
                        product.protein *
                        product.quantity *
                        0.01
                      ).toFixed(1)}g`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grow"></div>
          <Summary
            openModal={() => setIsOpen(true)}
            clearProductsStore={clearProductsStore}
            products={products}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-10">
          <p className="text-center text-sm md:text-base">
            Aún no tenés productos para calcular, agregá alguno para comenzar
          </p>
          <Link href="/productos" className="btn btn-plain">
            Ir a productos
          </Link>
        </div>
      )}
    </>
  );
};

const Summary = ({
  openModal,
  clearProductsStore,
  products,
  isLoading,
}: {
  openModal: () => void;
  clearProductsStore: () => void;
  products: ProductWithQuantity[];
  isLoading: boolean;
}) => {
  const calculateTotalMacros = (
    field: 'calories' | 'protein' | 'carbs' | 'fats',
  ) => {
    return Number(
      products.reduce(
        (acc, curr) => curr[field] * curr.quantity * 0.01 + acc,
        0,
      ),
    ).toFixed(1);
  };

  return (
    <div className="p-4 md:p-4 border bg-brand-whiter border-brand-grayer/20 rounded-sm flex flex-col gap-4 md:gap-6 shadow-xl">
      <p className=" text-lg md:text-2xl font-thin text-center text-brand-pink">
        Resumen
      </p>
      <div className="flex gap-4 md:gap-10">
        <div className="grow max-md:text-sm font-light flex flex-col justify-between">
          <DividedTextLine
            className="md:text-lg! text-brand-blacker!"
            first="Calorías:"
            second={`${calculateTotalMacros('calories')}kcal`}
          />
          <DividedTextLine
            className="md:text-lg! text-brand-blacker!"
            first="Grasas:"
            second={`${calculateTotalMacros('fats')}g`}
          />
          <DividedTextLine
            className="md:text-lg! text-brand-blacker!"
            first="Carbohidratos:"
            second={`${calculateTotalMacros('carbs')}g`}
          />
          <DividedTextLine
            className="md:text-lg! text-brand-blacker!"
            first="Proteínas:"
            second={`${calculateTotalMacros('protein')}g`}
          />
        </div>
        <div className="flex flex-col gap-4">
          <button
            className="btn btn-primary max-md:text-xs!"
            onClick={openModal}
            disabled={isLoading}
          >
            Crear comida
          </button>
          <button
            className="btn btn-plain max-md:text-xs!"
            onClick={() => {
              clearProductsStore();
              location.href = '/calculadora';
            }}
          >
            Vaciar calculadora
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsCalculatorList;
