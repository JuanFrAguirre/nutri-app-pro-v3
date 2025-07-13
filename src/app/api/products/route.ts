import { checkAuthServer } from '@/actions/authActions';
import axios from 'axios';
import { NextRequest } from 'next/server';

export async function GET(_request: NextRequest) {
  const { headers } = await checkAuthServer();
  try {
    const response = await axios.get(process.env.BACKEND_URL + '/products', {
      headers,
    });
    return Response.json(response.data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: 'Error al obtener los productos', error },
      { status: 500 },
    );
  }
}
