import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Titles/Title';
import {
  getPackageChannels,
  getT2Channels,
} from '@/controllers/channelList.controller';
import {
  CHANNEL_LIST_ANCHOR_START,
  META_ALL_SAT_CHANNEL_LIST,
  META_PACKAGE_CHANNEL_LIST,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import Fieldset from '@/components/ui/Fieldset/Fieldset';
import {
  LANGUAGE as L,
  LANGUAGE,
  TSearchParams,
  DEFAULT_META_DATA,
  EDBTableTitles,
} from '@/models/ui.model';
import { getFormattedDateStr } from '@/libs/utils/utils';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import Filter from '@/components/ui/Filter/Filter';
import { Suspense, cache } from 'react';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import { getCommentsNumber } from '@/controllers/comments.controller';
import TooltipSimple from '@/components/ui/TooltipSimple/TooltipSimple';
import Link from 'next/link';
import PackageChannelList from '@/components/channelList/PackageChannelList';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import GenreImage from '@/components/ui/Images/GenreImage/GenreImage';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import { getChannelCatList } from '@/controllers/sidebar.controller';
import { updateViewCount } from '@/controllers/articles.controller';
import BreadCrumbServer, {
  IBreadCrumbLink,
} from '@/components/BreadCrumbs/BreadCrumbsServer';
import { BREAD_CRUMBS } from '@/models/breadCrumbs.model';

const BASE_URL = process.env.BASE_URL;

const {
  getH1,
  metaKeywords,
  metaTitle,
  T2_SLUG,
  images: { h1Image },
  fieldsetFilters: {
    legendText,
    anchorLink: { ariaLabel },
  },
  similarLinks: { title: similarLinksTitle, beforeLinkText },
} = META_PACKAGE_CHANNEL_LIST;

const {
  filtering: {
    filterByChannelName: { placeholder, labelTitle },
  },
} = META_ALL_SAT_CHANNEL_LIST;

const getH1Cached = cache(getH1);

interface IPageProps {
  params: { slug: string };
  searchParams?: TSearchParams;
}

export const generateMetadata = async ({
  params: { slug },
}: IPageProps): Promise<Metadata> => {
  const res =
    slug === T2_SLUG ? await getT2Channels() : await getPackageChannels(slug);

  if (!res || !res.length) return DEFAULT_META_DATA[LANGUAGE];

  const { cat_title, cat_description, cat_slug } = res[0][1][0];

  return {
    title: `${cat_title}. ${metaTitle[L]}`,
    description: cat_description,
    keywords: `${cat_title} ${metaKeywords[L]}`,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: `${cat_title}. ${metaTitle[L]}`,
      description: cat_description,
      url: `${BASE_URL}/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${cat_slug}`,
      publishedTime: getFormattedDateStr(new Date()),
    },
  };
};

export async function generateStaticParams(): Promise<
  {
    slug: string;
  }[]
> {
  const allCatResponse = await getChannelCatList();

  if (allCatResponse instanceof Error) return [{ slug: '' }];

  return allCatResponse.map((cat) => ({ slug: cat.cpu }));
}

export const dynamicParams = false;

export default async function Page({
  params: { slug },
  searchParams,
}: IPageProps) {
  const searchQueryChannel = validSearchParam(
    EUrlSearchParam.CHANNEL,
    searchParams
  );

  const channels =
    slug === T2_SLUG
      ? await getT2Channels(searchQueryChannel)
      : await getPackageChannels(slug, searchQueryChannel);

  const numberOfComments = channels
    ? await getCommentsNumber(
        EDBTableTitles.COMMENTS_PACKAGES,
        `${channels[0][1][0].cat_id}`
      )
    : 0;

  const packagesResp = await getChannelCatList();
  const similarLinks =
    packagesResp instanceof Error
      ? []
      : packagesResp.filter((pack) => pack.cpu !== slug);

  channels &&
    updateViewCount(
      EDBTableTitles.CHANNEL_CATEGORY,
      `${channels[0][1][0].cat_id}`,
      channels[0][1][0].cat_view
    );

  const breadCrumbList: (IBreadCrumbLink | string)[] = [
    BREAD_CRUMBS.PACKAGE_CHANNEL_LIST,
  ];
  channels &&
    breadCrumbList.push(
      getH1Cached(channels[0][1][0].cat_title, searchQueryChannel)[L]
    );

  return (
    <>
      <BreadCrumbServer breadCrumbList={breadCrumbList} />
      <article className="article">
        {channels ? (
          <>
            <Title>
              {getH1Cached(channels[0][1][0].cat_title, searchQueryChannel)[L]}
              <FillingValidImage
                image={{
                  width: h1Image.width,
                  height: h1Image.height,
                  src: `${h1Image.path}${channels[0][1][0].cat_logo}`,
                }}
                defaultImage={h1Image.defaultImage}
                alternativeImgString={h1Image.alternativeImgStr}
                alt={h1Image.alt[L]}
                isBlur
              />
            </Title>

            <Fieldset legendText={legendText[L]}>
              <nav className="p-2 md:p-4">
                <ul>
                  {channels.map(([subCatTitle, chanList]) => (
                    <li key={subCatTitle} className="flex items-center gap-4">
                      {slug === 't2-efir' && (
                        <GenreImage
                          tooltipText={subCatTitle}
                          genreMapPosition={chanList[0].genre_id}
                        />
                      )}
                      <TooltipSimple
                        tooltipText={`${ariaLabel[L]} ${subCatTitle}`}
                      >
                        <Link
                          title={subCatTitle}
                          href={`#${CHANNEL_LIST_ANCHOR_START}${chanList[0].genre_id}`}
                          className="text-indigo-800 text-lg hover:text-red-500"
                          aria-label={`${ariaLabel[L]} ${subCatTitle}`}
                        >
                          {subCatTitle}
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
                channels={channels}
                pathToChannelDetails={EUrlBaseParam.CHANNEL_PARAMS}
              />
            </Suspense>

            {/* <OnlineChannelListAfterText lang={LANGUAGE} /> */}
          </>
        ) : (
          <EmptyData />
        )}
      </article>

      {similarLinks.length ? (
        <SimilarArticles
          similarTitle={similarLinksTitle[LANGUAGE]}
          similarArticlesMapped={similarLinks.map((link) => (
            <li key={link.cpu}>
              <Link href={`/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${link.cpu}`}>
                {beforeLinkText[L]} {link.title}
              </Link>
            </li>
          ))}
        />
      ) : null}

      {channels ? (
        <CommentBlock
          numberOfComments={numberOfComments}
          revalidateUrl={`/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${channels[0][1][0].cat_slug}`}
          dbCommentTableName={EDBTableTitles.COMMENTS_PACKAGES}
          articleId={`${channels[0][1][0].cat_id}`}
          articleName={`${channels[0][1][0].cat_title}. ${metaTitle[L]}`}
        />
      ) : (
        <EmptyData />
      )}
    </>
  );
}
