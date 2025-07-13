import { createLog, getLog } from '@/actions/logsActions';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const logs = await getLog(date || undefined);
  return NextResponse.json(logs);
}

export async function POST(request: NextRequest) {
  try {
    const { date, meals, products } = await request.json();
    const response = await createLog(date, meals, products);
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Error al crear el registro', error },
      { status: 500 },
    );
  }
}
