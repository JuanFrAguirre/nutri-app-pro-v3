import axios from 'axios';
import { checkAuthServer } from './authActions';
import {
  Log,
  LogForPOST,
  LogMealForPOST,
  LogProductForPOST,
} from '@/types/types';

export const getLog = async (date?: string): Promise<Log | null> => {
  const { headers } = await checkAuthServer();
  const dateToSend = date || new Date().toISOString().split('T')[0];
  console.log(process.env.BACKEND_URL + '/logs?date=' + dateToSend);
  try {
    const response = await axios.get(
      process.env.BACKEND_URL + '/logs?date=' + dateToSend,
      {
        headers,
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createLog = async (
  date: string,
  meals: LogMealForPOST[],
  products: LogProductForPOST[],
) => {
  try {
    const { headers, userId } = await checkAuthServer();
    if (!userId) {
      throw new Error('User not found');
    }
    const data: LogForPOST = {
      date: new Date(date).toISOString(),
      user: userId,
      logMeals: meals,
      logProducts: products,
    };
    const response = await axios.post(process.env.BACKEND_URL + '/logs', data, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
