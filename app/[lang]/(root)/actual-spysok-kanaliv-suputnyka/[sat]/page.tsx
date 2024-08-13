import DangerHtmlUl from '@/components/ui/DangerHtml/DangerHtml';
import { Title } from '@/components/ui/Titles/Title';
import {
  getFlySatChannels,
  getFlyGroupedChannelsAllSat,
} from '@/controllers/channelList.controller';
import { getFlyChannelSatList } from '@/controllers/sidebar.controller';
import {
  META_SAT_CHANNEL_LIST,
  START_CONTENT,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import StartArticleSection from '@/components/article/StartArticleSection/StartArticleSection';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import { cache } from 'react';
import {
  DEFAULT_LANG,
  DEFAULT_META_DATA,
  EDBTableTitles,
  ELanguage,
} from '@/models/ui.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import { getCommentsNumber } from '@/controllers/comments.controller';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { BREAD_CRUMBS } from '@/models/breadCrumbs.model';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { getELangKey } from '@/libs/utils/validSearchParam';
import FlyChannelsTable from '@/components/SatChannelsTable/FlyChannelsTable';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const { SATELLITE, LANG, SAT_CHANNEL_LIST_FLY } = EUrlBaseParam;

const {
  getH1,
  metaDescription,
  metaTitle,
  images: { h1SatImage },
} = META_SAT_CHANNEL_LIST;

export interface IPageParams {
  params: { [key in EUrlBaseParam]: string };
}

const satListResponse = await getFlyChannelSatList();

const getCurrentSatParams = cache((satSlug: string) => {
  const satParams =
    satListResponse instanceof Error
      ? ''
      : satListResponse.find((sat) => sat.cpu === satSlug);

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
  const sat = params[SATELLITE];
  const lang = getELangKey(params[LANG]);

  const { title, satPosition, slug } = getCurrentSatParams(sat);

  const satTitle = `${title} - ${satPosition}`;
  const fullMetaTitle = `${metaTitle[lang]} ${satTitle}`;
  const description = `${metaDescription[lang]} ${satTitle}`;
  const slugPath = `${SAT_CHANNEL_LIST_FLY}/${slug}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: fullMetaTitle,
    description,
    keywords: description,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: fullMetaTitle,
      description,
      url: `/${lang}/${slugPath}`,
      publishedTime: getFormattedDateStrYearFirst(),
    },
    alternates: {
      canonical: `/${DEFAULT_LANG}/${slugPath}`,
      languages: {
        en: `/${ELanguage.EN}/${slugPath}`,
        uk: `/${ELanguage.UA}/${slugPath}`,
      },
    },
  };
};

export async function generateStaticParams(): Promise<
  {
    [SATELLITE]: string;
  }[]
> {
  if (satListResponse instanceof Error) return [{ [SATELLITE]: '' }];

  return satListResponse.map((sat) => ({ [SATELLITE]: sat.cpu }));
}

export const dynamicParams = false;

export default async function Page({ params }: IPageParams) {
  const sat = params[SATELLITE];
  const lang = getELangKey(params[LANG]);

  const { id, slug, title, logo, satPosition } = getCurrentSatParams(sat);

  const satChannels = await getFlySatChannels('', slug);

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_SATELLITE,
    id
  );

  return (
    <>
      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[
          BREAD_CRUMBS.SAT_CHANNEL_LIST_FLY,
          `${title} - ${satPosition}`,
        ]}
      />
      <article className="article">
        <Title>
          {getH1(`${title} - ${satPosition}`)[lang]}
          <FillingValidImage
            image={{
              ...h1SatImage,
              src: `${h1SatImage.path}${logo}`,
            }}
            defaultImage={h1SatImage.defaultImage}
            alternativeImgString={h1SatImage.alternativeString}
            alt={`${h1SatImage.alt[lang]} ${title}`}
            isBlur
          />
        </Title>
        <StartArticleSection>
          <DangerHtmlUl wrapperTagName="p" text={START_CONTENT[lang]} />
        </StartArticleSection>
        <FlyChannelsTable
          lang={lang}
          isSingleSat
          satChannels={getFlyGroupedChannelsAllSat([satChannels])}
        />
      </article>

      <CommentBlock
        lang={lang}
        numberOfComments={numberOfComments}
        revalidateUrl={`/${lang}/${SAT_CHANNEL_LIST_FLY}/${slug}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_SATELLITE}
        articleId={id}
        articleName={`${metaTitle[lang]} ${title} - ${satPosition}`}
      />
    </>
  );
}
