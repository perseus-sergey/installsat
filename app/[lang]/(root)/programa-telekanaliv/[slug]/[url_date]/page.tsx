import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
// import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
// import SimilarChannel from '@/components/SimilarChannel/SimilarChannel';
import { Title } from '@/components/ui/Titles/Title';
import {
  getDBOnlineChannel,
  // getSimilarChannels,
} from '@/controllers/channel.controller';
import { getCommentsNumber } from '@/controllers/comments.controller';
import { cutText } from '@/libs/utils/utils';
import { META_CHANNEL } from '@/models/channel.model';
import {
  EDBTableTitles,
  DEFAULT_META_DATA,
  ELanguage,
  DEFAULT_LANG,
} from '@/models/ui.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import { Metadata } from 'next';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { SCHEDULE_META } from '@/models/scheduleTV.model';
import { getChanOneDaySchedule } from '@/controllers/schedule.controller';
import { notFound } from 'next/navigation';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import SchedulePage from '@/components/SchedulePage/SchedulePage';
import { getFormattedDateStrYearFirst, getValidDate } from '@/libs/utils/dates';
import WeekScheduleTabs from '@/components/tabs/WeekScheduleTabs';
import NoteBlock from '@/components/ui/NoteBlock/NoteBlock';
import GrooveLine from '@/components/ui/GrooveLine';
import { BREAD_CRUMBS } from '@/models/breadCrumbs.model';
import ChannelOnlineLink from '@/components/ui/buttons/ChannelOnlineLink/ChannelOnlineLink';
import { decode } from 'html-entities';
import { getELangKey } from '@/libs/utils/validSearchParam';
import { getEnvVariable } from '@/libs/utils/envHandler';

const BASE_URL = getEnvVariable('BASE_URL', MAIN_URL);

const {
  images: {
    channelLogo: { big: bigLogo },
  },
  infoPanelTitles: { comments: commentsTitle, views: viewsTitle },
  // similar: { channels: simChannelsBefore },
  noteTitle,
  getResponsibilityText,
  getOnlineLinkText,
} = META_CHANNEL;

const { getKeywords, getTitle, h1Start, descriptionStart } = SCHEDULE_META;

export interface IPageProps {
  params: { [key in EUrlBaseParam]: string };
}

export const dynamic = 'force-dynamic';

export const generateMetadata = async ({
  params,
}: IPageProps): Promise<Metadata> => {
  const slug = params[EUrlBaseParam.SLUG];
  const url_date = params[EUrlBaseParam.URL_DATE];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const sqlResult = await getDBOnlineChannel(slug);
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

export default async function Page({ params }: IPageProps) {
  const slug = params[EUrlBaseParam.SLUG];
  const url_date = params[EUrlBaseParam.URL_DATE];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const sqlResult = await getDBOnlineChannel(slug);
  if (!sqlResult || !getValidDate(url_date)) notFound();

  const {
    id,
    title: chanTitle,
    logo,
    view,
    vipiko,
    vsetv,
    tvforsite_net,
  } = sqlResult;
  const title = decode(chanTitle);

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
  const schedules = await getChanOneDaySchedule(filteredSchedules, url_date);

  // const similarChannelsResult = await getSimilarChannels(logo);
  // const similarChannels =
  //   similarChannelsResult instanceof Error ? [] : similarChannelsResult;

  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_CHANNEL,
    `${id}`
  );

  return (
    <>
      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[
          BREAD_CRUMBS.CHANNELS_TV_PROGRAM,
          `${h1Start[lang]} "${title}"`,
        ]}
      />
      <article className="article">
        <Title>
          {`${h1Start[lang]} "${title}"`}
          <FillingValidImage
            image={{
              ...bigLogo,
              src: `${bigLogo.path}${logo}`,
            }}
            defaultImage={bigLogo.defaultImage}
            alternativeImgString={bigLogo.alternativeImgStr}
            alt={`${bigLogo.alt[lang]} "${title}"`}
            isBlur
          />
        </Title>

        <WeekScheduleTabs currentDate={url_date} lang={lang} />
        <SchedulePage
          lang={lang}
          scheduleList={schedules}
          urlDate={url_date}
          channelTitle={title}
        />

        {tvforsite_net && (
          <ChannelOnlineLink
            lang={lang}
            href={`/${lang}/${EUrlBaseParam.ONLINE_CHANNEL_LIST}/${slug}`}
          >
            {getOnlineLinkText(title)[lang]}
          </ChannelOnlineLink>
        )}

        <GrooveLine className="py-4" />

        <NoteBlock noteTitle={noteTitle[lang]}>
          {getResponsibilityText(title)[lang]}
        </NoteBlock>

        <BottomInfoPanel
          items={[
            { name: viewsTitle[lang], value: view + 1 },
            { name: commentsTitle[lang], value: numberOfComments },
          ]}
        />
      </article>

      {/* {similarChannels.length ? (
        <SimilarArticles
          similarTitle={`${simChannelsBefore.title[lang]}"${title}"`}
          similarArticlesMapped={similarChannels.map((chan) => (
            <li key={chan.cpu}>
              <SimilarChannel
                channelTitle={title}
                chanParams={chan}
                lang={lang}
              />
            </li>
          ))}
        />
      ) : null} */}

      <CommentBlock
        lang={lang}
        numberOfComments={numberOfComments}
        revalidateUrl={`/${lang}/${EUrlBaseParam.CHANNELS_TV_PROGRAM}/${slug}/${url_date}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_CHANNEL}
        articleId={`${id}`}
        articleName={`${h1Start[lang]} "${title}"`}
      />
    </>
  );
}
