import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Installsat TV',
    short_name: 'Installsat',
    description:
      'Your primary resource for everything related to satellite television. Find channels, configure your antenna, and get the latest news.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#cbdafa',
    // theme_color: '#007bff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    lang: 'en', // Specified language as English
  };
}
