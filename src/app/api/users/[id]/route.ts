import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id } });
    return Response.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: 'Error deleting user', error },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const userId = request.headers.get('x-user-id');
    const { id } = await params;
    if (userId !== id) {
      return Response.json(
        {
          message:
            'Unauthorized, authorized user does not match requested user',
        },
        { status: 401 },
      );
    }

    const user = await prisma.user.findFirst({
      where: { id },
    });
    return Response.json(user);
  } catch (error) {
    return Response.json(
      { message: 'Failed to fetch user', error },
      { status: 500 },
    );
  }
}
