import { nextJS, pub } from '@/lib/env';

import { getSiteName } from './funcs/site-name';

export const BLOG_CONTENT_PATH = '/public/blogs';
export const BUSINESS_CONTENT_PATH = '/public/services';
export const BLOG_URI = '/blog';
export const BLOG_TAG_URI = '/blog/tag';
export const BLOG_API_URI = '/api/blogs';
export const SITE_URL =
  nextJS.NODE_ENV === 'production' ? pub.SITE_URL_PROD : pub.SITE_URL_DEV;
export const EMAIL = pub.EMAIL;
export const Status = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
};

export const DEFAULT_API_URI = '/api/v1';
export const GPG_PUBLIC_KEY_EXTERNAL_URL = 'https://github.com/ashgw.gpg';
export const GPG_PUBLIC_KEY_INTERNAL_URL = SITE_URL + DEFAULT_API_URI + '/gpg';
export const PUBLIC_BLOG_IMAGES_SOURCE =
  'https://ashgw-blog-public-images.s3.us-east-2.amazonaws.com/';

export const PUBLIC_CONTENT_SOURCE =
  'https://ashgw-blog-public-general.s3.us-east-2.amazonaws.com/';
export const SITE_NAME = getSiteName(pub.SITE_URL_PROD);
export const REPO_SOURCE = 'https://github.com/ashgw/ashgw.me';
export const CREATOR = 'Ashref Gwader';
export const BOOKING_LINK = 'https://cal.com/ashgw';
