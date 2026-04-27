import { NextResponse } from 'next/server';
import { loadConfig } from '@/app/lib/model';

export async function GET() {
  const config = loadConfig();
  return NextResponse.json(config);
}
