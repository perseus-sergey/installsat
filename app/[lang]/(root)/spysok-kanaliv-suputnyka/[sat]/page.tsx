import { Title } from '@/components/ui/Titles/Title';
import {
  getFlySatChannels,
  getFlyGroupedChannelsAllSat,
  getChannelsLangList,
} from '@/controllers/channelList.controller';
import { getFlyChannelSatList } from '@/controllers/sidebar.controller';
import {
  META_ALL_SAT_CHANNEL_LIST,
  META_SAT_CHANNEL_LIST,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import StartArticleSection from '@/components/article/StartArticleSection/StartArticleSection';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import { Suspense, cache } from 'react';
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
import { BREAD_CRUMBS } from '@/models/breadCrumbs.model';
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

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const { SATELLITE, LANG, SAT_CHANNEL_LIST } = EUrlBaseParam;

// =================================================================
// execute script to add sat_slug for sat_digest in production
//
// Make mjs fly sat & channels parser
// Add cluster choise
// add valid description to StartArticleSections
// change all reactSelects
// add color description to channel filters
// improve similar channels & similar articles blocks
// add comment block to fly channels with separate db tbl (fly_comments_channel))
// =================================================================
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

const satList = await getFlyChannelSatList();

const getCurrentSatParams = cache((satSlug: string) => {
  const satParams = satList.find((sat) => sat.cpu === satSlug);

  return satParams
    ? {
        title: satParams.title,
        id: `${satParams.id}`,
        satPosition: satParams.position,
        logo: satParams.logo,
        slug: satParams.cpu,
      }
    : { title: '', id: '-1', satPosition: -1, logo: '', slug: '' };
});

export const dynamic = 'force-dynamic';

export const generateMetadata = ({ params }: IPageProps): Metadata => {
  const sat = params[SATELLITE];
  const lang = getELangKey(params[LANG]);

  const { title, satPosition, slug } = getCurrentSatParams(sat);

  const satTitle = `${title} - ${satPosition}`;
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

  const { id, slug, title, logo, satPosition } =
    getCurrentSatParams(urlSatSlug);

  if (!title)
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

  const satChannels = await getFlySatChannels(
    lang,
    searchQueryChannel,
    slug,
    undefined,
    !searchParams?.[EUrlSearchParam.CHANNEL_ENCRYPTED],
    !!searchParams?.[EUrlSearchParam.CHANNEL_RADIO],
    !!searchParams?.[EUrlSearchParam.CHANNEL_C_BAND],
    !!searchParams?.[EUrlSearchParam.CHANNEL_FORMAT_T2MI],
    searchQueryLanguages
  );

  if (!satChannels.length)
    return (
      <EmptyPage
        title={
          lang === ELanguage.UA
            ? `На обраному супутнику (${urlSatSlug}) каналів не знайдено.`
            : `No channels were found on the selected satellite (${urlSatSlug}).`
        }
        lang={lang}
      />
    );

  const channelsLangList = await getChannelsLangList([
    satChannels[0].sat_grade.toString(),
  ]);

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_SATELLITE,
    id
  );

  return (
    <>
      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[
          BREAD_CRUMBS.SAT_CHANNEL_LIST,
          `${title} - ${satPosition}`,
        ]}
      />
      <article className="article">
        <Title>
          {h1Start[lang]} «{title} - {satPosition}»
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
        articleName={`${metaTitle[lang]} ${title} - ${satPosition}`}
      />
    </>
  );
}
