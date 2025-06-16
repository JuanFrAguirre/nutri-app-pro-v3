import { useEffect, useState } from 'react';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkAuth = async () => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=').map((c) => c.trim());
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    const token = cookies.Authorization;
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    // check cookies for Authorization
    checkAuth();
  }, []);
  return { isLoggedIn, checkAuth };
};

export default useAuth;
