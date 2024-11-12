import { Suspense } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';

import { Title } from '@/components/ui/Titles/Title';
import type { Metadata } from 'next';
import StartArticleSection from '@/components/article/StartArticleSection/StartArticleSection';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import {
  validSearchParam,
  validSearchParamArray,
} from '@/libs/utils/validSearchParam';
import FlyChannelsTable from '@/components/SatChannelsTable/FlyChannelsTable';
import Fieldset from '@/components/ui/Fieldset/Fieldset';
import Filter from '@/components/ui/Filter/Filter';
import ChannelFormatSliders from '@/components/ui/ChannelFormatSliders/ChannelFormatSliders';
import titleImg from 'public/Images/packages/database.png';
import NumberOfItems from '@/components/NumberOfItems/NumberOfItems';
import { getSatsForForm } from '@/controllers/satDigest.controller';
import { getFlySatChannels } from '@/controllers/channelList.controller';
import { getChannelsLangList } from '@/controllers/languageList.controller';
import ArticleWrapper from '@/components/article/ArticleWrapper';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import { ELanguage } from '@/models/language.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import { getELangKey } from '@/libs/utils/getLanguage';
import {
  ALL_SAT_CHANNEL_LIST_FILTERS,
  ALL_SAT_CHANNEL_LIST_IMAGES,
  ALL_SAT_CHANNEL_LIST_LINKS,
  META_ALL_SAT_CHANNEL_LIST,
  START_SECTION_TEXT,
} from '@/models/channels/channelListMeta.model';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { CHANNEL_LIST_DB_ID } from '@/models/channels/channelList.model';

const LanguageSelector = dynamic(
  () => import('@/components/CustomSelectors/LanguageSelector'),
  { ssr: false }
);

const SatelliteSelector = dynamic(
  () => import('@/components/CustomSelectors/SatelliteSelector'),
  { ssr: false }
);

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const { metaH1, metaDescription, metaKeywords, metaTitle } =
  META_ALL_SAT_CHANNEL_LIST;

const {
  filterByChannelName: { placeholder, labelTitle },
  filterByChannelFormatFly: { formats },
  resetAllFiltersButton,
} = ALL_SAT_CHANNEL_LIST_FILTERS;
const { anchors } = ALL_SAT_CHANNEL_LIST_LINKS;
const { h1FlyImageAlt } = ALL_SAT_CHANNEL_LIST_IMAGES;

interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

const { LANG, SAT_CHANNEL_LIST } = EUrlBaseParam;

export const revalidate = 21600; // 3600 * 6 invalidate cache every 6 hours

export const generateMetadata = async ({
  params,
}: IPageProps): Promise<Metadata> => {
  const lang = getELangKey(params[LANG]);

  const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

  return {
    metadataBase: new URL(BASE_URL),
    title: metaTitle[lang],
    description: metaDescription[lang],
    keywords: metaKeywords[lang],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaTitle[lang],
      description: metaDescription[lang],
      url: `/${lang}/${SAT_CHANNEL_LIST}`,
      publishedTime: getFormattedDateStrYearFirst('', lang),
    },
    alternates: {
      canonical: `/${lang}/${SAT_CHANNEL_LIST}`,
      languages: {
        en: `/${EN}/${SAT_CHANNEL_LIST}`,
        uk: `/${UA}/${SAT_CHANNEL_LIST}`,
        ru: `/${RU}/${SAT_CHANNEL_LIST}`,
        es: `/${ES}/${SAT_CHANNEL_LIST}`,
        ar: `/${AR}/${SAT_CHANNEL_LIST}`,
        de: `/${DE}/${SAT_CHANNEL_LIST}`,
        fr: `/${FR}/${SAT_CHANNEL_LIST}`,
        it: `/${IT}/${SAT_CHANNEL_LIST}`,
      },
    },
  };
};

export default async function Page({ searchParams, params }: IPageProps) {
  const lang = getELangKey(params[LANG]);

  const searchQueryChannel = validSearchParam(
    EUrlSearchParam.CHANNEL,
    searchParams
  );
  const searchQueryLanguages = validSearchParamArray(
    EUrlSearchParam.LANGUAGE_URL,
    searchParams
  );
  const searchQuerySatellites = validSearchParamArray(
    EUrlSearchParam.SAT,
    searchParams
  );

  const getFlySatChannelsFn = () =>
    getFlySatChannels(
      lang,
      searchQueryChannel,
      '',
      searchQuerySatellites,
      !searchParams?.[EUrlSearchParam.CHANNEL_NOT_ENCRYPTED],
      !!searchParams?.[EUrlSearchParam.CHANNEL_RADIO],
      !!searchParams?.[EUrlSearchParam.CHANNEL_C_BAND],
      !!searchParams?.[EUrlSearchParam.CHANNEL_FORMAT_T2MI],
      searchQueryLanguages
    );

  const langRequestFn = () =>
    getChannelsLangList({
      satGrades: searchQuerySatellites,
    });

  const satsForFormFn = () => getSatsForForm(false, lang, true);

  return (
    <>
      <BreadCrumbServer lang={lang} />

      <ArticleWrapper lang={lang}>
        <Title>
          {metaH1[lang]}
          <Image
            src={titleImg}
            alt={h1FlyImageAlt[lang]}
            className="shrink-0 hidden sm:block"
            priority
          />
        </Title>

        <Fieldset legendText={anchors.legendTitle[lang]}>
          <nav>
            <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 p-2 text-gray-400">
              <Suspense>
                <SatelliteSelector lang={lang} requestFn={satsForFormFn} />
              </Suspense>

              <Suspense>
                <LanguageSelector lang={lang} requestFn={langRequestFn} />
              </Suspense>
            </div>

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
          </nav>
        </Fieldset>

        <StartArticleSection>
          <p className="text-center">
            {START_SECTION_TEXT[lang]}
            <Suspense>
              <NumberOfItems requestFn={getFlySatChannelsFn} />
            </Suspense>
          </p>
        </StartArticleSection>

        <Suspense>
          <FlyChannelsTable lang={lang} requestFn={getFlySatChannelsFn} />
        </Suspense>
      </ArticleWrapper>

      <Suspense>
        <CommentBlock
          lang={lang}
          revalidateUrl={`/${lang}/${SAT_CHANNEL_LIST}`}
          dbCommentTableName={EDBTableTitles.COMMENTS_PACKAGES}
          articleId={CHANNEL_LIST_DB_ID}
          articleName={metaTitle[lang]}
        />
      </Suspense>
    </>
  );
}
