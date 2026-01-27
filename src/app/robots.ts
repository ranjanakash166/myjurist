import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myjurist.com';

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
