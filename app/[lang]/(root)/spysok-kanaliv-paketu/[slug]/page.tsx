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
  DEFAULT_LANG,
  TSearchParams,
  DEFAULT_META_DATA,
  EDBTableTitles,
  ELanguage,
} from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam, MAIN_URL } from '@/models/url.model';
import Filter from '@/components/ui/Filter/Filter';
import { Suspense, cache } from 'react';
import { getELangKey, validSearchParam } from '@/libs/utils/validSearchParam';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import { getCommentsNumber } from '@/controllers/comments.controller';
import TooltipSimple from '@/components/ui/tooltips/TooltipSimple/TooltipSimple';
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
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

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

const { SLUG, LANG, PACKAGE_CHANNEL_LIST, CHANNEL_PARAMS } = EUrlBaseParam;

const {
  filtering: {
    filterByChannelName: { placeholder, labelTitle },
  },
} = META_ALL_SAT_CHANNEL_LIST;

const getH1Cached = cache(getH1);

interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({
  params,
}: IPageProps): Promise<Metadata> => {
  const slug = params[SLUG];
  const lang = getELangKey(params[LANG]);

  const res =
    slug === T2_SLUG ? await getT2Channels() : await getPackageChannels(slug);

  if (!res || !res.length) return DEFAULT_META_DATA[lang];

  const { cat_title, cat_description, cat_slug } = res[0][1][0];

  const slugPath = `${PACKAGE_CHANNEL_LIST}/${cat_slug}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: `${cat_title}. ${metaTitle[lang]}`,
    description: cat_description,
    keywords: `${cat_title} ${metaKeywords[lang]}`,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: `${cat_title}. ${metaTitle[lang]}`,
      description: cat_description,
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
    [SLUG]: string;
  }[]
> {
  const allCatResponse = await getChannelCatList();

  if (allCatResponse instanceof Error) return [{ [SLUG]: '' }];

  return allCatResponse.map((cat) => ({ [SLUG]: cat.cpu }));
}

export const dynamicParams = false;

export default async function Page({ params, searchParams }: IPageProps) {
  const slug = params[SLUG];
  const lang = getELangKey(params[LANG]);

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
      getH1Cached(channels[0][1][0].cat_title, searchQueryChannel)[lang]
    );

  return (
    <>
      <BreadCrumbServer breadCrumbList={breadCrumbList} lang={lang} />

      <article className="article">
        {channels ? (
          <>
            <Title>
              {
                getH1Cached(channels[0][1][0].cat_title, searchQueryChannel)[
                  lang
                ]
              }
              <FillingValidImage
                image={{
                  width: h1Image.width,
                  height: h1Image.height,
                  src: `${h1Image.path}${channels[0][1][0].cat_logo}`,
                }}
                defaultImage={h1Image.defaultImage}
                alternativeImgString={h1Image.alternativeImgStr}
                alt={h1Image.alt[lang]}
                isBlur
              />
            </Title>

            <Fieldset legendText={legendText[lang]}>
              <nav className="p-2 md:p-4">
                <ul>
                  {channels.map(([subCatTitle, chanList]) => (
                    <li key={subCatTitle} className="flex items-center gap-4">
                      {slug === 't2-efir' && (
                        <GenreImage
                          lang={lang}
                          tooltipText={subCatTitle}
                          genreMapPosition={chanList[0].genre_id}
                        />
                      )}
                      <TooltipSimple
                        tooltipText={`${ariaLabel[lang]} ${subCatTitle}`}
                      >
                        <Link
                          title={subCatTitle}
                          href={`#${CHANNEL_LIST_ANCHOR_START}${chanList[0].genre_id}`}
                          className="text-indigo-800 text-lg hover:text-red-500"
                          aria-label={`${ariaLabel[lang]} ${subCatTitle}`}
                        >
                          {subCatTitle}
                        </Link>
                      </TooltipSimple>
                    </li>
                  ))}
                </ul>
                <Suspense>
                  <Filter
                    lang={lang}
                    idName="channel-search-input"
                    placeholder={placeholder[lang]}
                    labelTitle={labelTitle[lang]}
                    searchQueryTitle={EUrlSearchParam.CHANNEL}
                  />
                </Suspense>
              </nav>
            </Fieldset>

            <Suspense key={searchQueryChannel}>
              <PackageChannelList
                lang={lang}
                channels={channels}
                pathToChannelDetails={CHANNEL_PARAMS}
              />
            </Suspense>
          </>
        ) : (
          <EmptyData />
        )}
      </article>

      {similarLinks.length ? (
        <SimilarArticles
          similarTitle={similarLinksTitle[lang]}
          similarArticlesMapped={similarLinks.map((link) => (
            <li key={link.cpu}>
              <Link href={`/${lang}/${PACKAGE_CHANNEL_LIST}/${link.cpu}`}>
                {beforeLinkText[lang]} {link.title}
              </Link>
            </li>
          ))}
        />
      ) : null}

      {channels ? (
        <CommentBlock
          lang={lang}
          numberOfComments={numberOfComments}
          revalidateUrl={`/${lang}/${PACKAGE_CHANNEL_LIST}/${channels[0][1][0].cat_slug}`}
          dbCommentTableName={EDBTableTitles.COMMENTS_PACKAGES}
          articleId={`${channels[0][1][0].cat_id}`}
          articleName={`${channels[0][1][0].cat_title}. ${metaTitle[lang]}`}
        />
      ) : (
        <EmptyData />
      )}
    </>
  );
}
