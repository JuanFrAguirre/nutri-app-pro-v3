import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete('Authorization');
  redirect('/iniciar-sesion');
}
