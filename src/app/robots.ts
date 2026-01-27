import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.myjurist.io';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/app/dashboard', '/app/*/chat'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
