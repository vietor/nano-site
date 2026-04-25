import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/model';

export async function GET() {
  const session = await getSession();
  if (session) {
    return NextResponse.json({ user: session });
  }
  return NextResponse.json({ user: null });
}
