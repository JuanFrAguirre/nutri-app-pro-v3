'use client';
import { useLoadingContext } from '@/contexts/LoadingContext';
import { useAxios } from '@/lib/axios';
import { Log } from '@/types/types';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const START_DATE = new Date();
const END_DATE = new Date();
START_DATE.setDate(START_DATE.getDate() - 7);

export const useDashboardLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const { setIsLoading } = useLoadingContext();
  const api = useAxios();
  const [startDate, setStartDate] = useState(START_DATE);
  const [endDate, setEndDate] = useState(END_DATE);

  const getLogs = useCallback(
    async (startDate: Date, endDate: Date) => {
      try {
        setIsLoading(true);
        const response = await api.get(
          `/logs/range?startDate=${
            startDate.toISOString().split('T')[0]
          }&endDate=${endDate.toISOString().split('T')[0]}`,
        );
        console.log(response.data);
        setLogs(response.data);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          console.log('No hay registros para esta fecha');
          return;
        }
        console.error(error);
        toast.error('Error al obtener los registros');
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, api],
  );

  useEffect(() => {
    getLogs(startDate, endDate);
  }, [getLogs, startDate, endDate]);

  return { logs, startDate, endDate, setStartDate, setEndDate };
};
