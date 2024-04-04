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
import Fieldset from '@/components/Fieldset/Fieldset';
import {
  CURRENT_LANGUAGE,
  TSearchParams,
  defaultMetaData,
} from '@/models/ui.model';
import { getFormattedDateStr } from '@/libs/utils';
import {
  EUrlBaseParam,
  EUrlSearchParam,
  SITE_BASE_URL,
} from '@/models/url.model';
import Filter from '@/components/Filter/Filter';
import { Suspense } from 'react';
import AnchorListItem from '@/components/AnchorListItem/AnchorListItem';
import { getChannelSatList } from '@/controllers/sidebar.controller';
import ChannelFormatSliders from '@/components/ChannelFormatSliders/ChannelFormatSliders';

const {
  getTitle,
  getDescription,
  getKeywords,
  getH1,
  image: { h1ImageParams },
  anchors,
  filtering: {
    filterByChannelName: { placeholder, labelTitle },
    filterByChannelFormat: { formats },
  },
} = META_ALL_SAT_CHANNEL_LIST;

export const metadata: Metadata = {
  title: getTitle()[CURRENT_LANGUAGE],
  description: getDescription()[CURRENT_LANGUAGE],
  keywords: getKeywords()[CURRENT_LANGUAGE],
  openGraph: {
    ...defaultMetaData.openGraph,
    title: getTitle()[CURRENT_LANGUAGE],
    description: getDescription()[CURRENT_LANGUAGE],
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

  const satChannels = await getSatChannels(
    searchQueryChannel,
    '',
    searchParams?.[EUrlSearchParam.SAT],
    !!searchParams?.[EUrlSearchParam.CHANNEL_FORMAT_MPG4],
    !!searchParams?.[EUrlSearchParam.CHANNEL_FORMAT_T2MI]
  );

  if (satChannels instanceof Error)
    return <EmptyData description={satChannels.message} />;

  const satListResults = await getChannelSatList();
  const satList = satListResults instanceof Error ? [] : satListResults;

  const groupedChannelsAllSat = getGroupedChannelsAllSat([satChannels]);

  const satLinks = satList.map((sat) => ({
    title: `${sat.title} - ${sat.position}`,
    slug: sat.cpu,
  }));

  return (
    <>
      <Title>
        {getH1()[CURRENT_LANGUAGE]}
        <FillingImg
          src={h1ImageParams.path}
          alt={h1ImageParams.alt[CURRENT_LANGUAGE]}
          width={h1ImageParams.width}
          height={h1ImageParams.height}
        />
      </Title>
      <Fieldset legendText={anchors.legendTitle[CURRENT_LANGUAGE]}>
        <nav>
          <ul>
            {satLinks.map((satLink) => (
              <li key={satLink.slug}>
                <AnchorListItem
                  linkParams={{
                    title: satLink.title,
                    href: `#${satLink.slug}`,
                  }}
                  inputAttributes={{
                    value: satLink.slug,
                    id: `chb-${satLink.slug}`,
                    name: satLink.slug,
                  }}
                  searchQueryName={EUrlSearchParam.SAT}
                />
              </li>
            ))}
            {formats.map((format) => (
              <li key={format.searchQueryName}>
                <ChannelFormatSliders {...format} />
              </li>
            ))}
          </ul>
          <Filter
            placeholder={placeholder[CURRENT_LANGUAGE]}
            labelTitle={labelTitle[CURRENT_LANGUAGE]}
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
