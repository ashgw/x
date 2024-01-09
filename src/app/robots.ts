import { MetadataRoute } from 'next';
import env from '@/env';

const BASE_URL = env.public.SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private', '/xtc6'],
    },
    sitemap: BASE_URL + '/sitemap.xml',
  };
}
