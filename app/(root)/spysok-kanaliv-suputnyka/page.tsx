import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Title/Title';
import {
  getSatChannels,
  getGroupedChannelsAllSat,
} from '@/controllers/satChannelList.controller';
import {
  META_ALL_SAT_CHANNEL_LIST,
  START_CONTENT,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import StartArticleSection from '@/components/article/StartArticleSection/StartArticleSection';
import SatChannelsTable from '@/components/SatChannelsTable/SatChannelsTable';
import FillingImg from '@/components/Images/FillingImage';
import Fieldset from '@/components/ui/Fieldset/Fieldset';
import {
  LANGUAGE as L,
  LANGUAGE,
  TSearchParams,
  defaultMetaData,
} from '@/models/ui.model';
import { getFormattedDateStr, validSearchParam } from '@/libs/utils';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import Filter from '@/components/ui/Filter/Filter';
import { Suspense } from 'react';
import AnchorListItem from '@/components/AnchorListItem/AnchorListItem';
import { getChannelSatList } from '@/controllers/sidebar.controller';
import ChannelFormatSliders from '@/components/ui/ChannelFormatSliders/ChannelFormatSliders';

const { BASE_URL } = process.env;

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
    resetAllFiltersButton,
    satCheckBox,
    satAnchor,
  },
} = META_ALL_SAT_CHANNEL_LIST;

export const metadata: Metadata = {
  title: getTitle()[L],
  description: getDescription()[L],
  keywords: getKeywords()[L],
  openGraph: {
    ...defaultMetaData.openGraph,
    title: getTitle()[L],
    description: getDescription()[L],
    url: `${BASE_URL}/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
    publishedTime: getFormattedDateStr(new Date()),
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
        {getH1()[L]}
        <FillingImg
          src={h1ImageParams.path}
          alt={h1ImageParams.alt[L]}
          width={h1ImageParams.width}
          height={h1ImageParams.height}
        />
      </Title>
      <Fieldset legendText={anchors.legendTitle[L]}>
        <nav>
          <ul>
            {satLinks.map((satLink) => (
              <li key={satLink.slug}>
                <AnchorListItem
                  linkParams={{
                    title: satLink.title,
                    href: `#${satLink.slug}`,
                    'aria-label': satAnchor.tooltip[L],
                  }}
                  inputAttributes={{
                    value: satLink.slug,
                    id: `chb-${satLink.slug}`,
                    name: satLink.slug,
                    'aria-label': satCheckBox.tooltip[L],
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
            idName="channel-search-input"
            placeholder={placeholder[L]}
            labelTitle={labelTitle[L]}
            searchQueryTitle={EUrlSearchParam.CHANNEL}
            resetButton={{
              ariaLabel: resetAllFiltersButton.ariaLabel[L],
              content: resetAllFiltersButton.imgStr,
            }}
          />
        </nav>
      </Fieldset>
      <StartArticleSection>
        <p>{START_CONTENT[LANGUAGE]}</p>
      </StartArticleSection>
      <Suspense key={searchQueryChannel}>
        <SatChannelsTable satChannels={groupedChannelsAllSat} />
      </Suspense>
    </>
  );
}
