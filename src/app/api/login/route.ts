import axios from 'axios';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const signInResponse = await axios.post(
      process.env.BACKEND_URL + '/auth/signin',
      {
        email,
        password,
      },
    );
    const { token, sub, user } = signInResponse.data;

    const cookieStore = await cookies();
    cookieStore.set('Authorization', `Bearer ${token}`, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1 * 60 * 60,
      path: '/',
    });
    cookieStore.set(
      'User',
      JSON.stringify({
        id: sub,
        email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1 * 60 * 60,
        path: '/',
      },
    );
    return Response.json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: 'Error al iniciar sesión', error },
      { status: 500 },
    );
  }
}
