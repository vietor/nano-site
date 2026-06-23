import { NextRequest } from 'next/server';
import { loadConfig, getPagedPublishedPosts } from '@/app/lib/model';
import { baseUrl } from '@/app/lib/url';

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] as string));
}

export async function GET(request: NextRequest) {
  const config = loadConfig();
  const base = baseUrl(request);
  const { posts } = getPagedPublishedPosts(1, 50);

  const items = posts.map(p => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${base}/post/${p.id}</link>
      <guid>${base}/post/${p.id}</guid>
      <pubDate>${new Date(p.createdAt).toUTCString()}</pubDate>
      <description>${escapeXml(p.content.slice(0, 300))}</description>
    </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(config.title)}</title>
    <link>${base}</link>
    <description>${escapeXml(config.description)}</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
