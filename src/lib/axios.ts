'use client';
import useAuth from '@/hooks/useAuth';
import axios, { type AxiosRequestHeaders } from 'axios';
import { useMemo } from 'react';

export const useAxios = () => {
  const { getHeaders } = useAuth();

  const api = useMemo(
    () =>
      axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
        withCredentials: true,
      }),
    [],
  );

  api.interceptors.request.use(async (config) => {
    const headers = await getHeaders();
    config.headers = headers as AxiosRequestHeaders;
    return config;
  });

  return api;
};
