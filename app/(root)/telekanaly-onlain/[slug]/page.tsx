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
import { LANGUAGE, EDBTableTitles, DEFAULT_META_DATA } from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import { getCommentsNumber } from '@/controllers/comments.controller';
import ChannelOnlineParams from '@/components/ChannelParams/ChannelOnlineParams';
import { headers } from 'next/headers';
import OnlinePlayerTabs from '@/components/OnlinePlayerTabs/OnlinePlayerTabs';
import GrooveLine from '@/components/ui/GrooveLine';

const BASE_URL = process.env.BASE_URL;

const {
  images: {
    channelLogo: { big: bigLogo },
  },
  infoPanelTitles: { comments: commentsTitle, views: viewsTitle },
  scheduleLinkText: { channel: scheduleTitle },
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
    return DEFAULT_META_DATA[LANGUAGE];

  const { title, description, chan_slug } = sqlResult[0];

  return {
    title: getTitle(title)[LANGUAGE],
    description: getDescription(title, description)[LANGUAGE],
    keywords: getKeywords(title)[LANGUAGE],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: getTitle(title)[LANGUAGE],
      description: getDescription(title, description)[LANGUAGE],
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

  const {
    id,
    title,
    logo,
    text,
    view,
    chan_slug,
    tvforsite_net,
    other_stream,
    potok,
  } = sqlResult[0];

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

  updateViewCount(EDBTableTitles.CHANNELS, `${id}`, view);

  const forwarded = headers();
  console.log('🚀 ~ Page ~ forwarded:', forwarded.get('x-forwarded-for'));
  // console.log('🚀 ~ requestIp:', requestIp.getClientIp('x-forwarded-for'));

  return (
    <>
      <article className="article">
        <Title>
          {getH1(title)[LANGUAGE]}
          <FillingValidImage
            image={{
              ...bigLogo,
              src: `${bigLogo.path}${logo}`,
            }}
            defaultImage={bigLogo.defaultImage}
            alternativeImgString={bigLogo.alternativeImgStr}
            alt={`${bigLogo.alt[LANGUAGE]} "${title}"`}
            isBlur
          />
        </Title>

        {[tvforsite_net, potok, other_stream].map((src, i) => (
          <p key={i}>
            {i}: {src}
          </p>
        ))}

        <OnlinePlayerTabs channelData={sqlResult[0]} allowedCountryCode="UA" />

        {/* <FakePlayer url={tvforsite_net} chanTitles={title} /> */}

        <div className="article-text">
          <DangerHtml text={text} />

          <GrooveLine />

          <TvScheduleLink
            title={`${scheduleTitle[LANGUAGE]} "${title}"`}
            href={`/${EUrlBaseParam.CHANNELS_TV_PROGRAM}/${slug}?${EUrlSearchParam.DATE}=${getFormattedDateStr()}`}
          />

          <ChannelOnlineParams channelDBParams={sqlResult[0]} />

          <NoteBlock noteTitle={noteTitle[LANGUAGE]}>
            {getResponsibilityText(title)[LANGUAGE]}
          </NoteBlock>
        </div>

        <BottomInfoPanel
          items={[
            {
              name: viewsTitle[LANGUAGE],
              value: (view + 1).toLocaleString('en-US'),
            },
            { name: commentsTitle[LANGUAGE], value: numberOfComments },
          ]}
        />
      </article>

      {similarChannels.length ? (
        <SimilarArticles
          similarTitle={`${simChannelsBefore.title[LANGUAGE]} "${title}"`}
          similarArticlesMapped={similarChannels.map((chan) => (
            <li key={chan.cpu}>
              <SimilarChannel channelTitle={title} chanParams={chan} />
            </li>
          ))}
        />
      ) : null}

      {similarArticles.length ? (
        <SimilarArticles
          similarTitle={simArticlesBefore.title[LANGUAGE]}
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
