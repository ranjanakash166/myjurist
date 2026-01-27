import { NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.myjurist.io';

export async function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /app/dashboard
Disallow: /app/*/chat

Sitemap: ${siteUrl}/sitemap.xml`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  });
}
