/** @type {import('next').NextConfig} */
// const { withNextVideo } = require('next-video/process');
// import { withNextVideo } from 'next-video/process';

const UA = 'ua';

// module.exports = withNextVideo(nextConfig);
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: `/${UA}/`,
        permanent: true,
      },
      {
        source: '/transponderni-novyny',
        destination: `/${UA}/`,
        permanent: true,
      },
      {
        source: '/sputnikovye-novosti',
        destination: `/${UA}/`,
        permanent: true,
      },
      {
        source: '/parametry-kanalu',
        destination: `/${UA}/spysok-kanaliv-suputnyka`,
        permanent: true,
      },
      {
        source: '/sputnikovye-novosti/:date',
        destination: `/${UA}/transponderni-novyny/:date`,
        permanent: true,
      },
      {
        source: '/novosti-i-statji/transpondernye-novosti',
        destination: `/${UA}/`,
        permanent: true,
      },
      {
        source: '/novosti-i-statji/satellite_equipments',
        destination: `/${UA}/`,
        permanent: true,
      },
      // {
      //   source: '/novosti-i-statji/satellite_equipments',
      //   destination: `/${UA}/kategoriji-tovariv`,
      //   permanent: true,
      // },
      {
        source: '/novosti-i-statji/karty-pokrytija-telesputnikov',
        destination: `/${UA}/karty-pokryttia-suputnykiv`,
        permanent: true,
      },
      {
        source: '/novosti-i-statji/installations',
        destination: `/${UA}/spysok-kanaliv-paketu`,
        permanent: true,
      },
      {
        source: '/statja/napravlenie-antenny-po-karte',
        destination: `/${UA}/satellite-finder`,
        permanent: true,
      },
      {
        source: '/stattia/napravlenie-antenny-po-karte',
        destination: `/${UA}/satellite-finder`,
        permanent: true,
      },
      {
        source: '/novosti-i-statji/channel_list',
        destination: `/${UA}/spysok-kanaliv-paketu`,
        permanent: true,
      },
      {
        source: '/stattia',
        destination: `/${UA}/novyny-ta-statti`,
        permanent: true,
      },
      {
        source: '/novosti-i-statji/lastnews/:page',
        destination: `/${UA}/novyny-ta-statti?page=:page`,
        permanent: true,
      },
      {
        source: '/novosti-i-statji/:slug/:page',
        destination: `/${UA}/novyny-ta-statti/:slug?page=:page`,
        permanent: true,
      },
      {
        source: '/novosti-i-statji/:slug',
        destination: `/${UA}/novyny-ta-statti/:slug`,
        permanent: true,
      },
      {
        source: '/statja/:slug',
        destination: `/${UA}/stattia/:slug`,
        permanent: true,
      },
      {
        source: '/spisok-kanalov-paketa/bez-abonplati',
        destination: `/${UA}/spysok-kanaliv-suputnyka`,
        permanent: true,
      },
      {
        source: '/spysok-kanaliv-paketu/bez-abonplati',
        destination: `/${UA}/spysok-kanaliv-suputnyka`,
        permanent: true,
      },
      {
        source: '/spisok-kanalov-paketa/bez-abonplati/light',
        destination: `/${UA}/spysok-kanaliv-suputnyka`,
        permanent: true,
      },
      {
        source: '/spisok-kanalov-sputnika/:slug',
        destination: `/${UA}/spysok-kanaliv-suputnyka/:slug`,
        permanent: true,
      },
      {
        source: '/spisok-kanalov-paketa/:package',
        destination: `/${UA}/spysok-kanaliv-paketu/:package`,
        permanent: true,
      },
      {
        source: '/varianty-ustanovki-anten/:slug',
        destination: `/${UA}/spysok-kanaliv-paketu`,
        permanent: true,
      },
      {
        source: '/tv-programma/vse-kanaly',
        destination: `/${UA}/programa-telekanaliv`,
        permanent: true,
      },
      {
        source: '/programma-kanala/:slug/:date',
        destination: `/${UA}/programa-telekanaliv/:slug?date=:date`,
        permanent: true,
      },
      {
        source: '/spisok-online-kanalov/vse-tv',
        destination: `/${UA}/telekanaly-onlain`,
        permanent: true,
      },
      {
        source: '/parametri-kanala/:slug',
        destination: `/${UA}/parametry-kanalu/:slug`,
        permanent: true,
      },
      {
        source: '/karta-pokrytija-sputnika/:slug',
        destination: `/${UA}/karty-pokryttia-suputnykiv/:slug`,
        permanent: true,
      },
      {
        source: '/tv-online/:slug',
        destination: `/${UA}/telekanaly-onlain/:slug`,
        permanent: true,
      },
      {
        source: '/kategorija-tovara/:cat_parent',
        destination: `/${UA}/`,
        permanent: true,
      },
      // {
      //   source: '/kategorija-tovara/:cat_parent',
      //   destination: `/${UA}/kategoriji-tovariv/:cat_parent`,
      //   permanent: true,
      // },
      {
        source: '/spisok-tovarov/:cat*',
        destination: `/${UA}/`,
        permanent: true,
      },
      // {
      //   source: '/spisok-tovarov/:cat*',
      //   destination: `/${UA}/kategoriji-tovariv`,
      //   permanent: true,
      // },
      {
        source: '/tovar/:cat*',
        destination: `/${UA}/`,
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
// module.exports = withNextVideo(nextConfig);
