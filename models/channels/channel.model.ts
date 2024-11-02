import { ELanguage } from '../language.model';

export const DB_ARRAY_SEPARATOR = ' | ';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

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

export const CHANNEL_RESPONSIBILITIES = {
  noteTitle: {
    [UA]: 'Примітка',
    [EN]: 'Note',
    [RU]: 'Примечание',
    [ES]: 'Nota',
    [AR]: 'ملاحظة',
    [DE]: 'Hinweis',
    [FR]: 'Remarque',
    [IT]: 'Nota',
  },
  getResponsibilityText(channelTitle: string) {
    return {
      [UA]: `Шановні відвідувачі, ми не є власниками телеканалу «${channelTitle}». Ми не несемо відповідальності за трансльовані передачі та проблеми мовлення каналу.`,
      [EN]: `Dear visitors, we are not the owners of the «${channelTitle}» channel. We are not responsible for broadcast programs and channel broadcast problems.`,
      [RU]: `Уважаемые посетители, мы не являемся владельцами телеканала «${channelTitle}». Мы не несем ответственности за транслируемые программы и проблемы с трансляцией канала.`,
      [ES]: `Estimados visitantes, no somos los propietarios del canal «${channelTitle}». No somos responsables de los programas transmitidos ni de los problemas de transmisión del canal.`,
      [AR]: `أعزائي الزوار، نحن لسنا مالكي قناة «${channelTitle}». نحن غير مسؤولين عن البرامج التي يتم بثها ومشاكل البث الخاصة بالقناة.`,
      [DE]: `Sehr geehrte Besucher, wir sind nicht die Eigentümer des Kanals «${channelTitle}». Wir sind nicht verantwortlich für die ausgestrahlten Programme und die Probleme des Kanals.`,
      [FR]: `Chers visiteurs, nous ne sommes pas les propriétaires de la chaîne «${channelTitle}». Nous ne sommes pas responsables des programmes diffusés et des problèmes de diffusion de la chaîne.`,
      [IT]: `Gentili visitatori, non siamo i proprietari del canale «${channelTitle}». Non ci assumiamo la responsabilità per i programmi trasmessi e i problemi di trasmissione del canale.`,
    };
  },
};
