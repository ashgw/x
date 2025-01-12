const NODE_ENV: 'development' | 'production' | 'staging' = 'development';

export const env = {
  NEXT_PUBLIC_WWW_PRODUCTION_URL: 'https://ashgw.me',
  NEXT_PUBLIC_WWW_DEVELOPMENT_URL: 'localhost:3000',
  NODE_ENV,
  NEXT_PUBLIC_CONTACT_EMAIL: 'ashgw@ashgw.me',
  NEXT_PUBLIC_GENERATE_SOURCE_MAP: false,
  GA_ID: 'G-7BBQ5SWDCD',
} as const;
