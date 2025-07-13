import { checkAuthServer } from '@/actions/authActions';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const isLoggedIn = await checkAuthServer();
  if (isLoggedIn) {
    redirect('/registros?date=' + new Date().toISOString().split('T')[0]);
  } else redirect('/iniciar-sesion');
}
