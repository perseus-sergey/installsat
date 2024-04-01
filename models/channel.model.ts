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
  cat_parent_cpu: string;
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
  scheduleLinkText: {
    channel: {
      ua: 'Телепрограма на',
      en: 'TV Schedule for',
    },
    onlineChannel: {
      ua: 'Повна телепрограма',
      en: 'Full TV Schedule',
    },
  },
  getOnlineLinkText(channelTitle: string) {
    return {
      ua: `Канал "${channelTitle}" онлайн`,
      en: `Channel "${channelTitle}" online`,
    };
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
    scheduleImg: {
      src: '/Images/schedule-icon96.png',
      height: '96px',
      width: '96px',
      alternativeImgStr: { title: '📋', fontSize: '6rem' },
      alt: {
        ua: `Перегляд розкладу телепередач`,
        en: `View TV schedules`,
      },
    },
    onlineLinkImg: {
      src: '/Images/network-wireless_32.png',
      height: '32px',
      width: '32px',
      alternativeImgStr: { title: '📺', fontSize: '2rem' },
      alt: {
        ua: `Перехід до онлайн ТБ сторінки`,
        en: `Go to the online TV page`,
      },
    },
  },
  chanParamsBlock: {
    getParamsTitle(channelTitle: string) {
      return {
        ua: `Параметри мовлення каналу "${channelTitle}"`,
        en: `Broadcast options for channel "${channelTitle}"`,
      };
    },
    paramsLanguage: {
      ua: `Мова мовлення (перекладу) : `,
      en: `Broadcast (translation) language : `,
    },
    paramsFormat: {
      ua: `Формат мовлення : `,
      en: `Broadcast format : `,
    },
    paramsSatellite: {
      ua: `Супутник : `,
      en: `Satellite : `,
    },
    paramsFrequency: {
      ua: `Частота : `,
      en: `Frequency : `,
    },
    paramsFEC: {
      ua: `FEC : `,
      en: `FEC : `,
    },
    paramsEncryption: {
      ua: `Шифрування : `,
      en: `Encryption : `,
    },
    getParamsSite(channelTitle: string) {
      return {
        ua: `Сайт каналу "${channelTitle}"`,
        en: `Channel website "${channelTitle}"`,
      };
    },
  },
  noteTitle: {
    ua: 'Примітка',
    en: 'Note',
  },
  getResponsibilityText(channelTitle: string) {
    return {
      ua: `Шановні відвідувачі, ми не є власниками телеканалу «${channelTitle}». Ми не несемо відповідальності за трансльовані передачі та проблеми мовлення каналу.`,
      en: `Dear visitors, we are not the owners of the «${channelTitle}» channel. We are not responsible for broadcast programs and channel broadcast problems.`,
    };
  },
  infoPanelTitles: {
    package: { ua: 'Пакет', en: 'Package' },
    views: { ua: 'Переглядів', en: 'Views' },
    comments: { ua: 'Коментарів', en: 'Comments' },
  },
  similar: {
    channels: {
      title: {
        ua: 'Де дивитись',
        en: 'Where to watch',
      },
      getOnlineChannelTitle(channelTitle: string) {
        return {
          ua: `Дивитись канал "${channelTitle}" у прямому ефірі онлайн`,
          en: `Watch the channel "${channelTitle}" live online`,
        };
      },
      getSatChannelTitle(satTitle: string, satPosition: number) {
        return {
          ua: `Супутник: ${satTitle} ${satPosition}`,
          en: `Satellite: ${satTitle} ${satPosition}`,
        };
      },
      getFrequencyTitle(frequency: number) {
        return {
          ua: `| Частота: ${frequency}`,
          en: `| Frequency: ${frequency}`,
        };
      },
      packageTitle: {
        ua: 'Пакет:',
        en: 'Package:',
      },
    },
    articles: {
      title: {
        ua: 'Новини каналу:',
        en: 'Channel news:',
      },
    },
  },
};
