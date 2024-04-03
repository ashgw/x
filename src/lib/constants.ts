import { nextJS, pub } from './env';
export const BLOG_CONTENT_PATH = '/public/blogs';
export const BUSINESS_CONTENT_PATH = '/public/business';
export const BLOG_URI = '/blog';
export const BLOG_API_URI = '/api/blogs';
export const SITE_URL =
  nextJS.NEXT_NODE_ENV === 'production' ? pub.SITE_URL_PROD : pub.SITE_URL_DEV;

export const Status = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

export const EMAIL = 'ashrefgw@proton.me';
