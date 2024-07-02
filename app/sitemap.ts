import {
  getArticleCatListSiteMap,
  getChannelsSiteMap,
  getNewsForSiteMap,
  getOnlineChanSiteMap,
  getPackagesSiteMap,
  getSatMapList,
  getSatellitesSiteMap,
  getSchedulesSiteMap,
  getTransNewsSiteMap,
} from '@/controllers/siteMap.controller';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { DEFAULT_LANG, ELanguage } from '@/models/ui.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import { MetadataRoute } from 'next';

const BASE = process.env.BASE_URL || MAIN_URL;
const { UA, EN } = ELanguage;
const {
  SAT_COVERAGE_MAP,
  NEWS_AND_ARTICLES,
  ARTICLE,
  CHANNEL_PARAMS,
  CHANNELS_TV_PROGRAM,
  SAT_FINDER,
  PACKAGE_CHANNEL_LIST,
  SAT_CHANNEL_LIST,
  ONLINE_CHANNEL_LIST,
  TRANSPONDER_NEWS,
} = EUrlBaseParam;

const getSiteMapItem = (startPath: EUrlBaseParam) => ({
  url: `${BASE}/${DEFAULT_LANG}/${startPath}`,
  lastModified: new Date(),
  alternates: {
    languages: {
      en: `${BASE}/${EN}/${startPath}`,
      uk: `${BASE}/${UA}/${startPath}`,
    },
  },
});

const getSiteMapItemList = (
  startPath: EUrlBaseParam,
  itemList: { cpu: string }[],
  addedPath = '',
  cpuIsDate = false
) =>
  itemList.map((item) => ({
    url: `${BASE}/${DEFAULT_LANG}/${startPath}/${item.cpu}${addedPath ? `/${addedPath}` : ''}`,
    lastModified: cpuIsDate
      ? getFormattedDateStrYearFirst(item.cpu)
      : new Date(),
    alternates: {
      languages: {
        en: `${BASE}/${EN}/${startPath}/${item.cpu}${addedPath ? `/${addedPath}` : ''}`,
        uk: `${BASE}/${UA}/${startPath}/${item.cpu}${addedPath ? `/${addedPath}` : ''}`,
      },
    },
  }));

// =================================================================
// - add rows to tbl_digest_2023, tbl_digest_2022...
// - schedule time on production
// - siteMap with search parameters
// - is it static sitemap.xml
// when is sitemap() called (either when sitemap.json called or when the project is building)
// =================================================================

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const satMapList = await getSatMapList();
  const articleCatList = await getArticleCatListSiteMap();
  const articleList = await getNewsForSiteMap();
  const channelList = await getChannelsSiteMap();
  const scheduleList = await getSchedulesSiteMap();
  const packagesList = await getPackagesSiteMap();
  const satellitesList = await getSatellitesSiteMap();
  const onlineChannelList = await getOnlineChanSiteMap();
  const transNewsList = await getTransNewsSiteMap();

  return [
    {
      url: `${BASE}/${DEFAULT_LANG}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${BASE}/${EN}`,
          uk: `${BASE}/${UA}`,
        },
      },
    },
    getSiteMapItem(SAT_COVERAGE_MAP),
    ...getSiteMapItemList(SAT_COVERAGE_MAP, satMapList),
    getSiteMapItem(NEWS_AND_ARTICLES),
    ...getSiteMapItemList(NEWS_AND_ARTICLES, articleCatList),
    ...getSiteMapItemList(ARTICLE, articleList),
    ...getSiteMapItemList(CHANNEL_PARAMS, channelList),
    getSiteMapItem(CHANNELS_TV_PROGRAM),
    ...getSiteMapItemList(
      CHANNELS_TV_PROGRAM,
      scheduleList,
      getFormattedDateStrYearFirst()
    ),
    getSiteMapItem(SAT_FINDER),
    getSiteMapItem(PACKAGE_CHANNEL_LIST),
    ...getSiteMapItemList(PACKAGE_CHANNEL_LIST, packagesList),
    getSiteMapItem(SAT_CHANNEL_LIST),
    ...getSiteMapItemList(SAT_CHANNEL_LIST, satellitesList),
    getSiteMapItem(ONLINE_CHANNEL_LIST),
    ...getSiteMapItemList(ONLINE_CHANNEL_LIST, onlineChannelList),
    getSiteMapItem(ONLINE_CHANNEL_LIST),
    ...getSiteMapItemList(ONLINE_CHANNEL_LIST, onlineChannelList),
    ...getSiteMapItemList(TRANSPONDER_NEWS, transNewsList, '', true),
  ];
}
