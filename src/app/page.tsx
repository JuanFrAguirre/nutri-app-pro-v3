import { checkAuthServer } from '@/actions/authActions';
import { redirect } from 'next/navigation';

export default async function Home() {
  const isLoggedIn = await checkAuthServer();
  if (isLoggedIn) {
    redirect('/registros');
  } else redirect('/iniciar-sesion');
}
