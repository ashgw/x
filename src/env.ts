import { config } from 'dotenv';
config({ path: '.env.local' });

const env = {
  nextjs: {
    NEXT_NODE_ENV: process.env.NEXT_NODE_ENV as string,
    NEXT_URL: process.env.NEXT_URL as string,
    NEXT_DEV_URL: process.env.NEXT_DEV_URL as string,
    GENERATE_SOURCEMAP: process.env.GENERATE_SOURCEMAP as string,
  },
  prod: {},
  dev: {},
  public: {
    SITE_URL: process.env.SITE_URL as string,
  },
};

export default env;
