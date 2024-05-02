import { config } from 'dotenv';
config({ path: '.env.local' });

export const dev = {};

export const prod = {};

export const nextJS = {
  NEXT_NODE_ENV: process.env.NEXT_NODE_ENV as string,
  NEXT_URL: process.env.NEXT_URL as string,
  NEXT_DEV_URL: process.env.NEXT_DEV_URL as string,
  GENERATE_SOURCEMAP: process.env.GENERATE_SOURCEMAP as string,
};

export const pub = {
  SITE_URL_PROD: 'http://localhost:3000',
  SITE_URL_DEV: 'http://localhost:3000',
  EMAIL: process.env.EMAIL as string,
};
