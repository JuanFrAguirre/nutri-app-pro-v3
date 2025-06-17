import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user)
      return Response.json(
        { message: 'Usuario no encontrado' },
        { status: 404 },
      );
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return Response.json(
        { message: 'Credenciales incorrectas' },
        { status: 401 },
      );

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
    const token = await new SignJWT({ id: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(secret);

    const cookieStore = await cookies();
    cookieStore.set('Authorization', `Bearer ${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1 * 60 * 60,
      path: '/',
    });
    return Response.json({ message: 'Login successful', user, token });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: 'Error al iniciar sesión', error },
      { status: 500 },
    );
  }
}
