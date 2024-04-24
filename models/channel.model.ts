import { ELanguage } from './ui.model';

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
  CHANNEL_LIST_DB_ID: '4',
  getH1(satTitle: string) {
    return {
      [ELanguage.UA]: `Безкоштовні канали з супутника ${satTitle}`,
      [ELanguage.EN]: `Free satellite channels on ${satTitle}`,
    };
  },
  getTitle() {
    return {
      [ELanguage.UA]: 'Список каналів супутника',
      [ELanguage.EN]: 'List of satellite channels',
    };
  },
  titleBefore: {
    [ELanguage.UA]: `Канал`,
    [ELanguage.EN]: `Channel`,
  },
  keywordsBefore: {
    [ELanguage.UA]: `Телевізійний канал `,
    [ELanguage.EN]: `Television channel `,
  },
  scheduleLinkText: {
    channel: {
      [ELanguage.UA]: 'Телепрограма на',
      [ELanguage.EN]: 'TV Schedule for',
    },
    onlineChannel: {
      [ELanguage.UA]: 'Повна телепрограма',
      [ELanguage.EN]: 'Full TV Schedule',
    },
  },
  getOnlineLinkText(channelTitle: string) {
    return {
      [ELanguage.UA]: `Канал "${channelTitle}" онлайн`,
      [ELanguage.EN]: `Channel "${channelTitle}" online`,
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
          [ELanguage.UA]: `Логотип каналу`,
          [ELanguage.EN]: `Logo of the channel`,
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
        [ELanguage.UA]: `Перегляд розкладу телепередач`,
        [ELanguage.EN]: `View TV schedules`,
      },
    },
    onlineLinkImg: {
      src: '/Images/network-wireless_32.png',
      height: '32px',
      width: '32px',
      alternativeImgStr: { title: '📺', fontSize: '2rem' },
      alt: {
        [ELanguage.UA]: `Перехід до онлайн ТБ сторінки`,
        [ELanguage.EN]: `Go to the online TV page`,
      },
    },
  },
  chanParamsBlock: {
    getParamsTitle(channelTitle: string) {
      return {
        [ELanguage.UA]: `Параметри мовлення каналу "${channelTitle}"`,
        [ELanguage.EN]: `Broadcast options for channel "${channelTitle}"`,
      };
    },
    paramsLanguage: {
      [ELanguage.UA]: `Мова мовлення (перекладу) : `,
      [ELanguage.EN]: `Broadcast (translation) language : `,
    },
    paramsFormat: {
      [ELanguage.UA]: `Формат мовлення : `,
      [ELanguage.EN]: `Broadcast format : `,
    },
    paramsSatellite: {
      [ELanguage.UA]: `Супутник : `,
      [ELanguage.EN]: `Satellite : `,
    },
    paramsFrequency: {
      [ELanguage.UA]: `Частота : `,
      [ELanguage.EN]: `Frequency : `,
    },
    paramsFEC: {
      [ELanguage.UA]: `FEC : `,
      [ELanguage.EN]: `FEC : `,
    },
    paramsEncryption: {
      [ELanguage.UA]: `Шифрування : `,
      [ELanguage.EN]: `Encryption : `,
    },
    getParamsSite(channelTitle: string) {
      return {
        [ELanguage.UA]: `Сайт каналу "${channelTitle}"`,
        [ELanguage.EN]: `Channel website "${channelTitle}"`,
      };
    },
  },
  noteTitle: {
    [ELanguage.UA]: 'Примітка',
    [ELanguage.EN]: 'Note',
  },
  getResponsibilityText(channelTitle: string) {
    return {
      [ELanguage.UA]: `Шановні відвідувачі, ми не є власниками телеканалу «${channelTitle}». Ми не несемо відповідальності за трансльовані передачі та проблеми мовлення каналу.`,
      [ELanguage.EN]: `Dear visitors, we are not the owners of the «${channelTitle}» channel. We are not responsible for broadcast programs and channel broadcast problems.`,
    };
  },
  infoPanelTitles: {
    package: { [ELanguage.UA]: 'Пакет', [ELanguage.EN]: 'Package' },
    views: { [ELanguage.UA]: 'Переглядів', [ELanguage.EN]: 'Views' },
    comments: { [ELanguage.UA]: 'Коментарів', [ELanguage.EN]: 'Comments' },
  },
  similar: {
    channels: {
      title: {
        [ELanguage.UA]: 'Де дивитись',
        [ELanguage.EN]: 'Where to watch',
      },
      getOnlineChannelTitle(channelTitle: string) {
        return {
          [ELanguage.UA]: `Дивитись канал "${channelTitle}" у прямому ефірі онлайн`,
          [ELanguage.EN]: `Watch the channel "${channelTitle}" live online`,
        };
      },
      getSatChannelTitle(satTitle: string, satPosition: number) {
        return {
          [ELanguage.UA]: `Супутник: ${satTitle} ${satPosition}`,
          [ELanguage.EN]: `Satellite: ${satTitle} ${satPosition}`,
        };
      },
      getFrequencyTitle(frequency: number) {
        return {
          [ELanguage.UA]: `| Частота: ${frequency}`,
          [ELanguage.EN]: `| Frequency: ${frequency}`,
        };
      },
      packageTitle: {
        [ELanguage.UA]: 'Пакет:',
        [ELanguage.EN]: 'Package:',
      },
    },
    articles: {
      title: {
        [ELanguage.UA]: 'Новини каналу:',
        [ELanguage.EN]: 'Channel news:',
      },
    },
  },
};
