import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();
    if (!email || !password || !firstName || !lastName)
      return Response.json({ message: 'Missing data' }, { status: 400 });

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      return Response.json({ message: 'User already exists' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    const { password: _, ...userDataSansPassword } = user;

    return Response.json(
      {
        message: 'User created successfully',
        user: userDataSansPassword,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: 'Error creating user', error },
      { status: 500 },
    );
  }
}
