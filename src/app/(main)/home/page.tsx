import { checkAuthServer } from '@/actions/authActions';
import { redirect } from 'next/navigation';

const HomePage = async () => {
  const isLoggedIn = await checkAuthServer();
  if (isLoggedIn) {
    redirect('/comidas');
  } else redirect('/login');
};

export default HomePage;
