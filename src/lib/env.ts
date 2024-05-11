import { config } from 'dotenv';
config({ path: '.env.local' });

export const dev = {};

export const prod = {};

export const nextJS = {
  NEXT_NODE_ENV: process.env.NEXT_NODE_ENV as string,
  GENERATE_SOURCEMAP: false,
};

export const pub = {
  SITE_URL_PROD: 'https://ashgw.me',
  SITE_URL_DEV: 'http://localhost:3000',
  EMAIL: 'ashrefgw@proton.me',
};
