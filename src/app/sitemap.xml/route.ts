import { NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.myjurist.io';

export async function GET() {
  const routes = [
    '',
    '/login',
    '/request-demo',
    '/contact',
    '/app/legal-research',
    '/app/document-analysis',
    '/app/regulatory-compliance',
    '/app/smart-document-studio',
    '/app/timeline-extractor',
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((route) => {
    const url = `${siteUrl}${route}`;
    const changeFreq = route === '' ? 'weekly' : 'monthly';
    const priority = route === '' ? '1.0' : '0.8';
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  });
}
