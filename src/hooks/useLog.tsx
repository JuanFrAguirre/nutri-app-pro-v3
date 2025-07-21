'use client';
import { useLoadingContext } from '@/contexts/LoadingContext';
import { useAxios } from '@/lib/axios';
import { Log, MealWithQuantity, ProductWithQuantity } from '@/types/types';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const useLog = () => {
  const api = useAxios();
  const { setIsLoading } = useLoadingContext();
  // const [date, setDate] = useState<string>(trimDate(new Date()));
  const [_log, setLog] = useState<Log | null>(null);
  const [products, setProducts] = useState<ProductWithQuantity[]>([]);
  const [meals, setMeals] = useState<MealWithQuantity[]>([]);

  const getLog = useCallback(
    async (date: string) => {
      try {
        setIsLoading(true);
        console.log(`/logs?date=${date}`);
        const response = await api.get(`/logs?date=${date}`);
        console.log(response.data);
        setLog(response.data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return;
        }
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [api, setIsLoading],
  );

  const getMealsAndProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const mealsResponse = await api.get(`/meals`);
      const productsResponse = await api.get(`/products`);
      setMeals(mealsResponse.data);
      setProducts(productsResponse.data);
    } catch (error) {
      console.error(error);
      toast.error('Error al obtener las comidas y productos');
    } finally {
      setIsLoading(false);
    }
  }, [api, setIsLoading]);

  const updateSelectedMealsAndProducts = useCallback(
    (id: string, type: 'meal' | 'product', quantity: number) => {
      if (type === 'meal') {
        const meal = meals.find((meal) => meal._id === id);
        if (meal) {
          setMeals(
            meals.map((m) =>
              m._id === id ? { ...m, quantity: m.quantity + quantity } : m,
            ),
          );
        }
      } else if (type === 'product') {
        const product = products.find((product) => product._id === id);
        if (product) {
          setProducts(
            products.map((p) =>
              p._id === id ? { ...p, quantity: p.quantity + quantity } : p,
            ),
          );
        }
      }
    },
    [meals, products],
  );

  useEffect(() => {
    getMealsAndProducts();
  }, [getMealsAndProducts]);

  return { getLog, products, meals, updateSelectedMealsAndProducts };
};

export default useLog;
