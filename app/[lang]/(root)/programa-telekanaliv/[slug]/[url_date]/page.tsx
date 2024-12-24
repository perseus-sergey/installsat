import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import { Title } from '@/components/ui/Titles/Title';
import { getDBOnlineChannel } from '@/controllers/channel.controller';
import { cutText } from '@/libs/utils/cutText';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import {
  BREAD_TV_SCHEDULE,
  getChannelScheduleTitle,
  SCHEDULE_META,
} from '@/models/scheduleTV.model';
import SchedulePage from '@/components/SchedulePage/SchedulePage';
import { getFormattedDateStrYearFirst, getValidDate } from '@/libs/utils/dates';
import WeekScheduleTabs from '@/components/tabs/WeekScheduleTabs';
import NoteBlock from '@/components/ui/NoteBlock/NoteBlock';
import GrooveLine from '@/components/ui/GrooveLine';
import ChannelOnlineLink from '@/components/ui/buttons/ChannelOnlineLink/ChannelOnlineLink';
import { getELangKey } from '@/libs/utils/getLanguage';
import { getEnvVariable } from '@/libs/utils/envHandler';
import SimilarChannels from '@/components/SimilarArticles/SimilarChannels';
import ArticleWrapper from '@/components/article/ArticleWrapper';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import { ELanguage } from '@/models/language.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import {
  CHANNEL_IMAGES,
  SIMILAR_ARTICLE_TITLE,
  SIMILAR_CHANNELS_TITLE,
} from '@/models/channels/metaChannel.model';
import { CHANNEL_RESPONSIBILITIES } from '@/models/channels/channel.model';
import { INFO_PANEL_TITLES } from '@/models/ui/infoPanel.model';

const BASE_URL = getEnvVariable('BASE_URL', MAIN_URL);

const {
  channelLogo: { big: bigLogo },
} = CHANNEL_IMAGES;

const { noteTitle, getResponsibilityText } = CHANNEL_RESPONSIBILITIES;

const {
  date: dateTitle,
  views: viewsTitle,
  // comments: commentsTitle,
} = INFO_PANEL_TITLES;

const { getKeywords, getTitle, descriptionStart } = SCHEDULE_META;

export interface IPageProps {
  params: { [_key in EUrlBaseParam]: string };
}

export const revalidate = 43200; // 3600 * 12 invalidate cache every 12 hours

export const generateMetadata = async ({ params }: IPageProps) => {
  const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

  const slug = params[EUrlBaseParam.SLUG];
  const url_date = params[EUrlBaseParam.URL_DATE];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const sqlResult = await getDBOnlineChannel(slug, lang);
  if (!sqlResult) return DEFAULT_META_DATA[lang];

  const { title, description } = sqlResult;

  const metaDescription = `${descriptionStart[lang]} ${title}. ${cutText(description, 150)}`;
  const metaTitle = getTitle(title, url_date)[lang];

  const slugPath = `${EUrlBaseParam.CHANNELS_TV_PROGRAM}/${slug}/${url_date}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: metaTitle,
    description: metaDescription,
    keywords: getKeywords(title)[lang],
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaTitle,
      description: metaDescription,
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

export default async ({ params }: IPageProps) => {
  const slug = params[EUrlBaseParam.SLUG];
  const url_date = params[EUrlBaseParam.URL_DATE];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const sqlResult = await getDBOnlineChannel(slug, lang);
  if (!sqlResult || !getValidDate(url_date)) notFound();

  const {
    // id,
    title,
    logo,
    view,
    vipiko,
    vsetv,
    tvforsite_net,
  } = sqlResult;

  const dbScheduleDataArr = [
    {
      tblName: EDBTableTitles.TV_SCHEDULE_VIPIKO,
      scheduleId: vipiko,
    },
    {
      tblName: EDBTableTitles.TV_SCHEDULE_VSE_TV,
      scheduleId: vsetv,
    },
  ];

  const filteredSchedules = dbScheduleDataArr.filter((t) => t.scheduleId);

  // const numberOfComments = await getCommentsNumber(
  //   EDBTableTitles.COMMENTS_CHANNEL,
  //   `${id}`
  // );

  return (
    <>
      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[BREAD_TV_SCHEDULE, getTitle(title, url_date)[lang]]}
      />

      <ArticleWrapper lang={lang}>
        <Title>
          <span className="inline-block">
            {getChannelScheduleTitle(lang, url_date, title)}
          </span>
          <FillingValidImage
            image={{
              ...bigLogo,
              src: `${bigLogo.path}${logo}`,
            }}
            defaultImage={bigLogo.defaultImage}
            alt={`${bigLogo.alt[lang]} "${title}"`}
            isPriority
          />
        </Title>

        <WeekScheduleTabs
          currentDate={url_date}
          lang={lang}
          channelName={title}
        />

        <section className="min-h-[50vh]">
          <Suspense>
            <SchedulePage
              lang={lang}
              urlDate={url_date}
              channelTitle={title}
              filteredSchedules={filteredSchedules}
            />
          </Suspense>
        </section>

        {tvforsite_net && (
          <ChannelOnlineLink
            lang={lang}
            href={`/${lang}/${EUrlBaseParam.ONLINE_CHANNEL_LIST}/${slug}`}
            channelName={title}
          />
        )}

        <GrooveLine className="py-4" />

        <NoteBlock noteTitle={noteTitle[lang]}>
          {getResponsibilityText(title)[lang]}
        </NoteBlock>

        <BottomInfoPanel
          lang={lang}
          items={[
            { name: viewsTitle[lang], value: view + 1 },
            // { name: commentsTitle[lang], value: numberOfComments },
            {
              name: dateTitle[lang],
              value: <time dateTime={url_date}>{url_date}</time>,
            },
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
    </>
  );
};

// <CommentBlock
//   lang={lang}
//   numberOfComments={numberOfComments}
//   revalidateUrl={`/${lang}/${EUrlBaseParam.CHANNELS_TV_PROGRAM}/${slug}/${url_date}`}
//   dbCommentTableName={EDBTableTitles.COMMENTS_CHANNEL}
//   articleId={`${id}`}
//   articleName={`${h1Start[lang]} "${title}"`}
// />
