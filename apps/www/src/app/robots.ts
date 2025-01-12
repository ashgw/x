import type { MetadataRoute } from 'next';
import { env } from '~/env';

const SITE_URL = env.NEXT_PUBLIC_WWW_PRODUCTION_URL;

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
