import { Title } from '@/components/ui/Titles/Title';
import {
  getFlySatChannels,
  getFlyGroupedChannelsAllSat,
} from '@/controllers/channelList.controller';
import {
  META_ALL_SAT_CHANNEL_LIST,
  META_SAT_CHANNEL_LIST,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import StartArticleSection from '@/components/article/StartArticleSection/StartArticleSection';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import { Suspense } from 'react';
import {
  DEFAULT_LANG,
  DEFAULT_META_DATA,
  EDBTableTitles,
  ELanguage,
  ESelectType,
  TSearchParams,
} from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam, MAIN_URL } from '@/models/url.model';
import { getCommentsNumber } from '@/controllers/comments.controller';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
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
import { Selector } from '@/components/SatelliteSelector/Selector';
import EmptyPage from '@/components/errors/EmptyPage/EmptyPage';
import { getFlySatParams } from '@/controllers/satDigest.controller';
import { makeUrlSearchParams } from '@/libs/utils/utils';
import { getChannelsLangList } from '@/controllers/languageList.controller';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const { SATELLITE, LANG, SAT_CHANNEL_LIST } = EUrlBaseParam;

const {
  h1Start,
  metaDescription,
  metaTitle,
  images: { h1SatImage },
} = META_SAT_CHANNEL_LIST;

const {
  anchors,
  filtering: {
    filterByChannelName: { placeholder, labelTitle },
    filterByChannelFormatFly: { formats },
    resetAllFiltersButton,
  },
} = META_ALL_SAT_CHANNEL_LIST;

interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

// export const dynamic = 'force-dynamic';
export const revalidate = 3600 * 12; // invalidate cache every 12 hours

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
      canonical: `/${DEFAULT_LANG}/${slugPath}`,
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

  const searchQueryChannel = validSearchParam(
    EUrlSearchParam.CHANNEL,
    searchParams
  );

  const searchQueryLanguages = validSearchParamArray(
    EUrlSearchParam.LANGUAGE_URL,
    searchParams
  );

  const resFlySatParams = await getFlySatParams(urlSatSlug);

  if (!resFlySatParams)
    return (
      <EmptyPage
        title={
          lang === ELanguage.UA
            ? `Супутник (${urlSatSlug}) не знайдено. Спробуйте вибрати інший із списку супутників.`
            : `Satellite (${urlSatSlug}) not found. Try selecting another one from the satellite list.`
        }
        lang={lang}
      />
    );

  const { id, slug, title, logo, position, grade } = resFlySatParams;

  const satChannels = await getFlySatChannels(
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

  const channelsLangList = satChannels.length
    ? await getChannelsLangList({ satSlug: urlSatSlug })
    : [];

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_SATELLITE,
    id
  );

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
      <article className="article">
        <Title>
          {h1Start[lang]} «{title} - {position}»
          <FillingValidImage
            image={{
              ...h1SatImage,
              src: `${h1SatImage.path}${logo}`,
            }}
            defaultImage={h1SatImage.defaultImage}
            alternativeImgString={h1SatImage.alternativeString}
            alt={`${h1SatImage.alt[lang]} ${title}`}
            isBlur
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

              {channelsLangList.length > 0 && (
                <Selector
                  className="z-10"
                  selectName={ESelectType.SELECT_LANG}
                  searchParamName={EUrlSearchParam.LANGUAGE_URL}
                  itemList={channelsLangList}
                  caption={
                    lang === ELanguage.UA
                      ? 'Виберіть мову'
                      : 'Choose a language'
                  }
                />
              )}
            </Suspense>
          </nav>
        </Fieldset>

        <StartArticleSection>
          <p className="text-center">
            {lang === ELanguage.UA ? 'Всього каналів: ' : 'Total channels: '}
            {satChannels.length}
          </p>
        </StartArticleSection>
        <FlyChannelsTable
          lang={lang}
          isSingleSat
          satChannels={getFlyGroupedChannelsAllSat([satChannels])}
        />
      </article>

      <CommentBlock
        lang={lang}
        numberOfComments={numberOfComments}
        revalidateUrl={`/${lang}/${SAT_CHANNEL_LIST}/${slug}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_SATELLITE}
        articleId={id}
        articleName={`${metaTitle[lang]} ${title} - ${position}`}
      />
    </>
  );
}
