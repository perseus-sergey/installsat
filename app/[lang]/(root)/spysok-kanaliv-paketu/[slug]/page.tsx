import { Title } from '@/components/ui/Titles/Title';
import {
  getPackageChannels,
  getPackageParams,
  getT2Channels,
} from '@/controllers/channelList.controller';
import {
  META_PACKAGE_CHANNEL_LIST,
  PACKAGE_CHANNEL_LIST_DATA,
  PACKAGE_CHANNEL_LIST_IMAGES,
  T2_SLUG,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import {
  TSearchParams,
  DEFAULT_META_DATA,
  EDBTableTitles,
  ELanguage,
} from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam, MAIN_URL } from '@/models/url.model';
import { Suspense, cache } from 'react';
import { getELangKey, validSearchParam } from '@/libs/utils/validSearchParam';
// import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
// import { getCommentsNumber } from '@/controllers/comments.controller';
import PackageChannelList from '@/components/channelList/PackageChannelList';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import { getChannelCatList } from '@/controllers/sidebar.controller';
import { updateViewCount } from '@/controllers/articles.controller';
import BreadCrumbServer, {
  IBreadCrumbLink,
} from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import SeoLink from '@/components/ui/SeoLink/SeoLink';
import SimilarBlock from '@/components/SimilarArticles/SimilarBlock';
import { BREAD_PACKAGE_CHANNEL_LIST } from '@/models/breadCrumbs.model';
import EmptyPage from '@/components/errors/EmptyPage/EmptyPage';
import ArticleWrapper from '@/components/article/ArticleWrapper';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const { getH1, metaKeywords, metaTitle } = META_PACKAGE_CHANNEL_LIST;

const {
  similarLinks: { title: similarLinksTitle, beforeLinkText },
} = PACKAGE_CHANNEL_LIST_DATA;
const { h1Image } = PACKAGE_CHANNEL_LIST_IMAGES;

const { SLUG, LANG, PACKAGE_CHANNEL_LIST, CHANNEL_PARAMS } = EUrlBaseParam;

const getH1Cached = cache(getH1);

interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

export const revalidate = 172800; // 3600 * 48 invalidate cache every 2 days

export const generateMetadata = async ({
  params,
}: IPageProps): Promise<Metadata> => {
  const slug = params[SLUG];
  const lang = getELangKey(params[LANG]);

  const res =
    slug === T2_SLUG
      ? await getT2Channels(lang)
      : await getPackageChannels({ packageSlug: slug, lang: lang });

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

  const getChannelsFn =
    slug === T2_SLUG
      ? () => getT2Channels(lang, searchQueryChannel)
      : () =>
          getPackageChannels({
            packageSlug: slug,
            searchQuery: searchQueryChannel,
            lang: lang,
          });

  // const numberOfComments = channels
  //   ? await getCommentsNumber(
  //       EDBTableTitles.COMMENTS_PACKAGES,
  //       `${channels[0][1][0].cat_id}`
  //     )
  //   : 0;

  const packageParamsResp = await getPackageParams(
    slug === T2_SLUG ? undefined : slug
  );

  if (!packageParamsResp) return EmptyPage;

  const packagesResp = await getChannelCatList(lang);
  const similarLinks =
    packagesResp instanceof Error
      ? []
      : packagesResp.filter((pack) => pack.cpu !== slug);

  !searchQueryChannel &&
    updateViewCount(
      EDBTableTitles.CHANNEL_CATEGORY,
      `${packageParamsResp.cat_id}`,
      packageParamsResp.cat_view
    );

  const breadCrumbList: (IBreadCrumbLink | string)[] = [
    BREAD_PACKAGE_CHANNEL_LIST,
  ];
  breadCrumbList.push(
    getH1Cached(packageParamsResp.cat_title, searchQueryChannel)[lang]
  );

  return (
    <>
      <BreadCrumbServer breadCrumbList={breadCrumbList} lang={lang} />

      <ArticleWrapper lang={lang}>
        <>
          <Title>
            {getH1Cached(packageParamsResp.cat_title, searchQueryChannel)[lang]}
            <FillingValidImage
              image={{
                width: h1Image.width,
                height: h1Image.height,
                src: `${h1Image.path}${packageParamsResp.cat_logo}`,
              }}
              defaultImage={h1Image.defaultImage}
              alt={`${h1Image.alt[lang]} "${packageParamsResp.cat_title}"`}
            />
          </Title>

          <Suspense>
            <PackageChannelList
              lang={lang}
              isGenre={slug === 't2-efir'}
              getChannelsFn={getChannelsFn}
              pathToChannelDetails={CHANNEL_PARAMS}
            />
          </Suspense>
        </>
      </ArticleWrapper>

      {similarLinks.length ? (
        <SimilarBlock blockTitle={similarLinksTitle[lang]}>
          {similarLinks.map((link) => (
            <li key={link.cpu}>
              <SeoLink
                className="text-indigo-700 hover:text-red-500"
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
        </SimilarBlock>
      ) : null}
    </>
  );
}

// {channels ? (
//   <CommentBlock
//     lang={lang}
//     numberOfComments={numberOfComments}
//     revalidateUrl={`/${lang}/${PACKAGE_CHANNEL_LIST}/${channels[0][1][0].cat_slug}`}
//     dbCommentTableName={EDBTableTitles.COMMENTS_PACKAGES}
//     articleId={`${channels[0][1][0].cat_id}`}
//     articleName={`${channels[0][1][0].cat_title}. ${metaTitle[lang]}`}
//   />
// ) : (
//   <EmptyData lang={lang} />
// )}
