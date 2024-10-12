import { cutText } from '@/libs/utils/utils';
import { ELanguage } from './ui.model';
import { z } from 'zod';

export interface IChannel {
  id: number;
  title: string;
  chan_slug: string;
  logo: string;
  description: string;
  text: string;
  keywords: string;
  cat_id: number;
  url: string;
  view: number;
  canonical: string;
  tvforsite_net: string;
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

export type TDbBoolean = 0 | 1;

export interface IFlyChannel {
  id: number;
  title: string;
  slug: string;
  sat_title: string;
  sat_position: string;
  sat_logo: string;
  sat_slug: string;
  sat_grade: number;
  frequency: number;
  theme_id?: number;
  logo?: string;
  encryption: string | null;
  biss: string;
  description: string;
  keywords?: string;
  text: string;
  official_site_url: string;
  official_broadcast_url: string;
  sr: number;
  fec: string;
  polarization: string;
  beam: string;
  theme?: string;
  genre_description?: string;
  compress: string;
  languages?: string;
  canonical: string;
  cat_parent_title: string;
  mode: string;
  is_radio: TDbBoolean;
  sid: number | null;
  v_pid: number | null;
  a_pid: string;
  is_biss: TDbBoolean;
  t2_stream: string | null;
  date_updated: Date;
  vsetv: number;
  vipiko: number;
  view: number;
  is_removed: TDbBoolean;
  package_id: number;
  package_title: string;
  package_slug: string;
}

// export interface ISimilarFlyChannel {
//   id: number;
//   compress: number;
//   frequency: number;
//   encryption: string;
//   biss: string;
//   mode: string;
//   slug: string;
//   sat_title: string;
//   sat_slug: string;
//   sat_position: number;
// }

export interface IOnlineChannel extends IChannel {
  vsetv: number;
  vipiko: number;
  programma: string;
  telegid_id: number;
  aspect: string;
  no_googlads: string;
  potok: string;
  other_stream: string;
  genre_id: number;
  country: string;
}

export interface IChannelCategory {
  id: number;
  title: string;
  parent: number;
  cpu: string;
}

export enum EChannelEditFields {
  title = 'title',
  logo = 'logo',
  chan_slug = 'chan_slug',
  text = 'text',
  text_en = 'text_en',
  description = 'description',
  description_en = 'description_en',
  keywords = 'keywords',
  keywords_en = 'keywords_en',
  cat_id = 'cat_id',
  parent_cat_id = 'parent_cat_id',
  canonical = 'canonical',
  sat_id = 'sat_id',
  frequency_id = 'frequency_id',
  beam_id = 'beam_id',
  genre_id = 'genre_id',
  lang_id = 'lang_id',
  compress_id = 'compress_id',
  country_id = 'country_id',
  url = 'url',
  biss = 'biss',
  ip_deny = 'ip_deny',
  no_googlads = 'no_googlads',
  encryption_id = 'encryption_id',
  vsetv = 'vsetv',
  vipiko = 'vipiko',
  potok = 'potok',
  pars_uppod = 'pars_uppod',
  pattern = 'pattern',
  tvforsite_net = 'tvforsite_net',
  other_stream = 'other_stream',
  mark = 'mark',
}

const zodEmptyOr2 = z
  .string()
  .transform((val) => val.trim())
  .refine((val) => val === '' || val.length >= 2, {
    message: 'Must be EMPTY || 2+ characters',
  });

export const editChannelSchema = z.object({
  [EChannelEditFields.title]: z.string().min(2).trim(),
  [EChannelEditFields.chan_slug]: z.string().min(2).trim(),
  [EChannelEditFields.description]: z.string().min(2).trim(),
  [EChannelEditFields.text]: z.string().min(2).trim(),
  [EChannelEditFields.text_en]: z.string().min(2).trim(),
  [EChannelEditFields.description_en]: z.string().min(2).trim(),
  [EChannelEditFields.keywords]: z.string().min(2).trim(),
  [EChannelEditFields.keywords_en]: z.string().min(2).trim(),

  //   [EChannelEditFields.cat_id]: z.number().min(1).minValue(1),
  [EChannelEditFields.cat_id]: z.coerce
    .number()
    .min(1, 'Choose relative category'),

  [EChannelEditFields.canonical]: z.string().min(2).trim(),
  [EChannelEditFields.genre_id]: z.coerce.number(),
  [EChannelEditFields.lang_id]: z.coerce.number(),
  [EChannelEditFields.compress_id]: z.coerce.number(),
  [EChannelEditFields.country_id]: z.coerce.number(),
  [EChannelEditFields.no_googlads]: z.coerce.number(),

  [EChannelEditFields.parent_cat_id]: z.coerce.number().optional(),
  [EChannelEditFields.sat_id]: z.coerce
    .number({ message: 'Satellite should be number!' })
    .optional(),
  [EChannelEditFields.frequency_id]: z.coerce
    .number({ message: 'Frequency should be number!' })
    .optional(),
  [EChannelEditFields.beam_id]: z.coerce
    .number({ message: 'Beam should be number!' })
    .optional(),
  [EChannelEditFields.ip_deny]: z.coerce.number().optional(),
  [EChannelEditFields.encryption_id]: z.coerce.number().optional(),
  [EChannelEditFields.vsetv]: z.coerce.number().optional(),
  [EChannelEditFields.vipiko]: z.coerce.number().optional(),

  [EChannelEditFields.logo]: z.string().trim().optional(),
  [EChannelEditFields.url]: z.string().trim().optional(),
  [EChannelEditFields.biss]: z.string().trim().optional(),
  [EChannelEditFields.potok]: zodEmptyOr2,
  [EChannelEditFields.pars_uppod]: zodEmptyOr2,
  [EChannelEditFields.pattern]: zodEmptyOr2,
  [EChannelEditFields.tvforsite_net]: zodEmptyOr2,
  [EChannelEditFields.other_stream]: zodEmptyOr2,
  [EChannelEditFields.mark]: z.string().trim().optional(),
});
export type TChannelEditModel = z.infer<typeof editChannelSchema>;

export interface ISimilarChannel {
  id: number;
  compress: number;
  cpu: string;
  cat_id: number;
  cat_title: string;
  cat_slug: string;
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
  preText: {
    [ELanguage.UA]: `Канал відключено/закодовано на поточних параметрах`,
    [ELanguage.EN]: `Channel is disabled/encoded on current parameters`,
  },
  keywordsBefore: {
    [ELanguage.UA]: `Телевізійний канал `,
    [ELanguage.EN]: `Television channel `,
  },
};

export const CHANNEL_IMAGES = {
  channelLogo: {
    big: {
      path: '/Images/channelsOptimized/',
      height: 99,
      width: 132,
      defaultImage: {
        src: '/Images/channelsOptimized/channel_placeholder_99-132.png',
        height: 99,
        width: 132,
      },
      alt: {
        [ELanguage.UA]: `Логотип каналу`,
        [ELanguage.EN]: `Logo of the channel`,
      },
    },
    small: {
      path: '/Images/channel_55/',
      height: 42,
      width: 55,
      defaultImage: {
        src: '/Images/channel_55/channel_placeholder_55-42.gif',
        height: 42,
        width: 55,
      },
    },
  },
};

export const SCHEDULE_LINK = {
  scheduleImgAlt: {
    [ELanguage.UA]: `Іконка з зображенням бобіни з телевізійною плівкою і документу зі списком`,
    [ELanguage.EN]: `An icon depicting a reel of television film and a document with a list`,
  },
  scheduleLinkText: {
    channel: {
      [ELanguage.UA]: 'Телепрограма на',
      [ELanguage.EN]: 'TV Schedule for',
    },
    onlineChannel: {
      [ELanguage.UA]: 'Повна програма',
      [ELanguage.EN]: 'Full Schedule',
    },
  },
};

export const ONLINE_CHANNEL_LINK = {
  imageAlt: {
    [ELanguage.UA]: 'Антена, що віщає сигнал',
    [ELanguage.EN]: 'Antenna broadcasting a signal',
  },
  getOnlineLinkText(channelTitle: string) {
    return {
      [ELanguage.UA]: `Канал "${channelTitle}" онлайн`,
      [ELanguage.EN]: `Channel "${channelTitle}" online`,
    };
  },
};

export const CHANNEL_PARAMS_BLOCK = {
  getParamsTitle(channelTitle: string) {
    return {
      [ELanguage.UA]: `Параметри мовлення каналу "${channelTitle}"`,
      [ELanguage.EN]: `Broadcast options for channel "${channelTitle}"`,
    };
  },
  paramsLanguage: {
    [ELanguage.UA]: `Мова мовлення (перекладу)`,
    [ELanguage.EN]: `Broadcast (translation) language`,
  },
  paramsFormat: {
    [ELanguage.UA]: `Формат мовлення`,
    [ELanguage.EN]: `Broadcast format`,
  },
  paramsStandard: {
    [ELanguage.UA]: `Стандарт мовлення`,
    [ELanguage.EN]: `Broadcast Standard`,
  },
  paramsSatellite: {
    [ELanguage.UA]: `Супутник`,
    [ELanguage.EN]: `Satellite`,
  },
  paramsFrequency: {
    [ELanguage.UA]: `Частота`,
    [ELanguage.EN]: `Frequency`,
  },
  paramsFEC: {
    [ELanguage.UA]: `FEC`,
    [ELanguage.EN]: `FEC`,
  },
  paramsEncryption: {
    [ELanguage.UA]: `Шифрування`,
    [ELanguage.EN]: `Encryption`,
  },
  getParamsSite(channelTitle: string) {
    return {
      [ELanguage.UA]: `Сайт каналу "${channelTitle}"`,
      [ELanguage.EN]: `Channel website "${channelTitle}"`,
    };
  },
};

export const CHANNEL_RESPONSIBILITIES = {
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
};

export const SIMILAR_ARTICLE_TITLE = {
  [ELanguage.UA]: 'Новини каналу:',
  [ELanguage.EN]: 'Channel news:',
};

export const SIMILAR_CHANNELS = {
  getSatChannelTitle(satTitle: string, satPosition: string | number) {
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
};

export const SIMILAR_PACKAGE_CHANNELS_TITLE = {
  [ELanguage.UA]: 'Пакет:',
  [ELanguage.EN]: 'Package:',
};

export const SIMILAR_ONLINE_CHANNELS_TITLE = {
  getOnlineChannelTitle(channelTitle: string) {
    return {
      [ELanguage.UA]: `Дивитись канал "${channelTitle}" у прямому ефірі онлайн`,
      [ELanguage.EN]: `Watch the channel "${channelTitle}" live online`,
    };
  },
};

export const SIMILAR_CHANNELS_TITLE = {
  [ELanguage.UA]: 'Де дивитись',
  [ELanguage.EN]: 'Where to watch',
};

export const META_CHANNEL_ONLINE = {
  getTitle(channelTitle: string) {
    return {
      [ELanguage.UA]: `${channelTitle} онлайн`,
      [ELanguage.EN]: `${channelTitle} online`,
    };
  },
  getH1(channelTitle: string) {
    return {
      [ELanguage.UA]: `Канал «${channelTitle}» онлайн`,
      [ELanguage.EN]: `«${channelTitle}» channel online`,
    };
  },
  getDescription(channelTitle: string, description: string) {
    return {
      [ELanguage.UA]: `Дивіться онлайн канал ${channelTitle} безкоштовно у прямому ефірі. ${cutText(description, 120)}`,
      [ELanguage.EN]: `Watch the online channel ${channelTitle} for free live.  ${cutText(description, 120)}`,
    };
  },
  getKeywords(channelTitle: string) {
    return {
      [ELanguage.UA]: `${channelTitle} дивитись, онлайн, online, безкоштовно, тб, канал, прямий ефір, інтернет тб`,
      [ELanguage.EN]: `${channelTitle} watch, online, free, live, tv, channel, satellite, internet tv`,
    };
  },
};

export const FAKE_PLAYER = {
  button: {
    ariaLabel: {
      [ELanguage.UA]: 'Перейти до перегляду',
      [ELanguage.EN]: 'Go to playback',
    },
    titleStart: {
      [ELanguage.UA]: 'Дивитись онлайн',
      [ELanguage.EN]: 'Watch online',
    },
  },
  getCopyrightText(chanTitle: string) {
    return {
      [ELanguage.UA]: `Онлайн трансляція телеканалу ${chanTitle} призупинена за вимогою власника
        авторських прав.`,
      [ELanguage.EN]: `The online broadcast of the ${chanTitle} channel has been suspended due to the owner's
        copyrights.`,
    };
  },
  openNewWindowFeatures:
    'left=0,top=0,width=665,height=550,status=no,toolbar=yes,menubar=no,scrollbars=yes',
};

export const YOUTUBE_PLAYER = {
  width: 700,
  height: 395,
  embedPath: 'https://www.youtube.com/embed/',
};

export const ONLINE_TABS = {
  button: {
    getAriaLabel(streamNumber: number) {
      return {
        [ELanguage.UA]: `Дивитись із ${streamNumber}-го Джерела`,
        [ELanguage.EN]: `Watch from ${streamNumber} source`,
      };
    },
    getTitle(streamNumber: number) {
      return {
        [ELanguage.UA]: `${streamNumber} Канал`,
        [ELanguage.EN]: `Channel ${streamNumber}`,
      };
    },
  },
};
