import DangerHtmlUl from '@/components/ui/DangerHtml/DangerHtml';
import { Title } from '@/components/ui/Titles/Title';
import {
  getSatChannels,
  getGroupedChannelsAllSat,
} from '@/controllers/channelList.controller';
import { getChannelSatList } from '@/controllers/sidebar.controller';
import {
  META_SAT_CHANNEL_LIST,
  START_CONTENT,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import StartArticleSection from '@/components/article/StartArticleSection/StartArticleSection';
import SatChannelsTable from '@/components/SatChannelsTable/SatChannelsTable';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import { cache } from 'react';
import { LANGUAGE, DEFAULT_META_DATA, EDBTableTitles } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { getCommentsNumber } from '@/controllers/comments.controller';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { BREAD_CRUMBS } from '@/models/breadCrumbs.model';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';

const BASE_URL = process.env.BASE_URL;

const {
  getH1,
  metaDescription,
  metaTitle,
  images: { h1SatImage },
} = META_SAT_CHANNEL_LIST;

export interface IPageParams {
  params: { sat: string };
}

const satListResponse = await getChannelSatList();

const getCurrentSatParams = cache((satCpu: string) => {
  const satParams =
    satListResponse instanceof Error
      ? ''
      : satListResponse.find((sat) => sat.cpu === satCpu);

  return satParams
    ? {
        title: satParams.title,
        id: `${satParams.id}`,
        satPosition: satParams.position,
        logo: satParams.logo,
        slug: satParams.cpu,
      }
    : { title: '', id: '-1', satPosition: -1, logo: '', slug: '' };
});

export const dynamic = 'force-dynamic';

export const generateMetadata = ({ params }: IPageParams): Metadata => {
  const { title, satPosition, slug } = getCurrentSatParams(params.sat);

  const satTitle = `${title} - ${satPosition}`;
  const fullMetaTitle = `${metaTitle[LANGUAGE]} ${satTitle}`;
  const description = `${metaDescription[LANGUAGE]} ${satTitle}`;

  return {
    title: fullMetaTitle,
    description,
    keywords: description,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: fullMetaTitle,
      description,
      url: `${BASE_URL}/${EUrlBaseParam.SAT_CHANNEL_LIST}/${slug}`,
      publishedTime: getFormattedDateStrYearFirst(),
    },
  };
};

export async function generateStaticParams(): Promise<
  {
    sat: string;
  }[]
> {
  if (satListResponse instanceof Error) return [{ sat: '' }];

  return satListResponse.map((sat) => ({ sat: sat.cpu }));
}

export const dynamicParams = false;

export default async function Page({ params }: IPageParams) {
  const { id, slug, title, logo, satPosition } = getCurrentSatParams(
    params.sat
  );

  const satChannels = await getSatChannels('', id);

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_SATELLITE,
    id
  );

  return (
    <>
      <BreadCrumbServer
        breadCrumbList={[
          BREAD_CRUMBS.SAT_CHANNEL_LIST,
          `${title} - ${satPosition}`,
        ]}
      />
      <article className="article">
        <Title>
          {getH1(`${title} - ${satPosition}`)[LANGUAGE]}
          <FillingValidImage
            image={{
              ...h1SatImage,
              src: `${h1SatImage.path}${logo}`,
            }}
            defaultImage={h1SatImage.defaultImage}
            alternativeImgString={h1SatImage.alternativeString}
            alt={`${h1SatImage.alt[LANGUAGE]} ${title}`}
            isBlur
          />
        </Title>
        <StartArticleSection>
          <DangerHtmlUl wrapperTagName="p" text={START_CONTENT[LANGUAGE]} />
        </StartArticleSection>
        <SatChannelsTable
          isSingleSat
          satChannels={getGroupedChannelsAllSat([satChannels])}
        />
      </article>

      <CommentBlock
        numberOfComments={numberOfComments}
        revalidateUrl={`/${EUrlBaseParam.SAT_CHANNEL_LIST}/${slug}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_SATELLITE}
        articleId={id}
        articleName={`${metaTitle[LANGUAGE]} ${title} - ${satPosition}`}
      />
    </>
  );
}
