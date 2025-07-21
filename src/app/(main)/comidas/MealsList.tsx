'use client';
import MealItem from '@/components/MealItem';
import Modal from '@/components/Modal';
import { useLoadingContext } from '@/contexts/LoadingContext';
import { useModal } from '@/hooks/useModal';
import { useAxios } from '@/lib/axios';
import { MealWithQuantity } from '@/types/types';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import { HiPencil } from 'react-icons/hi';
import { IoRestaurant } from 'react-icons/io5';
import { toast } from 'react-toastify';

const MealsList = () => {
  const [meals, setMeals] = useState<MealWithQuantity[]>([]);
  const [mealToDelete, setMealToDelete] = useState<MealWithQuantity | null>(
    null,
  );
  const { isLoading, setIsLoading } = useLoadingContext();
  const { isOpen, setIsOpen } = useModal();
  const api = useAxios();

  const fetchMeals = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/meals');
      setMeals(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Error al obtener las comidas');
    } finally {
      setIsLoading(false);
    }
  }, [api, setIsLoading]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const handleDeleteMeal = async () => {
    try {
      setIsLoading(true);
      await api.delete(`/meals/${mealToDelete?._id}`);
      toast.success('Comida eliminada correctamente');
      await fetchMeals();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar la comida');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !meals.length) return '';

  return (
    <>
      {mealToDelete && (
        <Modal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onClose={() => setMealToDelete(null)}
          className="flex flex-col gap-4"
        >
          <p className="subtitle text-brand-blacker!">Eliminar comida</p>
          <p className="text-brand-gray text-center">
            Estás seguro de querer eliminar:
            <br />
            <span className="font-semibold text-lg">{mealToDelete?.title}</span>
            ?
          </p>
          <div className="flex gap-4 mt-4">
            <button
              className="btn btn-plain basis-1/2"
              onClick={() => {
                setIsOpen(false);
                setMealToDelete(null);
              }}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary basis-1/2"
              onClick={handleDeleteMeal}
            >
              Eliminar
            </button>
          </div>
        </Modal>
      )}
      {!!meals.length && !isLoading ? (
        <div className="flex flex-col gap-4 xl:grid grid-cols-2">
          {meals.map((meal) => (
            <MealItem
              key={meal._id}
              meal={meal}
              buttonsSection={
                <div className="flex flex-col items-stretch gap-3">
                  <button
                    className="shadow-none! btn btn-primary flex gap-2 items-center justify-center"
                    disabled
                  >
                    <HiPencil />
                    <p className="text-sm">Editar</p>
                  </button>
                  <button
                    className="shadow-none! btn btn-primary flex gap-2 items-center justify-center"
                    onClick={() => {
                      setMealToDelete(meal);
                      setIsOpen(true);
                    }}
                  >
                    <FaTrashAlt />
                    <p className="text-sm">Borrar</p>
                  </button>
                </div>
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-10 items-center justify-center grow px-6">
          <p className="subtitle text-center text-brand-black!">
            No hay comidas disponibles aún.
            <br />
            Creá algunas para comenzar a trackear tu nutrición!
          </p>
          <ul className="list-decimal list-inside flex flex-col gap-2 text-brand-gray text-sm">
            <li>Seleccioná los productos que vas a usar en la comida.</li>
            <li>
              Elegí la cantidad de cada producto que necesitespara la comida en
              la sección de calculadora.
            </li>
            <li>
              Finalmente, ponele un nombre y agregala a la lista de comidas.
            </li>
          </ul>
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
