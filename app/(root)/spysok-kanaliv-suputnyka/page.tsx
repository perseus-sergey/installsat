import { Title } from '@/components/ui/Titles/Title';
import {
  getSatChannels,
  getGroupedChannelsAllSat,
} from '@/controllers/channelList.controller';
import {
  META_ALL_SAT_CHANNEL_LIST,
  START_CONTENT,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import StartArticleSection from '@/components/article/StartArticleSection/StartArticleSection';
import SatChannelsTable from '@/components/SatChannelsTable/SatChannelsTable';
import FillingImg from '@/components/ui/Images/FillingImage';
import Fieldset from '@/components/ui/Fieldset/Fieldset';
import {
  LANGUAGE as L,
  TSearchParams,
  DEFAULT_META_DATA,
  EDBTableTitles,
} from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import Filter from '@/components/ui/Filter/Filter';
import { Suspense } from 'react';
import AnchorListItemWithCheckbox from '@/components/AnchorListItem/AnchorListItemWithCheckbox';
import { getChannelSatList } from '@/controllers/sidebar.controller';
import ChannelFormatSliders from '@/components/ui/ChannelFormatSliders/ChannelFormatSliders';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import { getCommentsNumber } from '@/controllers/comments.controller';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { BREAD_CRUMBS } from '@/models/breadCrumbs.model';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';

const BASE_URL = process.env.BASE_URL;

const {
  metaH1,
  metaDescription,
  metaKeywords,
  metaTitle,
  image: { h1ImageParams },
  anchors,
  filtering: {
    filterByChannelName: { placeholder, labelTitle },
    filterByChannelFormat: { formats },
    resetAllFiltersButton,
    satCheckBox,
    satAnchor,
  },
  CHANNEL_LIST_DB_ID,
} = META_ALL_SAT_CHANNEL_LIST;

export const metadata: Metadata = {
  title: metaTitle[L],
  description: metaDescription[L],
  keywords: metaKeywords[L],
  openGraph: {
    ...DEFAULT_META_DATA.openGraph,
    title: metaTitle[L],
    description: metaDescription[L],
    url: `${BASE_URL}/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
    publishedTime: getFormattedDateStrYearFirst(),
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

  const satListResults = await getChannelSatList();
  const satList = satListResults instanceof Error ? [] : satListResults;

  const groupedChannelsAllSat = getGroupedChannelsAllSat([
    satChannels instanceof Error ? [] : satChannels,
  ]);

  const satLinks = satList.map((sat) => ({
    title: `${sat.title} - ${sat.position}`,
    slug: sat.cpu,
  }));

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_PACKAGES,
    CHANNEL_LIST_DB_ID
  );

  return (
    <>
      <BreadCrumbServer
        breadCrumbList={[BREAD_CRUMBS.PACKAGE_CHANNEL_LIST, metaH1[L]]}
      />
      <article className="article">
        <Title>
          {metaH1[L]}
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
                  <AnchorListItemWithCheckbox
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
          <p>{START_CONTENT[L]}</p>
        </StartArticleSection>
        <Suspense key={searchQueryChannel}>
          <SatChannelsTable satChannels={groupedChannelsAllSat} />
        </Suspense>
      </article>

      <CommentBlock
        numberOfComments={numberOfComments}
        revalidateUrl={`/${EUrlBaseParam.SAT_CHANNEL_LIST}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_PACKAGES}
        articleId={CHANNEL_LIST_DB_ID}
        articleName={metaTitle[L]}
      />
    </>
  );
}
