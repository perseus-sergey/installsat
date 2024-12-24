import Image from 'next/image';
import { Suspense } from 'react';

import { Title } from '@/components/ui/Titles/Title';
import { getOnlineChannels } from '@/controllers/channelList.controller';
import type { Metadata } from 'next';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';
import { getELangKey } from '@/libs/utils/getLanguage';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import OnlineChannelListAfterText from '@/components/online/OnlineChannelListAfterText/OnlineChannelListAfterText';
import PackageChannelList from '@/components/channelList/PackageChannelList';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import h1Img from 'public/Images/packages/Popcorn-icon.png';
import ArticleWrapper from '@/components/article/ArticleWrapper';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import { ELanguage } from '@/models/language.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import {
  META_ONLINE_CHANNEL_LIST,
  ONLINE_CHANNEL_LIST_DATA,
  ONLINE_CHANNEL_LIST_IMAGES,
} from '@/models/channels/onlineChannelListMeta.model';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { ONLINE_CHANNEL_LIST_DB_ID } from '@/models/channels/channelList.model';

interface IPageProps {
  params: { [_key in EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

const BASE_URL = process.env.BASE_URL || MAIN_URL;
const { LANG, ONLINE_CHANNEL_LIST } = EUrlBaseParam;

const { metaDescription, metaH1, getH1After, metaKeywords, metaTitle } =
  META_ONLINE_CHANNEL_LIST;

const {
  fieldsetFilters: {},
} = ONLINE_CHANNEL_LIST_DATA;
const { h1Image } = ONLINE_CHANNEL_LIST_IMAGES;

export const revalidate = 172800; // 3600 * 48 invalidate cache every 2 days

export const generateMetadata = ({ params }: IPageProps): Metadata => {
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
      url: `/${lang}/${ONLINE_CHANNEL_LIST}`,
      publishedTime: getFormattedDateStrYearFirst('', lang),
    },
    alternates: {
      canonical: `/${lang}/${ONLINE_CHANNEL_LIST}`,
      languages: {
        en: `/${EN}/${ONLINE_CHANNEL_LIST}`,
        uk: `/${UA}/${ONLINE_CHANNEL_LIST}`,
        ru: `/${RU}/${ONLINE_CHANNEL_LIST}`,
        es: `/${ES}/${ONLINE_CHANNEL_LIST}`,
        ar: `/${AR}/${ONLINE_CHANNEL_LIST}`,
        de: `/${DE}/${ONLINE_CHANNEL_LIST}`,
        fr: `/${FR}/${ONLINE_CHANNEL_LIST}`,
        it: `/${IT}/${ONLINE_CHANNEL_LIST}`,
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

  const getChannelsFn = () => getOnlineChannels(lang, searchQueryChannel);

  return (
    <>
      <BreadCrumbServer breadCrumbList={[metaH1[lang]]} lang={lang} />

      <ArticleWrapper lang={lang}>
        <Title>
          {metaH1[lang]}
          {getH1After(searchQueryChannel)[lang]}
          <Image src={h1Img} alt={h1Image.alt[lang]} priority />
        </Title>

        <section className="min-h-[70vh]">
          <Suspense>
            <PackageChannelList
              lang={lang}
              isGenre
              getChannelsFn={getChannelsFn}
              pathToChannelDetails={ONLINE_CHANNEL_LIST}
            />
          </Suspense>
        </section>

        <OnlineChannelListAfterText lang={lang} />
      </ArticleWrapper>

      <Suspense>
        <CommentBlock
          lang={lang}
          revalidateUrl={`/${lang}/${ONLINE_CHANNEL_LIST}`}
          dbCommentTableName={EDBTableTitles.COMMENTS_GENRE}
          articleId={ONLINE_CHANNEL_LIST_DB_ID}
          articleName={metaTitle[lang]}
        />
      </Suspense>
    </>
  );
}
