import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Metadata } from 'next';

import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import ChannelOnlineLink from '@/components/ui/buttons/ChannelOnlineLink/ChannelOnlineLink';
import ChannelParams from '@/components/ChannelParams/ChannelParams';
import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import NoteBlock from '@/components/ui/NoteBlock/NoteBlock';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import { Title } from '@/components/ui/Titles/Title';
import TvScheduleLink from '@/components/TvScheduleLink/TvScheduleLink';
import { updateViewCount } from '@/controllers/viewUpdate.controller';
import { getDBChannel } from '@/controllers/channel.controller';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import GrooveLine from '@/components/ui/GrooveLine';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import EditLinkButton from '@/components/admin/EditLinkButton/EditLinkButton';
import { getELangKey } from '@/libs/utils/getLanguage';
import SimilarChannels from '@/components/SimilarArticles/SimilarChannels';
import ArticleWrapper from '@/components/article/ArticleWrapper';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import { DEFAULT_LANG, ELanguage } from '@/models/language.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';
import { localeStringMaker } from '@/libs/utils/localeStringMaker';
import {
  CHANNEL_IMAGES,
  META_CHANNEL,
  SIMILAR_ARTICLE_TITLE,
  SIMILAR_CHANNELS_TITLE,
} from '@/models/channels/metaChannel.model';
import { INFO_PANEL_TITLES } from '@/models/ui/infoPanel.model';
import { CHANNEL_RESPONSIBILITIES } from '@/models/channels/channel.model';
import { BREAD_SAT_CHANNEL_LIST } from '@/models/channels/channelParams.model';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const { titleBefore, keywordsBefore, preText } = META_CHANNEL;

const {
  channelLogo: { big: bigLogo },
} = CHANNEL_IMAGES;

const { views: viewsTitle } = INFO_PANEL_TITLES;

const { noteTitle, getResponsibilityText } = CHANNEL_RESPONSIBILITIES;

export interface IChannelProps {
  params: { [_key in EUrlBaseParam]: string };
}

const { SLUG, LANG, ONLINE_CHANNEL_LIST, CHANNEL_PARAMS, CHANNELS_TV_PROGRAM } =
  EUrlBaseParam;

export const revalidate = 86400; // 3600 * 24 invalidate cache every 1 day

export const generateMetadata = async ({
  params,
}: IChannelProps): Promise<Metadata> => {
  const slug = params[SLUG];
  const lang = getELangKey(params[LANG]);

  const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

  const sqlResult = await getDBChannel(slug, lang);
  if (!sqlResult) return DEFAULT_META_DATA[lang];

  const {
    title,
    description,
    keywords,
    chan_slug,
    cat_parent_id,
    cat_parent_title,
    cat_title,
    sat_title,
    freq,
    polar,
    canonical,
  } = sqlResult;

  const metaTitle =
    cat_parent_id > 0
      ? `${titleBefore[lang]} ${title} | ${cat_parent_title} | ${cat_title}`
      : `${titleBefore[lang]} ${title} | ${sat_title} ${freq} ${polar} | ${cat_title}`;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [clearedCanonical, ..._] = canonical
    .replace(/\/$/, '')
    .split('/')
    .reverse();

  const addCanonical = canonical ? clearedCanonical : chan_slug;

  return {
    metadataBase: new URL(BASE_URL),
    title: metaTitle,
    description: description || metaTitle,
    keywords: keywordsBefore[lang] + keywords,
    alternates: {
      canonical: `/${DEFAULT_LANG}/${CHANNEL_PARAMS}/${addCanonical}`,
      languages: {
        en: `/${EN}/${CHANNEL_PARAMS}/${chan_slug}`,
        uk: `/${UA}/${CHANNEL_PARAMS}/${chan_slug}`,
        ru: `/${RU}/${CHANNEL_PARAMS}/${chan_slug}`,
        es: `/${ES}/${CHANNEL_PARAMS}/${chan_slug}`,
        ar: `/${AR}/${CHANNEL_PARAMS}/${chan_slug}`,
        de: `/${DE}/${CHANNEL_PARAMS}/${chan_slug}`,
        fr: `/${FR}/${CHANNEL_PARAMS}/${chan_slug}`,
        it: `/${IT}/${CHANNEL_PARAMS}/${chan_slug}`,
      },
    },
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaTitle,
      description: description || metaTitle,
      url: `/${lang}/${CHANNEL_PARAMS}/${chan_slug}`,
      publishedTime: getFormattedDateStrYearFirst('', lang),
    },
  };
};

export default async function Page({ params }: IChannelProps) {
  const slug = params[SLUG];
  const lang = getELangKey(params[LANG]);

  const sqlResult = await getDBChannel(slug, lang);

  if (!sqlResult) notFound();

  const {
    id,
    title,
    logo,
    text,
    view,
    chan_slug,
    cat_id,
    // cat_title,
    // cat_parent_title,
    // cat_parent_id,
    // cat_parent_cpu,
    // cat_slug,
    // sat_slug,
    // sat_title,
    tvforsite_net,
  } = sqlResult;

  const currentDate = getFormattedDateStrYearFirst('', lang);

  updateViewCount(EDBTableTitles.CHANNELS, `${id}`, view);

  return (
    <>
      <Suspense>
        <EditLinkButton
          href={`/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.CHANNELS_EDIT}/edit/${id}`}
        />
      </Suspense>

      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[
          BREAD_SAT_CHANNEL_LIST,
          `${titleBefore[lang]} "${title}"`,
        ]}
      />

      <ArticleWrapper lang={lang}>
        <Title>
          {`${titleBefore[lang]} "${title}"`}
          <FillingValidImage
            image={{
              ...bigLogo,
              src: `${bigLogo.path}${logo}`,
            }}
            defaultImage={bigLogo.defaultImage}
            alt={`${bigLogo.alt[lang]} "${title}"`}
          />
        </Title>

        {cat_id === 23 && <h2 style={{ color: '#ff0000' }}>{preText[lang]}</h2>}
        <div className="article-text">
          <DangerHtml text={text} />
        </div>

        <GrooveLine className="py-4" />

        <TvScheduleLink
          lang={lang}
          title={title}
          href={`/${lang}/${CHANNELS_TV_PROGRAM}/${slug}/${currentDate}`}
        />

        {tvforsite_net && (
          <ChannelOnlineLink
            lang={lang}
            href={`/${lang}/${ONLINE_CHANNEL_LIST}/${slug}`}
            channelName={title}
          />
        )}

        <ChannelParams channelDBParams={sqlResult} lang={lang} />

        <NoteBlock noteTitle={noteTitle[lang]}>
          {getResponsibilityText(title)[lang]}
        </NoteBlock>

        <BottomInfoPanel
          lang={lang}
          items={[
            // {
            //   name: packageTitle[lang],
            //   value: (
            //     <Link
            //       href={`/${lang}/${PACKAGE_CHANNEL_LIST}/${catLink}`}
            //     >
            //       {catTitle}
            //     </Link>
            //   ),
            // },
            {
              name: viewsTitle[lang],
              value: localeStringMaker(view + 1),
            },
            // { name: commentsTitle[lang], value: numberOfComments },
          ]}
        />
      </ArticleWrapper>

      <Suspense>
        <SimilarChannels
          lang={lang}
          chanelTitle={title}
          sectionCaption={`${SIMILAR_CHANNELS_TITLE[lang]} "${title}"`}
        />
      </Suspense>

      <Suspense>
        <SimilarArticles
          similarTitle={SIMILAR_ARTICLE_TITLE[lang]}
          logoSrc={logo}
          lang={lang}
        />
      </Suspense>

      <Suspense>
        <CommentBlock
          lang={lang}
          revalidateUrl={`/${lang}/${CHANNEL_PARAMS}/${chan_slug}`}
          dbCommentTableName={EDBTableTitles.COMMENTS_CHANNEL}
          articleId={`${id}`}
          articleName={title}
        />
      </Suspense>
    </>
  );
}
