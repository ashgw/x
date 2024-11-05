import { config } from 'dotenv';

config({ path: '.env.local' });

export const dev = {};

export const prod = {};

export const nextJS = {
  NODE_ENV: process.env.NODE_ENV as string,
  GENERATE_SOURCEMAP: false,
};

export const pub = {
  SITE_URL_PROD: 'https://ashgw.me',
  SITE_URL_DEV: 'http://localhost:3000',
  EMAIL: 'ashref@ashgw.me',
};
