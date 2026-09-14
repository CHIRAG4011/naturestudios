import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nature Studios — Esports Broadcast & Stage Architecture',
    short_name: 'Nature Studios',
    description:
      'Premier creative technology and production studio engineering championship tournament broadcasts, arena stage architectures, and motion design.',
    start_url: '/',
    display: 'standalone',
    background_color: '#150304',
    theme_color: '#150304',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
