'use client';
import { useLoadingContext } from '@/contexts/LoadingContext';
import { Log } from '@/types/types';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAuth from './useAuth';

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
    async (startDate: Date, endDate: Date) => {
      try {
        setIsLoading(true);
        const headers = await getHeaders();
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL +
            `/logs/range?startDate=${
              startDate.toISOString().split('T')[0]
            }&endDate=${endDate.toISOString().split('T')[0]}`,
          {
            headers,
          },
        );
        console.log(response.data);
        setLogs(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Error al obtener los registros');
      } finally {
        setIsLoading(false);
      }
    },
    [getHeaders, setIsLoading],
  );

  useEffect(() => {
    getLogs(startDate, endDate);
  }, [getLogs, startDate, endDate]);

  return { logs, startDate, endDate, setStartDate, setEndDate };
};
