import { Title } from '@/components/ui/Titles/Title';
import { getOnlineChannels } from '@/controllers/channelList.controller';
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
  EDBTableTitles,
} from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import Filter from '@/components/ui/Filter/Filter';
import { Suspense } from 'react';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import { getCommentsNumber } from '@/controllers/comments.controller';
import TooltipSimple from '@/components/ui/tooltips/TooltipSimple/TooltipSimple';
import Link from 'next/link';
import GenreImage from '@/components/ui/Images/GenreImage/GenreImage';
import OnlineChannelListAfterText from '@/components/online/OnlineChannelListAfterText/OnlineChannelListAfterText';
import PackageChannelList from '@/components/channelList/PackageChannelList';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';

const BASE_URL = process.env.BASE_URL;

const {
  metaDescription,
  metaH1,
  getH1After,
  metaKeywords,
  metaTitle,
  images: { h1Image },
  ONLINE_CHANNEL_LIST_DB_ID,
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
  title: metaTitle[L],
  description: metaDescription[L],
  keywords: metaKeywords[L],
  openGraph: {
    ...DEFAULT_META_DATA.openGraph,
    title: metaTitle[L],
    description: metaDescription[L],
    url: `${BASE_URL}/${EUrlBaseParam.ONLINE_CHANNEL_LIST}`,
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

  const onlineChannels = await getOnlineChannels(searchQueryChannel);

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_GENRE,
    ONLINE_CHANNEL_LIST_DB_ID
  );

  return (
    <>
      <BreadCrumbServer breadCrumbList={[metaH1[L]]} />
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
            pathToChannelDetails={EUrlBaseParam.ONLINE_CHANNEL_LIST}
            channels={onlineChannels}
          />
        </Suspense>

        <OnlineChannelListAfterText lang={L} />
      </article>

      <CommentBlock
        numberOfComments={numberOfComments}
        revalidateUrl={`/${EUrlBaseParam.ONLINE_CHANNEL_LIST}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_GENRE}
        articleId={ONLINE_CHANNEL_LIST_DB_ID}
        articleName={metaTitle[L]}
      />
    </>
  );
}
