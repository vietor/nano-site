import { NextRequest } from 'next/server';
import { baseUrl } from '@/app/lib/url';

export async function GET(request: NextRequest) {
  const base = baseUrl(request);

  const body = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${base}/sitemap.xml`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
