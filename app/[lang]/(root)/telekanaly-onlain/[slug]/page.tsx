import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import NoteBlock from '@/components/ui/NoteBlock/NoteBlock';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import { SimilarFlyChannel } from '@/components/SimilarChannel/SimilarChannel';
import { Title } from '@/components/ui/Titles/Title';
import TvScheduleLink from '@/components/TvScheduleLink/TvScheduleLink';
import {
  getSimilarArticles,
  updateViewCount,
} from '@/controllers/articles.controller';
import {
  getDBOnlineChannel,
  getSimilarFlyChannels,
} from '@/controllers/channel.controller';
import {
  CHANNEL_IMAGES,
  CHANNEL_RESPONSIBILITIES,
  META_CHANNEL_ONLINE,
  SIMILAR,
} from '@/models/channel.model';
import {
  EDBTableTitles,
  DEFAULT_META_DATA,
  ELanguage,
} from '@/models/ui.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import { getCommentsNumber } from '@/controllers/comments.controller';
import ChannelOnlineParams from '@/components/ChannelParams/ChannelOnlineParams';
import OnlinePlayerTabs from '@/components/tabs/OnlinePlayerTabs';
import GrooveLine from '@/components/ui/GrooveLine';
import ScheduleShort from '@/components/Schedule/ScheduleShort';
import { fetchUserLocation } from '@/libs/utils/getUserIP';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { BREAD_CRUMBS } from '@/models/breadCrumbs.model';
import { cache } from 'react';
import {
  getFormattedDateStr,
  getFormattedDateStrYearFirst,
} from '@/libs/utils/dates';
import { getELangKey } from '@/libs/utils/validSearchParam';
import SeoLink from '@/components/ui/SeoLink/SeoLink';
import { INFO_PANEL_TITLES } from '@/models/articles.model';

const BASE_URL = process.env.BASE_URL || MAIN_URL;
const { LANG, SLUG, CHANNELS_TV_PROGRAM, ONLINE_CHANNEL_LIST, ARTICLE } =
  EUrlBaseParam;

const { channels: simChannelsBefore, articles: simArticlesBefore } = SIMILAR;

const { noteTitle, getResponsibilityText } = CHANNEL_RESPONSIBILITIES;

const { comments: commentsTitle, views: viewsTitle } = INFO_PANEL_TITLES;

const {
  channelLogo: { big: bigLogo },
} = CHANNEL_IMAGES;

const { getDescription, getH1, getKeywords, getTitle } = META_CHANNEL_ONLINE;

const getH1Cached = cache(getH1);

export interface IChannelProps {
  params: { [key in EUrlBaseParam]: string };
}

export const revalidate = 3600 * 48; // invalidate cache every 2 days

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

  const { id, title, logo, text, view, chan_slug } = sqlResult;

  const similarChannels = await getSimilarFlyChannels(title);

  const similarArticles = await getSimilarArticles(logo);

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_CHANNEL,
    `${id}`
  );

  const userLocation = await fetchUserLocation();

  const userCountryCode =
    userLocation && userLocation.status === 'success'
      ? userLocation.countryCode
      : '';

  updateViewCount(EDBTableTitles.CHANNELS, `${id}`, view);

  return (
    <>
      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[
          BREAD_CRUMBS.ONLINE_CHANNEL_LIST,
          getH1Cached(title)[lang],
        ]}
      />
      <article className="article">
        <Title>
          {getH1Cached(title)[lang]}
          <FillingValidImage
            image={{
              ...bigLogo,
              src: `${bigLogo.path}${logo}`,
            }}
            defaultImage={bigLogo.defaultImage}
            alt={`${bigLogo.alt[lang]} "${title}"`}
          />
        </Title>
        <OnlinePlayerTabs
          lang={lang}
          channelData={sqlResult}
          userCountryCode={userCountryCode}
        />

        <GrooveLine />

        <ScheduleShort lang={lang} channelData={sqlResult} />

        <div className="article-text">
          <DangerHtml text={text} />

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
        </div>

        <BottomInfoPanel
          items={[
            {
              name: viewsTitle[lang],
              value: view + 1,
            },
            { name: commentsTitle[lang], value: numberOfComments },
          ]}
        />
      </article>

      {similarChannels.length ? (
        <SimilarArticles
          similarTitle={`${simChannelsBefore.title[lang]} "${title}"`}
          similarArticlesMapped={similarChannels.map((chan) => (
            <li key={chan.slug}>
              <SimilarFlyChannel
                lang={lang}
                chanParams={chan}
                chanName={title}
              />
            </li>
          ))}
        />
      ) : null}

      {similarArticles.length ? (
        <SimilarArticles
          similarTitle={simArticlesBefore.title[lang]}
          similarArticlesMapped={similarArticles.map((art) => (
            <li key={art.cpu}>
              <SeoLink
                href={`/${lang}/${ARTICLE}/${art.cpu}`}
                title={
                  lang === ELanguage.UA
                    ? `Перейти до перегляду статті "${art.title}"`
                    : `Go to the view of the article "${art.title_en || art.title}"`
                }
              >
                {lang === ELanguage.UA ? art.title : art.title_en || art.title}
              </SeoLink>
              <span>{` (${getFormattedDateStr(art.date)})`}</span>
            </li>
          ))}
        />
      ) : null}

      <CommentBlock
        lang={lang}
        numberOfComments={numberOfComments}
        revalidateUrl={`/${lang}/${ONLINE_CHANNEL_LIST}/${chan_slug}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_CHANNEL}
        articleId={`${id}`}
        articleName={title}
      />
    </>
  );
}
