import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import ChannelOnlineLink from '@/components/ui/buttons/ChannelOnlineLink/ChannelOnlineLink';
import ChannelParams from '@/components/ChannelParams/ChannelParams';
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
  getDBChannel,
  getSimilarChannels,
} from '@/controllers/channel.controller';
import { META_CHANNEL } from '@/models/channel.model';
import { LANGUAGE, EDBTableTitles, DEFAULT_META_DATA } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import { getCommentsNumber } from '@/controllers/comments.controller';
import GrooveLine from '@/components/ui/GrooveLine';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { CHANNEL_LIST_ANCHOR_START } from '@/models/channelList.model';
import { BREAD_CRUMBS } from '@/models/breadCrumbs.model';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';

const BASE_URL = process.env.BASE_URL;

const {
  images: {
    channelLogo: { big: bigLogo },
  },
  infoPanelTitles: {
    package: packageTitle,
    comments: commentsTitle,
    views: viewsTitle,
  },
  titleBefore,
  keywordsBefore,
  scheduleLinkText: { channel: scheduleTitle },
  noteTitle,
  getOnlineLinkText,
  getResponsibilityText,
  similar: { channels: simChannelsBefore, articles: simArticlesBefore },
} = META_CHANNEL;

const currentDate = getFormattedDateStrYearFirst();

export interface IChannelProps {
  params: { slug: string };
}

export const generateMetadata = async ({
  params: { slug },
}: IChannelProps): Promise<Metadata> => {
  const sqlResult = await getDBChannel(slug);
  if (sqlResult instanceof Error || !sqlResult.length)
    return DEFAULT_META_DATA[LANGUAGE];

  const {
    title,
    description,
    chan_slug,
    cat_parent_id,
    cat_parent_title,
    cat_title,
    sat_title,
    freq,
    polar,
    canonical,
  } = sqlResult[0];
  const metaTitle =
    cat_parent_id > 0
      ? `${titleBefore[LANGUAGE]} ${title} | ${cat_parent_title} | ${cat_title}`
      : `${titleBefore[LANGUAGE]} ${title} | ${sat_title} ${freq} ${polar} | ${cat_title}`;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [clearedCanonical, ..._] = canonical
    .replace(/\/$/, '')
    .split('/')
    .reverse();

  const addCanonical = canonical ? clearedCanonical : chan_slug;

  return {
    title: metaTitle,
    description: description || title,
    keywords: keywordsBefore[LANGUAGE] + description,
    alternates: {
      canonical: `${BASE_URL}/${EUrlBaseParam.CHANNEL_PARAMS}/${addCanonical}`,
    },
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaTitle,
      description: description || title,
      url: `${BASE_URL}/${EUrlBaseParam.CHANNEL_PARAMS}/${chan_slug}`,
      publishedTime: currentDate,
    },
  };
};

export default async function Page({ params: { slug } }: IChannelProps) {
  const sqlResult = await getDBChannel(slug);

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
    cat_id,
    cat_title,
    cat_parent_title,
    cat_parent_id,
    cat_parent_cpu,
    cat_slug,
    sat_slug,
    sat_title,
    tvforsite_net,
  } = sqlResult[0];

  const catLink =
    cat_parent_id > 0
      ? `${cat_parent_cpu}#${CHANNEL_LIST_ANCHOR_START}${cat_id}`
      : cat_slug;

  const catTitle =
    cat_parent_id > 0 ? `${cat_parent_title} - ${cat_title}` : cat_title;

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

  return (
    <>
      <BreadCrumbServer
        breadCrumbList={[
          BREAD_CRUMBS.PACKAGE_CHANNEL_LIST,
          {
            href: `${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${catLink}`,
            title: catTitle,
          },
          {
            href: `${EUrlBaseParam.SAT_CHANNEL_LIST}/${sat_slug}`,
            title: sat_title,
          },
          `${titleBefore[LANGUAGE]} "${title}"`,
        ]}
      />
      <article className="article">
        <Title>
          {`${titleBefore[LANGUAGE]} "${title}"`}
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

        <div className="article-text">
          <DangerHtml text={text} />

          <GrooveLine className="p-4" />

          <TvScheduleLink
            title={`${scheduleTitle[LANGUAGE]} "${title}"`}
            href={`/${EUrlBaseParam.CHANNELS_TV_PROGRAM}/${slug}/${currentDate}`}
          />

          {tvforsite_net && (
            <ChannelOnlineLink
              href={`/${EUrlBaseParam.ONLINE_CHANNEL_LIST}/${slug}`}
            >
              {getOnlineLinkText(title)[LANGUAGE]}
            </ChannelOnlineLink>
          )}
          <ChannelParams channelDBParams={sqlResult[0]} />

          <NoteBlock noteTitle={noteTitle[LANGUAGE]}>
            {getResponsibilityText(title)[LANGUAGE]}
          </NoteBlock>
        </div>

        <BottomInfoPanel
          items={[
            {
              name: packageTitle[LANGUAGE],
              value: (
                <Link
                  href={`/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${catLink}`}
                >
                  {catTitle}
                </Link>
              ),
            },
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
              <span>{` (${getFormattedDateStrYearFirst(art.date)})`}</span>
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
