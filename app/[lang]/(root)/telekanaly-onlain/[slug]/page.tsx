import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import NoteBlock from '@/components/ui/NoteBlock/NoteBlock';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import { Title } from '@/components/ui/Titles/Title';
import TvScheduleLink from '@/components/TvScheduleLink/TvScheduleLink';
import { updateViewCount } from '@/controllers/articles.controller';
import { getDBOnlineChannel } from '@/controllers/channel.controller';
import {
  CHANNEL_IMAGES,
  CHANNEL_RESPONSIBILITIES,
  META_CHANNEL_ONLINE,
  SIMILAR_ARTICLE_TITLE,
  SIMILAR_CHANNELS_TITLE,
} from '@/models/channel.model';
import {
  EDBTableTitles,
  DEFAULT_META_DATA,
  ELanguage,
} from '@/models/ui.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
// import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
// import { getCommentsNumber } from '@/controllers/comments.controller';
import ChannelOnlineParams from '@/components/ChannelParams/ChannelOnlineParams';
import OnlinePlayerTabs from '@/components/tabs/OnlinePlayerTabs';
import GrooveLine from '@/components/ui/GrooveLine';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { cache, Suspense } from 'react';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { getELangKey } from '@/libs/utils/validSearchParam';
import { INFO_PANEL_TITLES } from '@/models/articles.model';
import SimilarChannels from '@/components/SimilarArticles/SimilarChannels';
import ArticleWrapper from '@/components/article/ArticleWrapper';

const BASE_URL = process.env.BASE_URL || MAIN_URL;
const { LANG, SLUG, CHANNELS_TV_PROGRAM, ONLINE_CHANNEL_LIST } = EUrlBaseParam;

const { noteTitle, getResponsibilityText } = CHANNEL_RESPONSIBILITIES;

const {
  // comments: commentsTitle,
  views: viewsTitle,
} = INFO_PANEL_TITLES;

const {
  channelLogo: { big: bigLogo },
} = CHANNEL_IMAGES;

const { getDescription, getH1, getKeywords, getTitle } = META_CHANNEL_ONLINE;

const getH1Cached = cache(getH1);

export interface IChannelProps {
  params: { [key in EUrlBaseParam]: string };
}

export const revalidate = 172800; // 3600 * 48 invalidate cache every 2 days

export const generateMetadata = async ({
  params,
}: IChannelProps): Promise<Metadata> => {
  const slug = params[SLUG];
  const lang = getELangKey(params[LANG]);

  const sqlResult = await getDBOnlineChannel(slug);
  if (!sqlResult) return DEFAULT_META_DATA[lang];

  const { title: chTitle, description: descr, chan_slug } = sqlResult;
  const description = getDescription(chTitle, descr)[lang];
  const title = getTitle(chTitle)[lang];

  const slugPath = `${ONLINE_CHANNEL_LIST}/${chan_slug}`;

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    keywords: getKeywords(title)[lang],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title,
      description,
      url: `/${lang}/${slugPath}`,
      publishedTime: getFormattedDateStrYearFirst(),
    },
    alternates: {
      canonical: `/${lang}/${slugPath}`,
      languages: {
        en: `/${ELanguage.EN}/${slugPath}`,
        uk: `/${ELanguage.UA}/${slugPath}`,
      },
    },
  };
};

export default async function Page({ params }: IChannelProps) {
  const slug = params[SLUG];
  if (!slug) notFound();

  const lang = getELangKey(params[LANG]);

  const sqlResult = await getDBOnlineChannel(slug);

  if (!sqlResult) notFound();

  const { id, title, logo, text, view } = sqlResult;
  // const { id, title, logo, text, view, chan_slug } = sqlResult;

  // const numberOfComments = await getCommentsNumber(
  //   EDBTableTitles.COMMENTS_CHANNEL,
  //   `${id}`
  // );

  updateViewCount(EDBTableTitles.CHANNELS, `${id}`, view);

  return (
    <>
      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[
          {
            href: EUrlBaseParam.ONLINE_CHANNEL_LIST,
            title: {
              [ELanguage.UA]: 'Список онлайн каналів',
              [ELanguage.EN]: 'Online channel list',
            },
          },
          getH1Cached(title)[lang],
        ]}
      />
      <ArticleWrapper lang={lang}>
        <Title>
          {getH1Cached(title)[lang]}
          <FillingValidImage
            image={{
              ...bigLogo,
              src: `${bigLogo.path}${logo}`,
            }}
            defaultImage={bigLogo.defaultImage}
            alt={`${bigLogo.alt[lang]} "${title}"`}
            isPriority
          />
        </Title>
        <OnlinePlayerTabs lang={lang} channelData={sqlResult} />

        <GrooveLine />

        {/* <ScheduleShort lang={lang} channelData={sqlResult} /> */}

        <div className="article-text">
          <DangerHtml text={text} />
        </div>

        <GrooveLine />

        <TvScheduleLink
          isOnlinePage
          lang={lang}
          title={title}
          href={`/${lang}/${CHANNELS_TV_PROGRAM}/${slug}/${getFormattedDateStrYearFirst()}`}
        />

        <ChannelOnlineParams lang={lang} channelDBParams={sqlResult} />

        <NoteBlock noteTitle={noteTitle[lang]}>
          {getResponsibilityText(title)[lang]}
        </NoteBlock>

        <BottomInfoPanel
          items={[
            {
              name: viewsTitle[lang],
              value: view + 1,
            },
            // { name: commentsTitle[lang], value: numberOfComments },
          ]}
        />
      </ArticleWrapper>

      <Suspense>
        <SimilarChannels
          lang={lang}
          chanelTitle={title}
          sectionCaption={`${SIMILAR_CHANNELS_TITLE[lang]} "${title}"`}
        />
      </Suspense>

      <Suspense>
        <SimilarArticles
          similarTitle={SIMILAR_ARTICLE_TITLE[lang]}
          logoSrc={logo}
          lang={lang}
        />
      </Suspense>
    </>
  );
}

// <CommentBlock
//   lang={lang}
//   numberOfComments={numberOfComments}
//   revalidateUrl={`/${lang}/${ONLINE_CHANNEL_LIST}/${chan_slug}`}
//   dbCommentTableName={EDBTableTitles.COMMENTS_CHANNEL}
//   articleId={`${id}`}
//   articleName={title}
// />
