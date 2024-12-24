import { Suspense } from 'react';
import Image from 'next/image';

import { Title } from '@/components/ui/Titles/Title';
import { getChannelsWithSchedule } from '@/controllers/channelList.controller';
import type { Metadata } from 'next';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';
import { getELangKey } from '@/libs/utils/getLanguage';
import PackageChannelList from '@/components/channelList/PackageChannelList';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import {
  BREAD_TV_SCHEDULE_LIST,
  SCHEDULE_META,
} from '@/models/scheduleTV.model';
import h1Img from 'public/Images/packages/Popcorn-icon.png';
import ArticleWrapper from '@/components/article/ArticleWrapper';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import { ELanguage } from '@/models/language.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import {
  META_ONLINE_CHANNEL_LIST,
  ONLINE_CHANNEL_LIST_DATA,
  ONLINE_CHANNEL_LIST_IMAGES,
} from '@/models/channels/onlineChannelListMeta.model';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const { metaDescription, metaH1, metaKeywords } = SCHEDULE_META.channelList;

const { getH1After } = META_ONLINE_CHANNEL_LIST;

const { h1Image } = ONLINE_CHANNEL_LIST_IMAGES;
const {
  fieldsetFilters: {},
} = ONLINE_CHANNEL_LIST_DATA;

const { CHANNELS_TV_PROGRAM } = EUrlBaseParam;

interface IPageProps {
  params: { [_key in EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

export const revalidate = 43200; // 3600 * 12 invalidate cache every 12 hours

export const generateMetadata = async ({
  params,
}: IPageProps): Promise<Metadata> => {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

  return {
    metadataBase: new URL(BASE_URL),
    title: metaH1[lang],
    description: metaDescription[lang],
    keywords: metaKeywords[lang],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaH1[lang],
      description: metaDescription[lang],
      url: `/${lang}/${CHANNELS_TV_PROGRAM}`,
      publishedTime: getFormattedDateStrYearFirst('', lang),
    },
    alternates: {
      canonical: `/${lang}/${CHANNELS_TV_PROGRAM}`,
      languages: {
        en: `/${EN}/${CHANNELS_TV_PROGRAM}`,
        uk: `/${UA}/${CHANNELS_TV_PROGRAM}`,
        ru: `/${RU}/${CHANNELS_TV_PROGRAM}`,
        es: `/${ES}/${CHANNELS_TV_PROGRAM}`,
        ar: `/${AR}/${CHANNELS_TV_PROGRAM}`,
        de: `/${DE}/${CHANNELS_TV_PROGRAM}`,
        fr: `/${FR}/${CHANNELS_TV_PROGRAM}`,
        it: `/${IT}/${CHANNELS_TV_PROGRAM}`,
      },
    },
  };
};

export default async function Page({ searchParams, params }: IPageProps) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  let searchQueryChannel = '';

  if (searchParams) {
    const { validSearchParam } = await import('@/libs/utils/validSearchParam');

    searchQueryChannel = validSearchParam(
      EUrlSearchParam.CHANNEL,
      searchParams
    );
  }

  const getChannelsFn = () => getChannelsWithSchedule(lang, searchQueryChannel);

  const todayStr = getFormattedDateStrYearFirst('', lang);

  return (
    <>
      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[BREAD_TV_SCHEDULE_LIST, metaH1[lang]]}
      />

      <ArticleWrapper lang={lang}>
        <Title>
          {metaH1[lang]}
          {getH1After(searchQueryChannel)[lang]}
          <Image src={h1Img} alt={h1Image.alt[lang]} priority />
        </Title>

        <Suspense key={searchQueryChannel}>
          <PackageChannelList
            lang={lang}
            isGenre
            pathToChannelDetails={CHANNELS_TV_PROGRAM}
            getChannelsFn={getChannelsFn}
            todayStr={todayStr}
          />
        </Suspense>
      </ArticleWrapper>
    </>
  );
}
