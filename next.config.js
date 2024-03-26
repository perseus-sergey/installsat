/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/sputnikovye-novosti',
        destination: '/',
        permanent: true,
      },
      {
        source: '/transponderni-novyny',
        destination: '/',
        permanent: true,
      },
      {
        source: '/stattia',
        destination: '/novyny-ta-statti',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
