import { checkAuthServer } from '@/actions/authActions';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
type Params = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { headers } = await checkAuthServer();
    const { id } = await params;
    const { type } = await request.json();
    const response = await axios.delete(
      process.env.BACKEND_URL + '/logs/' + id,
      { headers, data: { type } },
    );
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error al eliminar la entrada', error },
      { status: 500 },
    );
  }
}
