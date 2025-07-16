import { Log } from '@/types/types';
import { useCallback, useEffect, useState } from 'react';
import useAuth from './useAuth';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLoadingContext } from '@/contexts/LoadingContext';

const START_DATE = new Date();
const END_DATE = new Date();
START_DATE.setDate(START_DATE.getDate() - 7);

export const useLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const { getHeaders } = useAuth();
  const { setIsLoading } = useLoadingContext();
  const [startDate, setStartDate] = useState(START_DATE);
  const [endDate, setEndDate] = useState(END_DATE);

  const getLogs = useCallback(
    async (startDate: string, endDate: string) => {
      try {
        setIsLoading(true);
        const headers = await getHeaders();
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL +
            `/logs/range?startDate=${startDate}&endDate=${endDate}`,
          {
            headers,
          },
        );
        setLogs(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Error al obtener los logs');
      } finally {
        setIsLoading(false);
      }
    },
    [getHeaders, setIsLoading],
  );

  useEffect(() => {
    getLogs(startDate.toISOString(), endDate.toISOString());
  }, [getLogs, startDate, endDate]);

  return { logs, startDate, endDate, setStartDate, setEndDate };
};
