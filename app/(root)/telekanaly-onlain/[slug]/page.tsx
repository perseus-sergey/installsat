import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import NoteBlock from '@/components/ui/NoteBlock/NoteBlock';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import SimilarChannel from '@/components/SimilarChannel/SimilarChannel';
import { Title } from '@/components/ui/Titles/Title';
import TvScheduleLink from '@/components/TvScheduleLink/TvScheduleLink';
import {
  getSimilarArticles,
  updateViewCount,
} from '@/controllers/articles.controller';
import {
  getDBOnlineChannel,
  getSimilarChannels,
} from '@/controllers/channel.controller';
import { getFormattedDateStr } from '@/libs/utils/utils';
import { META_CHANNEL, META_CHANNEL_ONLINE } from '@/models/channel.model';
import {
  LANGUAGE as L,
  EDBTableTitles,
  DEFAULT_META_DATA,
} from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import { getCommentsNumber } from '@/controllers/comments.controller';
import ChannelOnlineParams from '@/components/ChannelParams/ChannelOnlineParams';
import OnlinePlayerTabs from '@/components/OnlinePlayerTabs/OnlinePlayerTabs';
import GrooveLine from '@/components/ui/GrooveLine';
import ScheduleShort from '@/components/Schedule/ScheduleShort';
import { fetchUserLocation } from '@/libs/utils/getUserIP';

const BASE_URL = process.env.BASE_URL;

const {
  images: {
    channelLogo: { big: bigLogo },
  },
  infoPanelTitles: { comments: commentsTitle, views: viewsTitle },
  scheduleLinkText: { onlineChannel: scheduleTitle },
  noteTitle,
  getResponsibilityText,
  similar: { channels: simChannelsBefore, articles: simArticlesBefore },
} = META_CHANNEL;

const { getDescription, getH1, getKeywords, getTitle } = META_CHANNEL_ONLINE;

export interface IChannelProps {
  params: { slug: string };
}

export const generateMetadata = async ({
  params: { slug },
}: IChannelProps): Promise<Metadata> => {
  const sqlResult = await getDBOnlineChannel(slug);
  if (sqlResult instanceof Error || !sqlResult.length)
    return DEFAULT_META_DATA[L];

  const { title, description, chan_slug } = sqlResult[0];

  return {
    title: getTitle(title)[L],
    description: getDescription(title, description)[L],
    keywords: getKeywords(title)[L],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: getTitle(title)[L],
      description: getDescription(title, description)[L],
      url: `${BASE_URL}/${EUrlBaseParam.ONLINE_CHANNEL_LIST}/${chan_slug}`,
      publishedTime: getFormattedDateStr(),
    },
  };
};

export default async function Page({ params: { slug } }: IChannelProps) {
  const sqlResult = await getDBOnlineChannel(slug);

  if (sqlResult instanceof Error)
    return <EmptyData description={sqlResult.message} />;
  if (!sqlResult.length) notFound();

  const { id, title, logo, text, view, chan_slug } = sqlResult[0];

  const similarChannelsResult = await getSimilarChannels(logo);
  const similarChannels =
    similarChannelsResult instanceof Error ? [] : similarChannelsResult;

  const similarArticlesResult = await getSimilarArticles(logo);
  const similarArticles =
    similarArticlesResult instanceof Error ? [] : similarArticlesResult;

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
      <article className="article">
        <Title>
          {getH1(title)[L]}
          <FillingValidImage
            image={{
              ...bigLogo,
              src: `${bigLogo.path}${logo}`,
            }}
            defaultImage={bigLogo.defaultImage}
            alternativeImgString={bigLogo.alternativeImgStr}
            alt={`${bigLogo.alt[L]} "${title}"`}
            isBlur
          />
        </Title>
        <OnlinePlayerTabs
          channelData={sqlResult[0]}
          userCountryCode={userCountryCode}
        />

        <GrooveLine />
        <ScheduleShort channelData={sqlResult[0]} />

        <div className="article-text">
          <DangerHtml text={text} />

          <GrooveLine />

          <TvScheduleLink
            title={`${scheduleTitle[L]} "${title}"`}
            href={`/${EUrlBaseParam.CHANNELS_TV_PROGRAM}/${slug}?${EUrlSearchParam.DATE}=${getFormattedDateStr()}`}
          />

          <ChannelOnlineParams channelDBParams={sqlResult[0]} />

          <NoteBlock noteTitle={noteTitle[L]}>
            {getResponsibilityText(title)[L]}
          </NoteBlock>
        </div>

        <BottomInfoPanel
          items={[
            {
              name: viewsTitle[L],
              value: (view + 1).toLocaleString('en-US'),
            },
            { name: commentsTitle[L], value: numberOfComments },
          ]}
        />
      </article>

      {similarChannels.length ? (
        <SimilarArticles
          similarTitle={`${simChannelsBefore.title[L]} "${title}"`}
          similarArticlesMapped={similarChannels.map((chan) => (
            <li key={chan.cpu}>
              <SimilarChannel channelTitle={title} chanParams={chan} />
            </li>
          ))}
        />
      ) : null}

      {similarArticles.length ? (
        <SimilarArticles
          similarTitle={simArticlesBefore.title[L]}
          similarArticlesMapped={similarArticles.map((art) => (
            <li key={art.cpu}>
              <Link href={`/${EUrlBaseParam.ARTICLE}/${art.cpu}`}>
                {art.title}
              </Link>
              <span>{` (${getFormattedDateStr(art.date)})`}</span>
            </li>
          ))}
        />
      ) : null}

      <CommentBlock
        numberOfComments={numberOfComments}
        revalidateUrl={`/${EUrlBaseParam.CHANNEL_PARAMS}/${chan_slug}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_CHANNEL}
        articleId={`${id}`}
        articleName={title}
      />
    </>
  );
}
