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
    ];
  },
};

module.exports = nextConfig;
