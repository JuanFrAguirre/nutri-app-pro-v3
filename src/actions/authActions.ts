'use server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export async function checkAuthServer() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('Authorization')?.value;

    if (!token) {
      return { isLoggedIn: false, userId: null };
    }
    const parsedToken = token.replace('Bearer ', '');
    const headers = {
      Authorization: token,
    };

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(parsedToken, secret);
    const decoded = payload as unknown as JwtPayload;

    return {
      isLoggedIn: true,
      userId: decoded.sub,
      email: decoded.email,
      token,
      headers,
    };
  } catch (error) {
    console.error(error);
    return { isLoggedIn: false, userId: null };
  }
}
