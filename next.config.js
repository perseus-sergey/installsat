/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/transponderni-novyny',
        destination: '/',
        permanent: true,
      },
      {
        source: '/sputnikovye-novosti',
        destination: '/',
        permanent: true,
      },
      {
        source: '/parametry-kanalu',
        destination: '/spysok-kanaliv-suputnyka',
        permanent: true,
      },
      {
        source: '/sputnikovye-novosti/:date',
        destination: '/transponderni-novyny/:date',
        permanent: true,
      },
      {
        source: '/novosti-i-statji/transpondernye-novosti',
        destination: '/',
        permanent: true,
      },
      {
        source: '/novosti-i-statji/satellite_equipments',
        destination: '/kategoriji-tovariv',
        permanent: true,
      },
      {
        source: '/novosti-i-statji/karty-pokrytija-telesputnikov',
        destination: '/karty-pokryttia-suputnykiv',
        permanent: true,
      },
      {
        source: '/novosti-i-statji/installations',
        destination: '/varianty-vstanovlennia-anten',
        permanent: true,
      },
      {
        source: '/statja/napravlenie-antenny-po-karte',
        destination: '/satellite-finder',
        permanent: true,
      },
      {
        source: '/stattia/napravlenie-antenny-po-karte',
        destination: '/satellite-finder',
        permanent: true,
      },
      {
        source: '/novosti-i-statji/channel_list',
        destination: '/spysok-kanaliv-paketu',
        permanent: true,
      },
      {
        source: '/stattia',
        destination: '/novyny-ta-statti',
        permanent: true,
      },
      {
        source: '/novosti-i-statji/lastnews/:page',
        destination: '/novyny-ta-statti?page=:page',
        permanent: true,
      },
      {
        source: '/novosti-i-statji/:slug/:page',
        destination: '/novyny-ta-statti/:slug?page=:page',
        permanent: true,
      },
      {
        source: '/novosti-i-statji/:slug',
        destination: '/novyny-ta-statti/:slug',
        permanent: true,
      },
      {
        source: '/statja/:slug',
        destination: '/stattia/:slug',
        permanent: true,
      },
      {
        source: '/spisok-kanalov-paketa/bez-abonplati',
        destination: '/spysok-kanaliv-suputnyka',
        permanent: true,
      },
      {
        source: '/spysok-kanaliv-paketu/bez-abonplati',
        destination: '/spysok-kanaliv-suputnyka',
        permanent: true,
      },
      {
        source: '/spisok-kanalov-paketa/bez-abonplati/light',
        destination: '/spysok-kanaliv-suputnyka',
        permanent: true,
      },
      {
        source: '/spisok-kanalov-sputnika/:slug',
        destination: '/spysok-kanaliv-suputnyka/:slug',
        permanent: true,
      },
      {
        source: '/spisok-kanalov-paketa/:package',
        destination: '/spysok-kanaliv-paketu/:package',
        permanent: true,
      },
      {
        source: '/varianty-ustanovki-anten/:slug',
        destination: '/varianty-vstanovlennia-anten/:slug',
        permanent: true,
      },
      {
        source: '/tv-programma/vse-kanaly',
        destination: '/programa-telekanaliv',
        permanent: true,
      },
      {
        source: '/programma-kanala/:slug/:date',
        destination: '/programa-telekanaliv/:slug?date=:date',
        permanent: true,
      },
      {
        source: '/spisok-online-kanalov/vse-tv',
        destination: '/telekanaly-onlain',
        permanent: true,
      },
      {
        source: '/parametri-kanala/:slug',
        destination: '/parametry-kanalu/:slug',
        permanent: true,
      },
      {
        source: '/karta-pokrytija-sputnika/:slug',
        destination: '/karty-pokryttia-suputnykiv/:slug',
        permanent: true,
      },
      {
        source: '/tv-online/:slug',
        destination: '/telekanaly-onlain/:slug',
        permanent: true,
      },
      {
        source: '/kategorija-tovara/:cat_parent',
        destination: '/kategoriji-tovariv/:cat_parent',
        permanent: true,
      },
      {
        source: '/spisok-tovarov/:cat*',
        destination: '/kategoriji-tovariv',
        permanent: true,
      },
      {
        source: '/tovar/:cat*',
        destination: '/kategoriji-tovariv',
        permanent: true,
      },
    ];
  },
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'installsat.fun',
  //       port: '',
  //       pathname: '/public/Images/**',
  //     },
  //   ],
  // },
};

module.exports = nextConfig;

// RewriteRule 	^price/([-a-zA-Z0-9_]+)/$ 									product_price.php?cat=$1 			[QSA,L]
// RewriteRule 	^nashi-kontakty/?$ 											contacts.php 						[QSA,L]
// RewriteRule 	^chat/?$ 											chat/chat.php 						[QSA,L]

//   SAT_COVERAGE_MAP = 'mapa-pokryttia-suputnyka',
//   NEWS_AND_ARTICLES = 'novyny-ta-statti',
//   CHANNEL_PARAMS = 'parametry-kanalu',
//   ONLINE_CHANNEL_LIST = 'telekanaly-onlain',
//   PRODUCT = 'tovar',
//   PRODUCT_LIST = 'spysok-tovariv',
//   PRODUCT_CATEGORIES = 'kategoriji-tovariv',
// }
