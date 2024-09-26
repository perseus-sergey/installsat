import { Title } from '@/components/ui/Titles/Title';
import {
  ALL_SAT_CHANNEL_LIST_FILTERS,
  ALL_SAT_CHANNEL_LIST_IMAGES,
  ALL_SAT_CHANNEL_LIST_LINKS,
  META_ALL_SAT_CHANNEL_LIST,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import StartArticleSection from '@/components/article/StartArticleSection/StartArticleSection';
import { Suspense } from 'react';
import { DEFAULT_META_DATA, ELanguage, TSearchParams } from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam, MAIN_URL } from '@/models/url.model';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import {
  getELangKey,
  validSearchParam,
  validSearchParamArray,
} from '@/libs/utils/validSearchParam';
import FlyChannelsTable from '@/components/SatChannelsTable/FlyChannelsTable';
import Fieldset from '@/components/ui/Fieldset/Fieldset';
import Filter from '@/components/ui/Filter/Filter';
import ChannelFormatSliders from '@/components/ui/ChannelFormatSliders/ChannelFormatSliders';
import titleImg from 'public/Images/packages/database.png';
import Image from 'next/image';
import NumberOfItems from '@/components/NumberOfItems/NumberOfItems';
import LanguageSelector from '@/components/CustomSelectors/LanguageSelector';
import SatelliteSelector from '@/components/CustomSelectors/SatelliteSelector';
import { getSatsForForm } from '@/controllers/satDigest.controller';
import { getFlySatChannels } from '@/controllers/channelList.controller';
import { getChannelsLangList } from '@/controllers/languageList.controller';
// import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
// import { getCommentsNumber } from '@/controllers/comments.controller';

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

export const revalidate = 21600; // 3600 * 6 invalidate cache every 6 hours

export const generateMetadata = async ({
  params,
}: IPageProps): Promise<Metadata> => {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  return {
    metadataBase: new URL(BASE_URL),
    title: metaTitle[lang],
    description: metaDescription[lang],
    keywords: metaKeywords[lang],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaTitle[lang],
      description: metaDescription[lang],
      url: `/${lang}/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
      publishedTime: getFormattedDateStrYearFirst(),
    },
    alternates: {
      canonical: `/${lang}/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
      languages: {
        en: `/${ELanguage.EN}/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
        uk: `/${ELanguage.UA}/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
      },
    },
  };
};

export default async function Page({ searchParams, params }: IPageProps) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

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

      <article className="article">
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
            {lang === ELanguage.UA ? 'Всього каналів: ' : 'Total channels: '}
            <Suspense>
              <NumberOfItems requestFn={getFlySatChannelsFn} />
            </Suspense>
          </p>
        </StartArticleSection>

        <Suspense>
          <FlyChannelsTable lang={lang} requestFn={getFlySatChannelsFn} />
        </Suspense>
      </article>
    </>
  );
}

// <CommentBlock
//   lang={lang}
//   numberOfComments={numberOfComments}
//   revalidateUrl={`/${lang}/${EUrlBaseParam.SAT_CHANNEL_LIST}`}
//   dbCommentTableName={EDBTableTitles.COMMENTS_PACKAGES}
//   articleId={CHANNEL_LIST_DB_ID}
//   articleName={metaTitle[lang]}
// />
