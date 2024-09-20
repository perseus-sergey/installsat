import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Titles/Title';
import {
  getPackageChannels,
  getT2Channels,
} from '@/controllers/channelList.controller';
import {
  ALL_SAT_CHANNEL_LIST_FILTERS,
  CHANNEL_LIST_ANCHOR_START,
  META_PACKAGE_CHANNEL_LIST,
  PACKAGE_CHANNEL_LIST_DATA,
  PACKAGE_CHANNEL_LIST_IMAGES,
  T2_SLUG,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import Fieldset from '@/components/ui/Fieldset/Fieldset';
import {
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
import SeoLink from '@/components/ui/SeoLink/SeoLink';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const { getH1, metaKeywords, metaTitle } = META_PACKAGE_CHANNEL_LIST;

const {
  similarLinks: { title: similarLinksTitle, beforeLinkText },
  fieldsetFilters: {
    legendText,
    anchorLink: { ariaLabel },
  },
} = PACKAGE_CHANNEL_LIST_DATA;
const { h1Image } = PACKAGE_CHANNEL_LIST_IMAGES;

const { SLUG, LANG, PACKAGE_CHANNEL_LIST, CHANNEL_PARAMS } = EUrlBaseParam;

const {
  filterByChannelName: { placeholder, labelTitle },
} = ALL_SAT_CHANNEL_LIST_FILTERS;

const getH1Cached = cache(getH1);

interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

// export const dynamic = 'force-dynamic';
export const revalidate = 3600 * 48; // invalidate cache every 48 hours

export const generateMetadata = async ({
  params,
}: IPageProps): Promise<Metadata> => {
  const slug = params[SLUG];
  const lang = getELangKey(params[LANG]);

  const res =
    slug === T2_SLUG
      ? await getT2Channels(lang)
      : await getPackageChannels(slug);

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
      canonical: `/${lang}/${slugPath}`,
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
      ? await getT2Channels(lang, searchQueryChannel)
      : await getPackageChannels(slug, searchQueryChannel);

  const numberOfComments = channels
    ? await getCommentsNumber(
        EDBTableTitles.COMMENTS_PACKAGES,
        `${channels[0][1][0].cat_id}`
      )
    : 0;

  const packagesResp = await getChannelCatList(lang);
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
                alt={`${h1Image.alt[lang]} "${channels[0][1][0].cat_title}"`}
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
                          tooltipText={chanList[0].genre_description}
                          genreMapPosition={chanList[0].genre_id}
                        />
                      )}
                      <TooltipSimple
                        tooltipText={`${ariaLabel[lang]} "${subCatTitle}"`}
                      >
                        <SeoLink
                          title={`${ariaLabel[lang]} "${subCatTitle}"`}
                          href={`#${CHANNEL_LIST_ANCHOR_START}${chanList[0].genre_id}`}
                          className="text-indigo-800 text-lg hover:text-red-500"
                        >
                          {subCatTitle}
                        </SeoLink>
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
          <EmptyData lang={lang} />
        )}
      </article>

      {similarLinks.length ? (
        <SimilarArticles
          similarTitle={similarLinksTitle[lang]}
          similarArticlesMapped={similarLinks.map((link) => (
            <li key={link.cpu}>
              <SeoLink
                href={`/${lang}/${PACKAGE_CHANNEL_LIST}/${link.cpu}`}
                title={
                  lang === ELanguage.UA
                    ? `Перейти до списку каналів пакету "${link.title}"`
                    : `Go to the package channels list "${link.title}"`
                }
              >
                {beforeLinkText[lang]} {link.title}
              </SeoLink>
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
        <EmptyData lang={lang} />
      )}
    </>
  );
}
