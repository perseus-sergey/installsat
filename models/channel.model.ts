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
  description = 'description',
  text = 'text',
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
        height: 99,
        width: 132,
        alternativeImgStr: { title: '🎞', fontSize: '6rem' },
        defaultImage: {
          // src: '/Images/1not_found_chan.png',
          src: '/Images/tv.png',
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
        alternativeImgStr: { title: '🎞', fontSize: '2rem' },
        defaultImage: {
          src: '/Images/tv.png',
          height: 42,
          width: 55,
        },
      },
    },
    scheduleImg: {
      src: '/Images/schedule-icon96.png',
      height: 96,
      width: 96,
      alternativeImgStr: { title: '📋', fontSize: '6rem' },
      alt: {
        [ELanguage.UA]: `Перегляд розкладу телепередач`,
        [ELanguage.EN]: `View TV schedules`,
      },
    },
    onlineLinkImg: {
      src: '/Images/network-wireless_32.png',
      height: 32,
      width: 32,
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
    },
    articles: {
      title: {
        [ELanguage.UA]: 'Новини каналу:',
        [ELanguage.EN]: 'Channel news:',
      },
    },
  },
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
  fakePlayer: {
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
  },
  youtubePlayer: {
    width: 700,
    height: 395,
    embedPath: 'https://www.youtube.com/embed/',
  },
  tabs: {
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
  },
};

export const audioLanguages: Record<string, string> = {
  eng: 'English',
  rus: 'Русский (Russian)',
  pol: 'Polski (Polish)',
  swe: 'Svenska (Swedish)',
  por: 'Português (Portuguese)',
  bel: 'Беларуская (Belarusian)',
  tur: 'Türkçe (Turkish)',
  spa: 'Español (Spanish)',
  fra: 'Français (French)',
  fre: 'Français (French)',
  deu: 'Deutsch (German)',
  ger: 'Deutsch (German)',
  ita: 'Italiano (Italian)',
  nld: 'Nederlands (Dutch)',
  dut: 'Nederlands (Dutch)',
  ukr: 'Українська (Ukrainian)',
  chi: '中文 (Chinese)',
  jpn: '日本語 (Japanese)',
  kor: '한국어 (Korean)',
  ara: 'العربية (Arabic)',
  hin: 'हिन्दी (Hindi)',
  heb: 'עברית (Hebrew)',
  ces: 'Čeština (Czech)',
  cze: 'Čeština (Czech)',
  dan: 'Dansk (Danish)',
  iri: 'Irish',
  ell: 'Ελληνικά (Greek)',
  gre: 'Ελληνικά (Greek)',
  fin: 'Suomi (Finnish)',
  hun: 'Magyar (Hungarian)',
  nor: 'Norsk (Norwegian)',
  mlt: 'Malti (Maltese)',
  rom: 'Română (Romanian)',
  rum: 'Română (Romanian)',
  srp: 'Српски (Serbian)',
  slk: 'Slovenčina (Slovak)',
  slo: 'Slovenčina (Slovak)',
  slv: 'Slovenščina (Slovenian)',
  tha: 'ภาษาไทย (Thai)',
  vie: 'Tiếng Việt (Vietnamese)',
  bul: 'Български (Bulgarian)',
  est: 'Eesti (Estonian)',
  lat: 'Latviešu (Latvian)',
  lit: 'Lietuvių (Lithuanian)',
  hrv: 'Hrvatski (Croatian)',
  isl: 'Íslenska (Icelandic)',
  cat: 'Català (Catalan)',
  glg: 'Galego (Galician)',
  eus: 'Euskara (Basque)',
  mal: 'മലയാളം (Malayalam)',
  tam: 'தமிழ் (Tamil)',
  tel: 'తెలుగు (Telugu)',
  ben: 'বাংলা (Bengali)',
  urd: 'اردو (Urdu)',
  aym: 'Aymara',
  que: 'Quechua',
  kun: 'Kuna',
  kek: 'Kekchi',
  qui: 'Kichwa',
  qup: 'Quechua',
  gua: 'Guarani',
  pap: 'Papiamento',
  hai: 'Haitian Creole',
  jap: '日本語 (Japanese)',
  nep: 'नेपाली (Nepali)',
  aze: 'Azərbaycan (Azerbaijani)',
  baq: 'Euskara (Basque)',
  ber: 'ⴰⵎⴰⵣⵉⵖ (Berber)',
  bos: 'Bosanski (Bosnian)',
  ful: 'Fulfulde (Fulah)',
  hau: 'Hausa (Hausa)',
  kur: 'Kurdî (Kurdish)',
  man: '𞤃𞤢𞤤𞤢 (Mandingo)',
  na: 'Nauruan (Nauruan)',
  swa: 'Kiswahili (Swahili)',
  tgl: 'Tagalog (Tagalog)',
  per: 'فارسی (Persian)',
  amh: 'አማርኛ (Amharic)',
  ckb: 'کوردی (Central Kurdish)',
  duo: 'Duala',
  kurm: 'Kurmancî (Kurmanji)',
  oro: 'Oromo',
  oth: 'Other',
  pus: 'پښتو (Pashto)',
  qad: 'Qashqai',
  sor: 'Sori',
  syr: 'Syriac',
  tig: 'ትግርኛ (Tigrinya)',
  tir: 'ትግርኛ (Tigrinya)',
  ice: 'Icelandic',
  lav: 'Latvian',
  mul: 'Multiple',
  nya: 'Chichewa (Nyanja)',
  yor: 'Yoruba',
  aar: 'Afar',
  afg: 'Afghan (Pashto)',
  bem: 'Bemba',
  che: 'Chechen',
  com: 'Comorian',
  dar: 'Dargwa',
  hat: 'Haitian Creole',
  igb: 'Igbo',
  kik: 'Kikuyu',
  kin: 'Kinyarwanda',
  mai: 'Maithili',
  orm: 'Oromo',
  pcm: 'Nigerian Pidgin',
  som: 'Somali',
  use: 'Uspantso',
  zul: 'Zulu',
  zwe: 'Shona',
  alb: 'Albanian',
  arm: 'Armenian',
  cue: 'Quechua',
  kam: 'Kamba',
  kaz: 'Kazakh',
  kir: 'Kyrgyz',
  mac: 'Macedonian',
  mis: 'Miscellaneous languages',
  mlg: 'Malagasy',
  ser: 'Serbian',
  tar: 'Tatar',
  tuk: 'Turkmen',
  uzb: 'Uzbek',
  ama: 'Amharic',
  chl: 'Chilean Spanish',
  fry: 'Frisian',
  lux: 'Luxembourgish',
  sou: 'Southern Creole',
  geo: 'Georgian',
  gla: 'Scottish Gaelic',
  gle: 'Irish Gaelic',
  hnd: 'Hindi',
  lah: 'Lahnda (Western Punjabi)',
  nar: 'Nauru',
  pan: 'Punjabi',
  pas: 'Pashto',
  pun: 'Punjabi',
  san: 'Sanskrit',
  sin: 'Sinhala',
  snd: 'Sindhi',
  tat: 'Tatar',
  wel: 'Welsh',
  gag: 'Gagauz',
  gus: 'Ganda',
  mer: 'Meru',
  prs: 'Dari (Persian)',
  tgk: 'Tajik',
  turk: 'Turkish',
  twi: 'Twi (Akan)',
  zza: 'Zaza',
  afi: 'Afrihili',
  afr: 'Afrikaans',
  asm: 'Assamese',
  ass: 'Assamese',
  bho: 'Bhojpuri',
  bur: 'Burmese',
  guj: 'Gujarati',
  ind: 'Indonesian',
  kan: 'Kannada',
  mar: 'Marathi',
  mon: 'Mongolian',
  nag: 'Naga languages',
  nbl: 'Ndebele (Southern)',
  ori: 'Odia (Oriya)',
  sot: 'Southern Sotho',
  ssw: 'Swati (Swazi)',
  tsn: 'Tswana',
  tso: 'Tsonga',
  uyg: 'Uyghur',
  ven: 'Venda',
  xho: 'Xhosa',
  bak: 'Bashkir',
  ban: 'Balinese',
  chv: 'Chuvash',
  div: 'Divehi (Dhivehi, Maldivian)',
  dzo: 'Dzongkha (Bhutanese)',
  kas: 'Kashmiri',
  may: 'Malay',
  odi: 'Odia (Oriya)',
  raj: 'Rajasthani',
  mdr: 'Mandar',
  rwa: 'Kinyarwanda',
  taj: 'Tajik',
  zho: 'Chinese (Mandarin)',
  int: 'Interlingua',
  msa: 'Malay',
};

export const wrongAudio = ['ac3', 'aac', 'qaa', 'qis', 'org'];
