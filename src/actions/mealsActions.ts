import axios from 'axios';
import { checkAuthServer } from './authActions';
import { Meal } from '../types/types';

export const getMeals = async (): Promise<Meal[]> => {
  const { headers } = await checkAuthServer();
  try {
    const products = await axios.get(process.env.BACKEND_URL + '/meals', {
      headers,
    });
    return products.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
