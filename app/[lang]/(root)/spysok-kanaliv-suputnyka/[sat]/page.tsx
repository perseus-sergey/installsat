import { Suspense } from 'react';

import { Title } from '@/components/ui/Titles/Title';
import { getFlySatChannels } from '@/controllers/channelList.controller';
import type { Metadata } from 'next';
import StartArticleSection from '@/components/article/StartArticleSection/StartArticleSection';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { getELangKey } from '@/libs/utils/getLanguage';
import FlyChannelsTable from '@/components/SatChannelsTable/FlyChannelsTable';
import Fieldset from '@/components/ui/Fieldset/Fieldset';
import Filter from '@/components/ui/Filter/Filter';
import ChannelFormatSliders from '@/components/ui/ChannelFormatSliders/ChannelFormatSliders';
import EmptyPage from '@/components/errors/EmptyPage/EmptyPage';
import { getFlySatParams } from '@/controllers/satDigest.controller';
import { EUrlSearchParam } from '@/models/url/urlSearch.model';
import NumberOfItems from '@/components/NumberOfItems/NumberOfItems';
import { getChannelsLangList } from '@/controllers/languageList.controller';
import LanguageSelector from '@/components/CustomSelectors/LanguageSelector';
import ArticleWrapper from '@/components/article/ArticleWrapper';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import { ELanguage } from '@/models/language.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import { TSearchParams } from '@/models/url/urlSearch.model';
import { makeUrlSearchParams } from '@/libs/utils/urlMaker';
import { getSatellitesSiteMap } from '@/controllers/siteMap.controller';
import {
  ALL_SAT_CHANNEL_LIST_FILTERS,
  ALL_SAT_CHANNEL_LIST_LINKS,
  BREAD_SAT_CHANNEL_LIST,
  getEmptyPageTitle,
  META_SAT_CHANNEL_LIST,
  SAT_CHANNEL_LIST_IMAGES,
  TOTAL_CHANNELS_TITLE,
} from '@/models/channels/channelListMeta.model';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const { SATELLITE, LANG, SAT_CHANNEL_LIST } = EUrlBaseParam;

const { h1Start, metaDescription, metaTitle } = META_SAT_CHANNEL_LIST;

const { h1SatImage } = SAT_CHANNEL_LIST_IMAGES;

const {
  filterByChannelName: { placeholder, labelTitle },
  filterByChannelFormatFly: { formats },
  resetAllFiltersButton,
} = ALL_SAT_CHANNEL_LIST_FILTERS;
const { anchors } = ALL_SAT_CHANNEL_LIST_LINKS;

interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

export const revalidate = 43200; // 3600 * 12 invalidate cache every 12 hours

export const generateMetadata = async ({
  params,
}: IPageProps): Promise<Metadata> => {
  const satUrlSlug = params[SATELLITE];
  const lang = getELangKey(params[LANG]);

  const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

  const resFlySatParams = await getFlySatParams(satUrlSlug);
  if (!resFlySatParams) return DEFAULT_META_DATA[lang];

  const { title, position, slug } = resFlySatParams;

  const satTitle = `${title} - ${position}`;
  const fullMetaTitle = `${metaTitle[lang]} ${satTitle}`;
  const description = `${metaDescription[lang]} ${satTitle}`;
  const slugPath = `${SAT_CHANNEL_LIST}/${slug}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: fullMetaTitle,
    description,
    keywords: description,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: fullMetaTitle,
      description,
      url: `/${lang}/${slugPath}`,
      publishedTime: getFormattedDateStrYearFirst('', lang),
    },
    alternates: {
      canonical: `/${lang}/${slugPath}`,
      languages: {
        en: `/${EN}/${slugPath}`,
        uk: `/${UA}/${slugPath}`,
        ru: `/${RU}/${slugPath}`,
        es: `/${ES}/${slugPath}`,
        ar: `/${AR}/${slugPath}`,
        de: `/${DE}/${slugPath}`,
        fr: `/${FR}/${slugPath}`,
        it: `/${IT}/${slugPath}`,
      },
    },
  };
};

export async function generateStaticParams() {
  const res = await getSatellitesSiteMap();

  return res.map((item) => ({ [EUrlBaseParam.SATELLITE]: item.cpu }));
}

export const dynamicParams = true;

export default async ({ searchParams, params }: IPageProps) => {
  const urlSatSlug = params[SATELLITE];

  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  let searchQueryChannel = '';
  let searchQueryLanguages: string[] | undefined = undefined;

  if (searchParams) {
    const { validSearchParam, validSearchParamArray } = await import(
      '@/libs/utils/validSearchParam'
    );

    searchQueryChannel = validSearchParam(
      EUrlSearchParam.CHANNEL,
      searchParams
    );
    searchQueryLanguages = validSearchParamArray(
      EUrlSearchParam.LANGUAGE_URL,
      searchParams
    );
  }

  const resFlySatParams = await getFlySatParams(urlSatSlug);

  if (!resFlySatParams)
    return (
      <EmptyPage
        title={getEmptyPageTitle(urlSatSlug)[lang]}
        breadCrumbList={[BREAD_SAT_CHANNEL_LIST]}
        lang={lang}
      />
    );

  const { slug, title, logo, position, grade } = resFlySatParams;
  // const { id, slug, title, logo, position, grade } = resFlySatParams;

  const getFlySatChannelsFn = () =>
    getFlySatChannels(
      lang,
      searchQueryChannel,
      slug,
      undefined,
      !searchParams?.[EUrlSearchParam.CHANNEL_NOT_ENCRYPTED],
      !!searchParams?.[EUrlSearchParam.CHANNEL_RADIO],
      !!searchParams?.[EUrlSearchParam.CHANNEL_C_BAND],
      !!searchParams?.[EUrlSearchParam.CHANNEL_FORMAT_T2MI],
      searchQueryLanguages
    );

  const langRequestFn = () => getChannelsLangList({ satSlug: urlSatSlug });

  const lastUpdatedSatsUrlSearchPar = makeUrlSearchParams({
    [EUrlSearchParam.SAT]: grade,
  }).toString();

  return (
    <>
      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[
          {
            href: `${EUrlBaseParam.SAT_CHANNEL_LIST}${lastUpdatedSatsUrlSearchPar ? `?${lastUpdatedSatsUrlSearchPar}` : ''}`,
            title: BREAD_SAT_CHANNEL_LIST.title,
          },
          `${title} - ${position}`,
        ]}
      />
      <ArticleWrapper lang={lang}>
        <Title>
          {h1Start[lang]} «{title} - {position}»
          <FillingValidImage
            className="hidden sm:block"
            image={{
              ...h1SatImage,
              src: `${h1SatImage.path}${logo}`,
            }}
            defaultImage={h1SatImage.defaultImage}
            alt={`${h1SatImage.alt[lang]} ${title}`}
          />
        </Title>

        <Fieldset legendText={anchors.legendTitle[lang]} className="mb-3">
          <nav>
            <ul>
              {formats.map((format) => (
                <li key={format.searchQueryName}>
                  <ChannelFormatSliders
                    title={format.title[lang]}
                    searchQueryName={format.searchQueryName}
                  />
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
                resetButton={{
                  ariaLabel: resetAllFiltersButton.ariaLabel[lang],
                  content: resetAllFiltersButton.imgStr,
                }}
              />
            </Suspense>

            <Suspense>
              <LanguageSelector lang={lang} requestFn={langRequestFn} />
            </Suspense>
          </nav>
        </Fieldset>

        <StartArticleSection>
          <p className="text-center">
            {TOTAL_CHANNELS_TITLE[lang]}
            <Suspense>
              <NumberOfItems requestFn={getFlySatChannelsFn} />
            </Suspense>
          </p>
        </StartArticleSection>

        <Suspense>
          <FlyChannelsTable
            lang={lang}
            isSingleSat
            requestFn={getFlySatChannelsFn}
          />
        </Suspense>
      </ArticleWrapper>
    </>
  );
};

// <CommentBlock
//   lang={lang}
//   numberOfComments={numberOfComments}
//   revalidateUrl={`/${lang}/${SAT_CHANNEL_LIST}/${slug}`}
//   dbCommentTableName={EDBTableTitles.COMMENTS_SATELLITE}
//   articleId={id}
//   articleName={`${metaTitle[lang]} ${title} - ${position}`}
// />
