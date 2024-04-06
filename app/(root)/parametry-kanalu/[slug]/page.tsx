import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import ChannelOnlineLink from '@/components/ChannelOnlineLink/ChannelOnlineLink';
import ChannelParams from '@/components/ChannelParams/ChannelParams';
import DangerHtml from '@/components/DangerHtml/DangerHtml';
import EmptyData from '@/components/EmptyData/EmptyData';
import FillingValidImage from '@/components/Images/FillingValidImage';
import NoteBlock from '@/components/NoteBlock/NoteBlock';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import SimilarChannel from '@/components/SimilarChannel/SimilarChannel';
import { Title } from '@/components/Title/Title';
import TvScheduleLink from '@/components/TvScheduleLink/TvScheduleLink';
import {
  getComments,
  getSimilarArticles,
  updateViewCount,
} from '@/controllers/articles.controller';
import {
  getDBChannel,
  getDBChannelSlugList,
  getSimilarChannels,
} from '@/controllers/channel.controller';
import { getFormattedDateStr } from '@/libs/utils';
import { META_CHANNEL } from '@/models/channel.model';
import { LANGUAGE, EDBTableTitles, defaultMetaData } from '@/models/ui.model';
import {
  EUrlBaseParam,
  EUrlSearchParam,
  SITE_BASE_URL,
} from '@/models/url.model';
import { Metadata } from 'next';
import Link from 'next/link';

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

export interface IChannelProps {
  params: { slug: string };
}

export const generateMetadata = async ({
  params: { slug },
}: IChannelProps): Promise<Metadata> => {
  const sqlResult = await getDBChannel(slug);
  if (sqlResult instanceof Error) return defaultMetaData[LANGUAGE];

  const {
    title,
    description,
    chan_slug,
    cat_parent_id,
    cat_parent_title,
    cat_title,
    cat_id,
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

  // if it is encrypted channel or category lybid || UA TV then canonical, else native url
  const addCanonical =
    canonical && (cat_id === 23 || cat_parent_id === 2 || cat_parent_id === 25)
      ? clearedCanonical
      : chan_slug;

  return {
    title: metaTitle,
    description: description || title,
    keywords: keywordsBefore[LANGUAGE] + description,
    alternates: {
      canonical: `${SITE_BASE_URL}/${EUrlBaseParam.CHANNEL_PARAMS}/${addCanonical}`,
    },
    openGraph: {
      ...defaultMetaData.openGraph,
      title: metaTitle,
      description: description || title,
      url: `${SITE_BASE_URL}/${EUrlBaseParam.CHANNEL_PARAMS}/${chan_slug}`,
      publishedTime: getFormattedDateStr(),
    },
  };
};

export async function generateStaticParams(): Promise<
  {
    slug: string;
  }[]
> {
  const channelSlugList = await getDBChannelSlugList();

  if (channelSlugList instanceof Error) return [{ slug: '' }];

  return channelSlugList.map((channel) => ({ slug: channel.cpu }));
}

export const dynamicParams = false;

export default async function Page({ params: { slug } }: IChannelProps) {
  const sqlResult = await getDBChannel(slug);
  if (sqlResult instanceof Error)
    return <EmptyData description={sqlResult.message} />;

  const {
    id,
    title,
    logo,
    text,
    view,
    cat_title,
    cat_parent_title,
    cat_parent_id,
    cat_parent_cpu,
    cat_slug,
    tvforsite_net,
  } = sqlResult[0];

  const catLink =
    cat_parent_id > 0 ? `${cat_parent_cpu}#${cat_slug}` : cat_slug;

  const catTitle =
    cat_parent_id > 0 ? `${cat_parent_title} - ${cat_title}` : cat_title;

  const similarChannelsResult = await getSimilarChannels(logo);
  const similarChannels =
    similarChannelsResult instanceof Error ? [] : similarChannelsResult;

  const similarArticlesResult = await getSimilarArticles(logo);
  const similarArticles =
    similarArticlesResult instanceof Error ? [] : similarArticlesResult;

  updateViewCount(EDBTableTitles.CHANNELS, id, view);

  const commDbResult = await getComments(id, EDBTableTitles.COMMENTS_CHANNEL);
  const comments = commDbResult instanceof Error ? [] : commDbResult;

  return (
    <>
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

          <div className="groove-border"></div>

          <TvScheduleLink
            title={`${scheduleTitle[LANGUAGE]} "${title}"`}
            href={`/${EUrlBaseParam.CHANNELS_TV_PROGRAM}/${slug}?${EUrlSearchParam.DATE}=${getFormattedDateStr()}`}
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
            { name: viewsTitle[LANGUAGE], value: view + 1 },
            { name: commentsTitle[LANGUAGE], value: comments.length },
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
    </>
  );
}
