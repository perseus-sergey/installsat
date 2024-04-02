import EmptyData from '@/components/EmptyData/EmptyData';
import { Title } from '@/components/Title/Title';
import {
  getSatChannels,
  getGroupedChannelsAllSat,
} from '@/controllers/satChannelList.controller';
import {
  META_ALL_SAT_CHANNEL_LIST,
  START_CONTENT,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import StartArticleSection from '@/components/StartArticleSection/StartArticleSection';
import SatChannelsTable from '@/components/SatChannelsTable/SatChannelsTable';
import FillingImg from '@/components/Images/FillingImage';
import Link from 'next/link';
import Fieldset from '@/components/Fieldset/Fieldset';
import { TSearchParams, defaultMetaData } from '@/models/ui.model';
import { getFormattedDateStr } from '@/libs/utils';
import {
  EUrlBaseParam,
  EUrlSearchParam,
  SITE_BASE_URL,
} from '@/models/url.model';
import Filter from '@/components/Filter/Filter';
import { Suspense } from 'react';

const {
  getTitle,
  getDescription,
  getKeywords,
  getH1,
  image: { h1ImageParams },
  anchors,
  filtering: {
    filterByChannelName: { placeholder, labelTitle },
  },
} = META_ALL_SAT_CHANNEL_LIST;

export const metadata: Metadata = {
  title: getTitle().ua,
  description: getDescription().ua,
  keywords: getKeywords().ua,
  openGraph: {
    ...defaultMetaData.openGraph,
    title: getTitle().ua,
    description: getDescription().ua,
    url: `${SITE_BASE_URL}/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
    publishedTime: getFormattedDateStr(new Date()),
  },
};
interface IPageProps {
  searchParams?: TSearchParams;
}

export default async function Page({ searchParams }: IPageProps) {
  const searchQueryChannel =
    searchParams?.[EUrlSearchParam.CHANNEL] &&
    typeof searchParams[EUrlSearchParam.CHANNEL] === 'string'
      ? searchParams[EUrlSearchParam.CHANNEL]
      : '';

  const satChannels = await getSatChannels(searchQueryChannel);

  if (satChannels instanceof Error)
    return <EmptyData description={satChannels.message} />;

  const groupedChannelsAllSat = getGroupedChannelsAllSat([satChannels]);

  const satLinks = groupedChannelsAllSat.map((sat) => ({
    title: `${sat[0][0].sat_title} - ${sat[0][0].sat_position}`,
    slug: sat[0][0].sat_slug,
  }));

  return (
    <>
      <Title>
        {getH1().ua}
        <FillingImg
          src={h1ImageParams.path}
          alt={h1ImageParams.alt.ua}
          width={h1ImageParams.width}
          height={h1ImageParams.height}
        />
      </Title>
      <Fieldset legendText={anchors.legendTitle.ua}>
        <nav className="text-center text-xl">
          <ul>
            {satLinks.map((satLink) => (
              <li key={satLink.slug}>
                <Link
                  href={`#${satLink.slug}`}
                  className="text-indigo-800 hover:text-red-500"
                >
                  {satLink.title}
                </Link>
              </li>
            ))}
          </ul>
          <Filter
            placeholder={placeholder.ua}
            labelTitle={labelTitle.ua}
            searchQueryTitle={EUrlSearchParam.CHANNEL}
          />
        </nav>
      </Fieldset>
      <StartArticleSection>
        <p>{START_CONTENT}</p>
      </StartArticleSection>
      <Suspense key={searchQueryChannel}>
        <SatChannelsTable satChannels={groupedChannelsAllSat} />
      </Suspense>
    </>
  );
}
