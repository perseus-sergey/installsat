/** @type {import('next').NextConfig} */
// const { withNextVideo } = require('next-video/process');
// import { withNextVideo } from 'next-video/process';

const BASE = '/ua';

// module.exports = withNextVideo(nextConfig);
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: BASE,
        permanent: true,
      },
      {
        source: '/:p/transponderni-novyny',
        destination: BASE,
        permanent: true,
      },
      {
        source: '/sputnikovye-novosti',
        destination: BASE,
        permanent: true,
      },
      {
        source: '/:p?/parametry-kanalu',
        destination: `${BASE}/spysok-kanaliv-suputnyka`,
        permanent: true,
      },
      {
        source: '/sputnikovye-novosti/:date',
        destination: `${BASE}/transponderni-novyny/:date`,
        permanent: true,
      },
      {
        source: '/novosti-i-statji/transpondernye-novosti',
        destination: BASE,
        permanent: true,
      },
      {
        source: '/novosti-i-statji/satellite_equipments',
        destination: BASE,
        permanent: true,
      },
      // {
      //   source: '/novosti-i-statji/satellite_equipments',
      //   destination: `${BASE}/kategoriji-tovariv`,
      //   permanent: true,
      // },
      {
        source: '/novosti-i-statji/karty-pokrytija-telesputnikov',
        destination: `${BASE}/karty-pokryttia-suputnykiv`,
        permanent: true,
      },
      {
        source: '/novosti-i-statji/installations',
        destination: `${BASE}/spysok-kanaliv-paketu`,
        permanent: true,
      },
      {
        source: '/statja/napravlenie-antenny-po-karte',
        destination: `${BASE}/satellite-finder`,
        permanent: true,
      },
      {
        source: '/stattia/napravlenie-antenny-po-karte',
        destination: `${BASE}/satellite-finder`,
        permanent: true,
      },
      {
        source: '/novosti-i-statji/channel_list',
        destination: `${BASE}/spysok-kanaliv-paketu`,
        permanent: true,
      },
      {
        source: '/:p?/stattia',
        destination: `${BASE}/novyny-ta-statti`,
        permanent: true,
      },
      {
        source: '/novosti-i-statji/lastnews/:page',
        destination: `${BASE}/novyny-ta-statti?page=:page`,
        permanent: true,
      },
      {
        source: '/novosti-i-statji/:slug/:page',
        destination: `${BASE}/novyny-ta-statti/:slug?page=:page`,
        permanent: true,
      },
      {
        source: '/novosti-i-statji/:slug',
        destination: `${BASE}/novyny-ta-statti/:slug`,
        permanent: true,
      },
      {
        source: '/statja/:slug',
        destination: `${BASE}/stattia/:slug`,
        permanent: true,
      },
      {
        source: '/spisok-kanalov-paketa/bez-abonplati',
        destination: `${BASE}/spysok-kanaliv-suputnyka`,
        permanent: true,
      },
      {
        source: '/:p?/spysok-kanaliv-paketu/bez-abonplati',
        destination: `${BASE}/spysok-kanaliv-suputnyka`,
        permanent: true,
      },
      {
        source: '/spisok-kanalov-paketa/bez-abonplati/light',
        destination: `${BASE}/spysok-kanaliv-suputnyka`,
        permanent: true,
      },
      {
        source: '/spisok-kanalov-sputnika/:slug',
        destination: `${BASE}/spysok-kanaliv-suputnyka/:slug`,
        permanent: true,
      },
      {
        source:
          '/:p?/spysok-kanaliv-suputnyka/(sputnik-amos-2|sputnik-astra-4a|sputnik-eutelsat-9b|sputnik-hotbird|eutelsat-36|sputnik-azerspace-1|sputnik-yamal-402|sputnik-abs1|sputnik-intelsat-15|sputnik-yamal-201)',
        destination: `${BASE}/spysok-kanaliv-suputnyka`,
        permanent: true,
      },
      {
        source: '/spisok-kanalov-paketa/:package',
        destination: `${BASE}/spysok-kanaliv-paketu/:package`,
        permanent: true,
      },
      {
        source: '/varianty-ustanovki-anten/:slug',
        destination: `${BASE}/spysok-kanaliv-paketu`,
        permanent: true,
      },
      {
        source: '/tv-programma/vse-kanaly',
        destination: `${BASE}/programa-telekanaliv`,
        permanent: true,
      },
      {
        source: '/programma-kanala/:slug/:date',
        destination: `${BASE}/programa-telekanaliv/:slug?date=:date`,
        permanent: true,
      },
      {
        source: '/spisok-online-kanalov/vse-tv',
        destination: `${BASE}/telekanaly-onlain`,
        permanent: true,
      },
      {
        source: '/parametri-kanala/:slug',
        destination: `${BASE}/parametry-kanalu/:slug`,
        permanent: true,
      },
      {
        source: '/karta-pokrytija-sputnika/:slug',
        destination: `${BASE}/karty-pokryttia-suputnykiv/:slug`,
        permanent: true,
      },
      {
        source: '/tv-online/:slug',
        destination: `${BASE}/telekanaly-onlain/:slug`,
        permanent: true,
      },
      {
        source: '/kategorija-tovara/:cat_parent',
        destination: BASE,
        permanent: true,
      },
      // {
      //   source: '/kategorija-tovara/:cat_parent',
      //   destination: `${BASE}/kategoriji-tovariv/:cat_parent`,
      //   permanent: true,
      // },
      {
        source: '/spisok-tovarov/:cat*',
        destination: BASE,
        permanent: true,
      },
      // {
      //   source: '/spisok-tovarov/:cat*',
      //   destination: `${BASE}/kategoriji-tovariv`,
      //   permanent: true,
      // },
      {
        source: '/tovar/:cat*',
        destination: BASE,
        permanent: true,
      },
    ];
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
// ANALYZE=true yarn build

module.exports = withBundleAnalyzer(nextConfig);

// module.exports = nextConfig;
// module.exports = withNextVideo(nextConfig);
