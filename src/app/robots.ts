import { pub } from '@/lib/env';
import { MetadataRoute } from 'next';

const SITE_URL = pub.SITE_URL_PROD;
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: SITE_URL + '/sitemap.xml',
    host: SITE_URL,
  };
}
