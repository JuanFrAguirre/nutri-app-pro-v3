import { useCallback, useEffect, useState } from 'react';

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

export default useAuth;
