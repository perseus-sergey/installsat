export const CHANNEL_LIST_ANCHOR_START = 'genre-';
export const ONLINE_CHANNEL_LIST_DB_ID = '16';
export const CHANNEL_LIST_DB_ID = '4';
export const T2_SLUG = 't2-efir';

export interface ISatChannelListModel {
  id: number;
  title: string;
  cpu: string;
  sat_title: string;
  sat_position: string;
  sat_logo: string;
  sat_slug: string;
  sat_grade: number;
  frequency: number;
  sat: number;
  tema: number;
  logo: string;
  programma: number;
  encryption: string;
  biss: string;
  description: string;
  freq: number;
  sr: number;
  fec: string;
  polar: string;
  beam: string;
  tem: string;
  genre_description: string;
  compr: string;
  lan: string;
  canonical: string;
  cat_parent_title: string;
  category: number;
}

export interface IEditChannelListModel {
  id: number;
  title: string;
  cpu: string;
  sat_title: string;
  sat_position: string;
  frequency: number;
  compr: string;
  canonical: string;
  cat_parent_title: string;
  category: number;
}
export interface IChannelListModel {
  chan_id: number;
  chan_title: string;
  chan_cpu: string;
  chan_logo: string;
  chan_description: string;
  genre_id: number;
  genre_title: string;
  genre_description: string;
  lan: string;
}

export interface IOnlineChannelListModel extends IChannelListModel {
  potok: string;
  view: number;
  compress: number;
  encryption: string;
  compr: string;
  tvforsite_net: string;
  cat_slug: string;
}
export interface IPackageChannelListModel extends IChannelListModel {
  cat_id: number;
  cat_title: string;
  cat_slug: string;
  cat_logo: string;
  cat_description: string;
  cat_view: number;
  genre_slug: string;
  genre_h1: string;
  genre_logo: string;
  price: number;
  h1: string;
}

export interface IChannelPackagesModel {
  id: number;
  title: string;
  cpu: string;
  view: number;
  comment_count: number;
  logo: string;
  description: string;
}

export const MCompressionColors = new Map([
  ['MPEG-2', '#E9E3FD'],
  ['DEFAULT', '#E9E3FD'],

  ['T2-MI', '#f5b3cb'],

  ['MPEG-4', '#FFEDCA'],
  ['MPEG-4/1SEG', '#FFEDCA'],
  ['DVB-S2', '#FFEDCA'],

  ['HD', '#C5F9F7'],
  ['MPEG-4/HD', '#C5F9F7'],
  ['HEVC', '#C5F9F7'],
  ['HEVC/HD', '#C5F9F7'],

  ['4K UHD', '#81e3f3'],
]);

export const MChanTheme = new Map([
  [1, 'public.png'],
  [2, 'news.png'],
  [3, 'cinema.png'],
  [4, 'sport.png'],
  [5, 'sunset.png'],
  [6, 'kids.png'],
  [7, 'xxx.png'],
  [8, 'music.png'],
  [9, 'discovery.png'],
  [10, 'comedy.png'],
  [11, 'game.png'],
  [12, 'religion.png'],
  [13, 'tv_shopping.png'],
  [14, 'fashion.png'],
]);
// #656D7D

export enum ECompressColors {
  MPEG_2 = '#c5f9f7',
  MPEG_2_S2 = '#caffd3',
  MPEG_4 = '#daffca',
  T2_MI = '#e9e3fd',
  UHD = '#81e37aeefff3',
  HD = '#91fffd',
}

export const getCompressColor = (
  compress: string,
  modeList: string[],
  t2Stream: string | null
) => {
  if (t2Stream) return ECompressColors.T2_MI;

  const compressLower = compress.toLowerCase();

  if (compressLower.includes('4k') || compressLower.includes('uhd'))
    return ECompressColors.UHD;
  if (compressLower.includes('hd') || compressLower.includes('hevc'))
    return ECompressColors.HD;
  if (compressLower.startsWith('mpeg-4')) return ECompressColors.MPEG_4;

  for (const mode of modeList) {
    if (mode.toLowerCase().includes('dvb-s2')) return ECompressColors.MPEG_2_S2;
  }

  return ECompressColors.MPEG_2;
};
