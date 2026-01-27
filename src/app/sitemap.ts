import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.myjurist.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl || 'https://www.myjurist.io';
  
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

  return routes.map((route) => {
    const url = route === '' ? baseUrl : `${baseUrl}${route}`;
    return {
      url: url,
      lastModified: new Date(),
      changeFrequency: (route === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: route === '' ? 1.0 : 0.8,
    };
  });
}
