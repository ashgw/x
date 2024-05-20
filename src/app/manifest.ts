import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ashgw',
    short_name: 'Ashgw',
    description: "AG's corner on the internet",
    start_url: '/',
    display: 'standalone',
    background_color: '#21001d',
    theme_color: '#21001d',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
