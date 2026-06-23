import type { NextRequest } from 'next/server';

export function baseUrl(request: NextRequest): string {
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost';
  return `${proto}://${host}`;
}
