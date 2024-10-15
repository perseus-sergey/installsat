import { Title } from '@/components/ui/Titles/Title';
import { getFlySatChannels } from '@/controllers/channelList.controller';
import {
  ALL_SAT_CHANNEL_LIST_FILTERS,
  ALL_SAT_CHANNEL_LIST_LINKS,
  META_SAT_CHANNEL_LIST,
  SAT_CHANNEL_LIST_IMAGES,
} from '@/models/channels/channelList.model';
import type { Metadata } from 'next';
import StartArticleSection from '@/components/article/StartArticleSection/StartArticleSection';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import { Suspense } from 'react';
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

const BREAD_SAT_CHANNEL_LIST = {
  href: EUrlBaseParam.SAT_CHANNEL_LIST,
  title: {
    [ELanguage.UA]: 'Список каналів супутників',
    [ELanguage.EN]: 'List of satellite channels',
  },
};

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

export default async function Page({ searchParams, params }: IPageProps) {
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
        title={
          lang === ELanguage.UA
            ? `Супутник «${urlSatSlug}» не знайдено. Спробуйте вибрати інший із списку супутників.`
            : `Satellite «${urlSatSlug}» not found. Try selecting another one from the satellite list.`
        }
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
            title: {
              [ELanguage.UA]: 'Список каналів супутників',
              [ELanguage.EN]: 'List of satellite channels',
            },
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
            {lang === ELanguage.UA ? 'Всього каналів: ' : 'Total channels: '}
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
}

// <CommentBlock
//   lang={lang}
//   numberOfComments={numberOfComments}
//   revalidateUrl={`/${lang}/${SAT_CHANNEL_LIST}/${slug}`}
//   dbCommentTableName={EDBTableTitles.COMMENTS_SATELLITE}
//   articleId={id}
//   articleName={`${metaTitle[lang]} ${title} - ${position}`}
// />
