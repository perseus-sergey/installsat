import { Title } from '@/components/ui/Titles/Title';
import { getOnlineChannels } from '@/controllers/channelList.controller';
import {
  ALL_SAT_CHANNEL_LIST_FILTERS,
  CHANNEL_LIST_ANCHOR_START,
  META_ONLINE_CHANNEL_LIST,
  ONLINE_CHANNEL_LIST_DATA,
  ONLINE_CHANNEL_LIST_DB_ID,
  ONLINE_CHANNEL_LIST_IMAGES,
} from '@/models/channelList.model';
import type { Metadata } from 'next';
import FillingImg from '@/components/ui/Images/FillingImage';
import Fieldset from '@/components/ui/Fieldset/Fieldset';
import {
  TSearchParams,
  DEFAULT_META_DATA,
  EDBTableTitles,
  ELanguage,
} from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam, MAIN_URL } from '@/models/url.model';
import Filter from '@/components/ui/Filter/Filter';
import { Suspense } from 'react';
import { getELangKey, validSearchParam } from '@/libs/utils/validSearchParam';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import { getCommentsNumber } from '@/controllers/comments.controller';
import TooltipSimple from '@/components/ui/tooltips/TooltipSimple/TooltipSimple';
import GenreImage from '@/components/ui/Images/GenreImage/GenreImage';
import OnlineChannelListAfterText from '@/components/online/OnlineChannelListAfterText/OnlineChannelListAfterText';
import PackageChannelList from '@/components/channelList/PackageChannelList';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import SeoLink from '@/components/ui/SeoLink/SeoLink';

interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

const BASE_URL = process.env.BASE_URL || MAIN_URL;
const { LANG, ONLINE_CHANNEL_LIST } = EUrlBaseParam;

const { metaDescription, metaH1, getH1After, metaKeywords, metaTitle } =
  META_ONLINE_CHANNEL_LIST;

const {
  fieldsetFilters: {
    legendText,
    anchorLink: { ariaLabel },
  },
} = ONLINE_CHANNEL_LIST_DATA;
const { h1Image } = ONLINE_CHANNEL_LIST_IMAGES;

const {
  filterByChannelName: { placeholder, labelTitle },
} = ALL_SAT_CHANNEL_LIST_FILTERS;

export const revalidate = 3600 * 48; // invalidate cache every 48 hours

export const generateMetadata = ({ params }: IPageProps): Metadata => {
  const lang = getELangKey(params[LANG]);

  return {
    metadataBase: new URL(BASE_URL),
    title: metaTitle[lang],
    description: metaDescription[lang],
    keywords: metaKeywords[lang],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaTitle[lang],
      description: metaDescription[lang],
      url: `/${lang}/${ONLINE_CHANNEL_LIST}`,
      publishedTime: getFormattedDateStrYearFirst(),
    },
    alternates: {
      canonical: `/${lang}/${ONLINE_CHANNEL_LIST}`,
      languages: {
        en: `/${ELanguage.EN}/${ONLINE_CHANNEL_LIST}`,
        uk: `/${ELanguage.UA}/${ONLINE_CHANNEL_LIST}`,
      },
    },
  };
};

export default async function Page({ params, searchParams }: IPageProps) {
  const lang = getELangKey(params[LANG]);

  const searchQueryChannel = validSearchParam(
    EUrlSearchParam.CHANNEL,
    searchParams
  );

  const onlineChannels = await getOnlineChannels(lang, searchQueryChannel);

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_GENRE,
    ONLINE_CHANNEL_LIST_DB_ID
  );

  return (
    <>
      <BreadCrumbServer breadCrumbList={[metaH1[lang]]} lang={lang} />
      <article className="article">
        <Title>
          {metaH1[lang]}
          {getH1After(searchQueryChannel)[lang]}
          <FillingImg {...h1Image} alt={h1Image.alt[lang]} />
        </Title>

        <Fieldset legendText={legendText[lang]}>
          <nav className="p-2 md:p-4">
            <ul>
              {onlineChannels.map(([genreTitle, chanList]) => (
                <li key={genreTitle} className="flex items-center gap-4">
                  <GenreImage
                    lang={lang}
                    tooltipText={chanList[0].genre_description}
                    genreMapPosition={chanList[0].genre_id}
                  />
                  <TooltipSimple
                    tooltipText={`${ariaLabel[lang]} ${genreTitle}`}
                  >
                    <SeoLink
                      title={`${ariaLabel[lang]} ${genreTitle}`}
                      href={`#${CHANNEL_LIST_ANCHOR_START}${chanList[0].genre_id}`}
                      className="text-indigo-800 text-lg hover:text-red-500"
                    >
                      {genreTitle}
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
            pathToChannelDetails={ONLINE_CHANNEL_LIST}
            channels={onlineChannels}
          />
        </Suspense>

        <OnlineChannelListAfterText lang={lang} />
      </article>

      <CommentBlock
        lang={lang}
        numberOfComments={numberOfComments}
        revalidateUrl={`/${lang}/${ONLINE_CHANNEL_LIST}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_GENRE}
        articleId={ONLINE_CHANNEL_LIST_DB_ID}
        articleName={metaTitle[lang]}
      />
    </>
  );
}
