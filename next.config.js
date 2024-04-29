/** @type {import('next').NextConfig} */

const nextConfig = {
  headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github-production-user-asset-6210df.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  productionBrowserSourceMaps: process.env.NODE_ENV !== 'production',
  pageExtensions: ['js', 'ts', 'jsx', 'tsx', 'mdx'],
};

module.exports = nextConfig;

const securityHeaders = [
  {
    key: 'Referrer-Policy',
    value: 'no-referrer, strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options', // for older browsers
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy', // even tho I won't need em, prolly
    value: 'camera=(), speaker=(), microphone=(), geolocation=()',
  },
  {
    key: 'Server',
    value: 'deez nuts v69.0.1',
  },
  {
    key: 'X-Powered-By',
    value: 'deez nuts v69.0.1',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'require-corp',
  },
];
