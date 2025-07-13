import axios from 'axios';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();
    if (!email || !password || !firstName || !lastName)
      return Response.json({ message: 'Missing data' }, { status: 400 });

    await axios.post(process.env.BACKEND_URL + '/auth/signup', {
      email,
      password,
      firstName,
      lastName,
    });

    return Response.json(
      {
        message: 'User created successfully',
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
