import { Title } from '@/components/ui/Titles/Title';
import { getChannelsWithSchedule } from '@/controllers/channelList.controller';
import {
  CHANNEL_LIST_ANCHOR_START,
  META_ALL_SAT_CHANNEL_LIST,
  META_ONLINE_CHANNEL_LIST,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import FillingImg from '@/components/ui/Images/FillingImage';
import Fieldset from '@/components/ui/Fieldset/Fieldset';
import {
  TSearchParams,
  DEFAULT_META_DATA,
  DEFAULT_LANG,
  ELanguage,
} from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam, MAIN_URL } from '@/models/url.model';
import Filter from '@/components/ui/Filter/Filter';
import { Suspense } from 'react';
import { getELangKey, validSearchParam } from '@/libs/utils/validSearchParam';
import TooltipSimple from '@/components/ui/tooltips/TooltipSimple/TooltipSimple';
import Link from 'next/link';
import GenreImage from '@/components/ui/Images/GenreImage/GenreImage';
import PackageChannelList from '@/components/channelList/PackageChannelList';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { SCHEDULE_META } from '@/models/scheduleTV.model';
import { BREAD_CRUMBS } from '@/models/breadCrumbs.model';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const { metaDescription, metaH1, metaKeywords } = SCHEDULE_META.channelList;

const {
  getH1After,
  images: { h1Image },
  fieldsetFilters: {
    legendText,
    anchorLink: { ariaLabel },
  },
} = META_ONLINE_CHANNEL_LIST;

const {
  filtering: {
    filterByChannelName: { placeholder, labelTitle },
  },
} = META_ALL_SAT_CHANNEL_LIST;

const { CHANNELS_TV_PROGRAM } = EUrlBaseParam;

interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({
  params,
}: IPageProps): Promise<Metadata> => {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

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
      publishedTime: getFormattedDateStrYearFirst(),
    },
    alternates: {
      canonical: `/${DEFAULT_LANG}/${CHANNELS_TV_PROGRAM}`,
      languages: {
        en: `/${ELanguage.EN}/${CHANNELS_TV_PROGRAM}`,
        uk: `/${ELanguage.UA}/${CHANNELS_TV_PROGRAM}`,
      },
    },
  };
};

export default async function Page({ searchParams, params }: IPageProps) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const searchQueryChannel = validSearchParam(
    EUrlSearchParam.CHANNEL,
    searchParams
  );

  const onlineChannels = await getChannelsWithSchedule(searchQueryChannel);
  const todayStr = getFormattedDateStrYearFirst();

  return (
    <>
      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[BREAD_CRUMBS.ONLINE_CHANNEL_LIST, metaH1[lang]]}
      />
      <article className="article">
        <Title>
          {metaH1[lang]}
          {getH1After(searchQueryChannel)[lang]}
          <FillingImg {...h1Image} alt={h1Image.alt[lang]} />
        </Title>

        <Fieldset legendText={legendText[lang]}>
          <nav className="p-2 md:p-4">
            <ul>
              {onlineChannels.map(([genreTitle, chanList]) => (
                <li key={genreTitle} className="flex items-center gap-4">
                  <GenreImage
                    lang={lang}
                    tooltipText={genreTitle}
                    genreMapPosition={chanList[0].genre_id}
                  />
                  <TooltipSimple
                    tooltipText={`${ariaLabel[lang]} ${genreTitle}`}
                  >
                    <Link
                      title={genreTitle}
                      href={`#${CHANNEL_LIST_ANCHOR_START}${chanList[0].genre_id}`}
                      className="text-indigo-800 text-lg hover:text-red-500"
                      aria-label={`${ariaLabel[lang]} ${genreTitle}`}
                    >
                      {genreTitle}
                    </Link>
                  </TooltipSimple>
                </li>
              ))}
            </ul>
            <Suspense>
              <Filter
                lang={lang}
                idName="channel-search-input"
                placeholder={placeholder[lang]}
                labelTitle={labelTitle[lang]}
                searchQueryTitle={EUrlSearchParam.CHANNEL}
              />
            </Suspense>
          </nav>
        </Fieldset>

        <Suspense key={searchQueryChannel}>
          <PackageChannelList
            lang={lang}
            pathToChannelDetails={CHANNELS_TV_PROGRAM}
            channels={onlineChannels}
            todayStr={todayStr}
          />
        </Suspense>
      </article>
    </>
  );
}
