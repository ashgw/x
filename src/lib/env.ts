import { config } from 'dotenv';
config({ path: '.env.local' });

export const pub = {
  SITE_URL_PROD: process.env.SITE_URL_PROD as string,
  SITE_URL_DEV: process.env.SITE_URL_DEV as string,
};

export const dev = {};

export const prod = {};

export const nextJS = {
  NEXT_NODE_ENV: process.env.NEXT_NODE_ENV as string,
  NEXT_URL: process.env.NEXT_URL as string,
  NEXT_DEV_URL: process.env.NEXT_DEV_URL as string,
  GENERATE_SOURCEMAP: process.env.GENERATE_SOURCEMAP as string,
};
