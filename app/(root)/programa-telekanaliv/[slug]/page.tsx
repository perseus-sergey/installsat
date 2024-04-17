import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import FillingValidImage from '@/components/Images/FillingValidImage';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import SimilarChannel from '@/components/SimilarChannel/SimilarChannel';
import { Title } from '@/components/ui/Title/Title';
import {
  getComments,
  getSimilarArticles,
} from '@/controllers/articles.controller';
import {
  getDBChannel,
  getDBChannelSlugList,
  getSimilarChannels,
} from '@/controllers/channel.controller';
import { getFormattedDateStr } from '@/libs/utils';
import { META_CHANNEL } from '@/models/channel.model';
import {
  LANGUAGE,
  EDBTableTitles,
  TSearchParams,
  defaultMetaData,
} from '@/models/ui.model';
import { EUrlBaseParam, SITE_BASE_URL } from '@/models/url.model';
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
  similar: { channels: simChannelsBefore, articles: simArticlesBefore },
} = META_CHANNEL;

export interface IPageProps {
  params: { slug: string };
  searchParams: TSearchParams;
}

export const generateMetadata = async ({
  params: { slug },
}: IPageProps): Promise<Metadata> => {
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

export default async function Page({
  params: { slug },
  searchParams: { date },
}: IPageProps) {
  const sqlResult = await getDBChannel(slug);
  if (sqlResult instanceof Error)
    return <EmptyData description={sqlResult.message} />;

  const {
    id,
    title,
    logo,
    view,
    cat_title,
    cat_parent_title,
    cat_parent_id,
    cat_parent_cpu,
    cat_slug,
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

  //   const urlSearchParams = makeUrlSearchParams(searchParams);

  // const setUrlSearchParamsStr = (value: string | number): string => {
  //   urlSearchParams.set(EUrlSearchParam.PAGE, `${value}`);

  //   return `?${urlSearchParams.toString()}`;
  // };

  // const firstPage = setUrlSearchParamsStr('1');

  // const prevPage = setUrlSearchParamsStr(`${page - 1 || 1}`);

  // const nextPage = setUrlSearchParamsStr(`${page + 1}`);

  // const lastPage = setUrlSearchParamsStr(`${totalPages}`);

  // updateViewCount(EDBTableTitles.CHANNELS, id, view);

  const commDbResult = await getComments(id, EDBTableTitles.COMMENTS_CHANNEL);
  const comments = commDbResult instanceof Error ? [] : commDbResult;

  return (
    <>
      <article className="article">
        <Title>
          {`${titleBefore[LANGUAGE]} "${title}"`} on {date}
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

        <div className="article-text"></div>

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
          similarTitle={`${simChannelsBefore.title[LANGUAGE]}"${title}"`}
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
