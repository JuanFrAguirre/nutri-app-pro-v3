import { checkAuthServer } from '@/actions/authActions';
import axios from 'axios';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { headers } = await checkAuthServer();
  try {
    const data = await request.json();
    console.log(data);
    const response = await axios.post(
      process.env.BACKEND_URL + '/meals',
      data,
      {
        headers,
      },
    );
    return Response.json(response.data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: 'Error al crear la comida', error },
      { status: 500 },
    );
  }
}

export async function GET(_request: NextRequest) {
  const { headers } = await checkAuthServer();
  try {
    const response = await axios.get(process.env.BACKEND_URL + '/meals', {
      headers,
    });
    return Response.json(response.data);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: 'Error al obtener las comidas', error },
      { status: 500 },
    );
  }
}
