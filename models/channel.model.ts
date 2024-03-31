export interface IChannel {
  id: number;
  title: string;
  chan_slug: string;
  logo: string;
  description: string;
  text: string;
  cat_id: number;
  url: string;
  view: number;
  canonical: string;
  vsetv: number;
  vipiko: number;
  tvforsite_net: number;
  freq: number;
  sr: number;
  fec: string;
  polar: string;
  sat_title: string;
  sat_slug: string;
  encryption: string;
  genre: string;
  compression: string;
  cat_title: string;
  cat_slug: string;
  cat_parent_id: number;
  cat_parent_title: string;
  chan_lang: string;
}

export interface ISimilarChannel {
  id: number;
  compress: number;
  cpu: string;
  cat_id: number;
  cat_title: string;
  cat_cpu: string;
  cat_parent_id: number;
  sat_title: string;
  sat_cpu: string;
  sat_position: number;
  freq: number;
  cat_parent_title: string;
  cat_parent_cpu: string;
}

export const META_CHANNEL = {
  getH1(satTitle: string) {
    return {
      ua: `Безкоштовні канали з супутника ${satTitle}`,
      en: `Free satellite channels on ${satTitle}`,
    };
  },
  getTitle() {
    return {
      ua: 'Список каналів супутника',
      en: 'List of satellite channels',
    };
  },
  titleBefore: {
    ua: `Канал`,
    en: `Channel`,
  },
  keywordsBefore: {
    ua: `Телевізійний канал `,
    en: `Television channel `,
  },
  images: {
    defaultImgBlur: '/Images/1blur.gif',
    channelLogo: {
      big: {
        path: '/Images/channelsOptimized/',
        height: '99px',
        width: '132px',
        alternativeImgStr: { title: '🎞', fontSize: '6rem' },
        defaultImage: {
          src: '/Images/1not_found_chan.png',
          height: '99px',
          width: '132px',
        },
        alt: {
          ua: `Логотип каналу`,
          en: `Logo of the channel`,
        },
      },
      small: {
        path: '/Images/channel_55/',
        height: '42px',
        width: '55px',
        alternativeImgStr: { title: '🎞', fontSize: '2rem' },
        defaultImage: {
          src: '/Images/1not_found_chan.png',
          height: '42px',
          width: '55px',
        },
      },
    },
  },
  similarArticlesTitle: {
    ua: 'Де дивитись ',
    en: 'Where to watch ',
  },
};
