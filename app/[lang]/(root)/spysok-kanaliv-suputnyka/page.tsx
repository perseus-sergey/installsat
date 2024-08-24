import { Title } from '@/components/ui/Titles/Title';
import {
  getFlySatChannels,
  getFlyGroupedChannelsAllSat,
  getChannelsLangList,
} from '@/controllers/channelList.controller';
import { META_ALL_SAT_CHANNEL_LIST } from '@/models/channelList.model';
import type { Metadata } from 'next';
import StartArticleSection from '@/components/article/StartArticleSection/StartArticleSection';
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
import { getSatsForForm } from '@/controllers/satDigest.controller';
import FillingImg from '@/components/ui/Images/FillingImage';
import { Selector } from '@/components/SatelliteSelector/Selector';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const {
  metaH1,
  metaDescription,
  metaKeywords,
  metaTitle,
  image: { h1FlyImageParams },
  anchors,
  filtering: {
    filterByChannelName: { placeholder, labelTitle },
    filterByChannelFormatFly: { formats },
    resetAllFiltersButton,
  },
  CHANNEL_LIST_DB_ID,
} = META_ALL_SAT_CHANNEL_LIST;

interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

export const dynamic = 'force-dynamic';

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
      canonical: `/${DEFAULT_LANG}/${EUrlBaseParam.SAT_CHANNEL_LIST}`,
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

  const groupedSats = await getSatsForForm(false, lang, true);

  const satChannels = await getFlySatChannels(
    lang,
    searchQueryChannel,
    '',
    searchQuerySatellites,
    !searchParams?.[EUrlSearchParam.CHANNEL_ENCRYPTED],
    !!searchParams?.[EUrlSearchParam.CHANNEL_RADIO],
    !!searchParams?.[EUrlSearchParam.CHANNEL_C_BAND],
    !!searchParams?.[EUrlSearchParam.CHANNEL_FORMAT_T2MI],
    searchQueryLanguages
  );

  const channelsLangList = await getChannelsLangList(searchQuerySatellites);

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_PACKAGES,
    CHANNEL_LIST_DB_ID
  );

  return (
    <>
      <BreadCrumbServer lang={lang} />
      <article className="article">
        <Title>
          {metaH1[lang]}
          <FillingImg
            src={h1FlyImageParams.path}
            alt={h1FlyImageParams.alt[lang]}
            width={h1FlyImageParams.width}
            height={h1FlyImageParams.height}
          />
        </Title>

        <Suspense>
          <Fieldset legendText={anchors.legendTitle[lang]}>
            <nav>
              <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 p-2 text-gray-400">
                <Selector
                  selectName={ESelectType.SELECT_SATS}
                  className="z-20 min-w-72"
                  closeMenuOnSelect={false}
                  searchParamName={EUrlSearchParam.SAT}
                  itemList={groupedSats instanceof Error ? [] : groupedSats}
                  caption={
                    lang === ELanguage.UA
                      ? 'Виберіть супутники'
                      : 'Select satellites'
                  }
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
        </Suspense>

        <StartArticleSection>
          <p className="text-center">
            {lang === ELanguage.UA ? 'Всього каналів: ' : 'Total channels: '}
            {satChannels.length}
          </p>
        </StartArticleSection>

        <Suspense key="searchQueryChannel">
          <FlyChannelsTable
            lang={lang}
            satChannels={getFlyGroupedChannelsAllSat([satChannels])}
          />
        </Suspense>
      </article>

      <CommentBlock
        lang={lang}
        numberOfComments={numberOfComments}
        revalidateUrl={`/${lang}/${EUrlBaseParam.SAT_CHANNEL_LIST}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_PACKAGES}
        articleId={CHANNEL_LIST_DB_ID}
        articleName={metaTitle[lang]}
      />
    </>
  );
}
