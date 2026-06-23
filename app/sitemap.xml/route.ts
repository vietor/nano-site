import { NextRequest } from 'next/server';
import { getPagedPublishedPosts } from '@/app/lib/model';
import { baseUrl } from '@/app/lib/url';

export async function GET(request: NextRequest) {
  const base = baseUrl(request);
  const { posts } = getPagedPublishedPosts(1, 1000);

  const urls = [
    `  <url><loc>${base}/</loc></url>`,
    ...posts.map(p => `  <url><loc>${base}/post/${p.id}</loc><lastmod>${new Date(p.updatedAt).toISOString()}</lastmod></url>`),
  ].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
