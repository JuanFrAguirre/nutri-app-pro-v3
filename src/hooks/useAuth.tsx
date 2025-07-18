'use client';
import { User } from '@/types/types';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState('');

  const checkAuth = async () => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=').map((c) => c.trim());
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    const token = cookies.Authorization;
    const user = cookies.User;
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    if (user) {
      setUser(decodeURIComponent(user));
    }
    return token.split('%20').join(' ');
  };

  const getUser = useCallback(async () => {
    return JSON.parse(user);
  }, [user]);

  const getHeaders = useCallback(async () => {
    const token = await checkAuth();
    return {
      Authorization: token,
      'Content-Type': 'application/json',
    };
  }, []);

  useEffect(() => {
    checkAuth();
  }, []);
  return { isLoggedIn, checkAuth, getHeaders, getUser };
};

export const useGetUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const { getHeaders } = useAuth();
  useEffect(() => {
    const getUser = async () => {
      try {
        const headers = await getHeaders();
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/me',
          {
            headers,
          },
        );
        setUser(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Error al obtener datos del usuario');
      }
    };
    getUser();
  }, [getHeaders]);

  return { user };
};

export default useAuth;
