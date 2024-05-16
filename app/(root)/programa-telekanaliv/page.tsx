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
  LANGUAGE as L,
  TSearchParams,
  DEFAULT_META_DATA,
} from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import Filter from '@/components/ui/Filter/Filter';
import { Suspense } from 'react';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import TooltipSimple from '@/components/ui/tooltips/TooltipSimple/TooltipSimple';
import Link from 'next/link';
import GenreImage from '@/components/ui/Images/GenreImage/GenreImage';
import PackageChannelList from '@/components/channelList/PackageChannelList';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { SCHEDULE_META } from '@/models/scheduleTV.model';
import { BREAD_CRUMBS } from '@/models/breadCrumbs.model';

const BASE_URL = process.env.BASE_URL;

const todayStr = getFormattedDateStrYearFirst();

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

export const metadata: Metadata = {
  title: metaH1[L],
  description: metaDescription[L],
  keywords: metaKeywords[L],
  openGraph: {
    ...DEFAULT_META_DATA.openGraph,
    title: metaH1[L],
    description: metaDescription[L],
    url: `${BASE_URL}/${EUrlBaseParam.CHANNELS_TV_PROGRAM}`,
    publishedTime: todayStr,
  },
};
interface IPageProps {
  searchParams?: TSearchParams;
}

export default async function Page({ searchParams }: IPageProps) {
  const searchQueryChannel = validSearchParam(
    EUrlSearchParam.CHANNEL,
    searchParams
  );

  const onlineChannels =
    (await getChannelsWithSchedule(searchQueryChannel)) || [];

  return (
    <>
      <BreadCrumbServer
        breadCrumbList={[BREAD_CRUMBS.ONLINE_CHANNEL_LIST, metaH1[L]]}
      />
      <article className="article">
        <Title>
          {metaH1[L]}
          {getH1After(searchQueryChannel)[L]}
          <FillingImg {...h1Image} alt={h1Image.alt[L]} />
        </Title>

        <Fieldset legendText={legendText[L]}>
          <nav className="p-2 md:p-4">
            <ul>
              {onlineChannels.map(([genreTitle, chanList]) => (
                <li key={genreTitle} className="flex items-center gap-4">
                  <GenreImage
                    tooltipText={genreTitle}
                    genreMapPosition={chanList[0].genre_id}
                  />
                  <TooltipSimple tooltipText={`${ariaLabel[L]} ${genreTitle}`}>
                    <Link
                      title={genreTitle}
                      href={`#${CHANNEL_LIST_ANCHOR_START}${chanList[0].genre_id}`}
                      className="text-indigo-800 text-lg hover:text-red-500"
                      aria-label={`${ariaLabel[L]} ${genreTitle}`}
                    >
                      {genreTitle}
                    </Link>
                  </TooltipSimple>
                </li>
              ))}
            </ul>
            <Filter
              idName="channel-search-input"
              placeholder={placeholder[L]}
              labelTitle={labelTitle[L]}
              searchQueryTitle={EUrlSearchParam.CHANNEL}
            />
          </nav>
        </Fieldset>

        <Suspense key={searchQueryChannel}>
          <PackageChannelList
            pathToChannelDetails={EUrlBaseParam.CHANNELS_TV_PROGRAM}
            channels={onlineChannels}
            todayStr={todayStr}
          />
        </Suspense>
      </article>
    </>
  );
}
