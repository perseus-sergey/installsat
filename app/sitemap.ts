import { getSatMapsSideBar } from '@/controllers/sidebar.controller';
import {
  getArticleCatListSiteMap,
  getChannelsSiteMap,
  getFlyChannelsMap,
  getNewsForSiteMap,
  getOnlineChanSiteMap,
  getPackagesSiteMap,
  getSatellitesSiteMap,
  getSchedulesSiteMap,
  getTransNewsSiteMap,
} from '@/controllers/siteMap.controller';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { DEFAULT_LANG, ELanguage } from '@/models/language.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import { MetadataRoute } from 'next';

const BASE = process.env.BASE_URL || MAIN_URL;
const { UA, EN } = ELanguage;
const {
  SAT_COVERAGE_MAP,
  NEWS_AND_ARTICLES,
  ARTICLE,
  CHANNEL_PARAMS,
  KANAL,
  CHANNELS_TV_PROGRAM,
  SAT_FINDER,
  PACKAGE_CHANNEL_LIST,
  SAT_CHANNEL_LIST,
  ONLINE_CHANNEL_LIST,
  TRANSPONDER_NEWS,
} = EUrlBaseParam;

type TChangeFrequency =
  | 'always'
  | 'never'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly';

interface IItemData {
  startPath?: EUrlBaseParam;
  changeFrequency?: TChangeFrequency;
  addedPath?: string;
  cpuIsDate?: boolean;
}

interface IItemsData extends IItemData {
  itemList: { cpu: string }[];
}

const getSiteMapItem = ({
  startPath,
  changeFrequency = 'never',
}: IItemData) => {
  const endPath = startPath ? `/${startPath}` : '';

  return {
    url: `${BASE}/${DEFAULT_LANG}${endPath}`,
    lastModified: new Date(),
    changeFrequency,
    alternates: {
      languages: {
        en: `${BASE}/${EN}${endPath}`,
        uk: `${BASE}/${UA}${endPath}`,
      },
    },
  };
};

const getSiteMapItemList = ({
  startPath,
  itemList,
  changeFrequency = 'never',
  addedPath,
  cpuIsDate,
}: IItemsData) =>
  itemList.map((item) => {
    const endPath = `${startPath}/${item.cpu}${addedPath ? `/${addedPath}` : ''}`;

    return {
      url: `${BASE}/${DEFAULT_LANG}/${endPath}`,
      lastModified: cpuIsDate
        ? getFormattedDateStrYearFirst(item.cpu)
        : new Date(),
      changeFrequency,
      alternates: {
        languages: {
          en: `${BASE}/${EN}/${endPath}`,
          uk: `${BASE}/${UA}/${endPath}`,
        },
      },
    };
  });

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const satMapList = await getSatMapsSideBar();
  const articleCatList = await getArticleCatListSiteMap();
  const articleList = await getNewsForSiteMap();
  const channelList = await getChannelsSiteMap();
  const flyChannelList = await getFlyChannelsMap();
  const scheduleList = await getSchedulesSiteMap();
  const packagesList = await getPackagesSiteMap();
  const satellitesList = await getSatellitesSiteMap();
  const onlineChannelList = await getOnlineChanSiteMap();
  const transNewsList = await getTransNewsSiteMap();

  return [
    getSiteMapItem({ changeFrequency: 'daily' }),
    getSiteMapItem({ startPath: SAT_COVERAGE_MAP, changeFrequency: 'monthly' }),
    ...getSiteMapItemList({
      startPath: SAT_COVERAGE_MAP,
      itemList: satMapList,
      changeFrequency: 'monthly',
    }),
    getSiteMapItem({ startPath: NEWS_AND_ARTICLES, changeFrequency: 'daily' }),
    ...getSiteMapItemList({
      startPath: NEWS_AND_ARTICLES,
      itemList: articleCatList,
      changeFrequency: 'yearly',
    }),
    ...getSiteMapItemList({
      startPath: ARTICLE,
      itemList: articleList,
      changeFrequency: 'weekly',
    }),
    ...getSiteMapItemList({
      startPath: CHANNEL_PARAMS,
      itemList: channelList,
      changeFrequency: 'weekly',
    }),
    ...getSiteMapItemList({
      startPath: KANAL,
      itemList: flyChannelList,
      changeFrequency: 'daily',
    }),
    getSiteMapItem({
      startPath: CHANNELS_TV_PROGRAM,
      changeFrequency: 'monthly',
    }),
    ...getSiteMapItemList({
      startPath: CHANNELS_TV_PROGRAM,
      itemList: scheduleList,
      changeFrequency: 'daily',
      addedPath: getFormattedDateStrYearFirst(),
    }),
    getSiteMapItem({ startPath: SAT_FINDER, changeFrequency: 'yearly' }),
    getSiteMapItem({
      startPath: PACKAGE_CHANNEL_LIST,
      changeFrequency: 'monthly',
    }),
    ...getSiteMapItemList({
      startPath: PACKAGE_CHANNEL_LIST,
      itemList: packagesList,
      changeFrequency: 'monthly',
    }),
    getSiteMapItem({ startPath: SAT_CHANNEL_LIST, changeFrequency: 'weekly' }),
    ...getSiteMapItemList({
      startPath: SAT_CHANNEL_LIST,
      itemList: satellitesList,
      changeFrequency: 'weekly',
    }),
    getSiteMapItem({
      startPath: ONLINE_CHANNEL_LIST,
      changeFrequency: 'monthly',
    }),
    ...getSiteMapItemList({
      startPath: ONLINE_CHANNEL_LIST,
      itemList: onlineChannelList,
      changeFrequency: 'monthly',
    }),
    ...getSiteMapItemList({
      startPath: TRANSPONDER_NEWS,
      itemList: transNewsList,
      changeFrequency: 'weekly',
      cpuIsDate: true,
    }),
  ];
}
