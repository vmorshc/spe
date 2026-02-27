import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/app/', '/auth/', '/system/', '/api/', '/monitoring'],
    },
    sitemap: 'https://pickly.com.ua/sitemap.xml',
  };
}
