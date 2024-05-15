import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import SimilarChannel from '@/components/SimilarChannel/SimilarChannel';
import { Title } from '@/components/ui/Titles/Title';
import {
  getDBOnlineChannel,
  getSimilarChannels,
} from '@/controllers/channel.controller';
import { getComments } from '@/controllers/comments.controller';
import { cutText } from '@/libs/utils/utils';
import { META_CHANNEL } from '@/models/channel.model';
import { LANGUAGE, EDBTableTitles, DEFAULT_META_DATA } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { Metadata } from 'next';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { SCHEDULE_META } from '@/models/scheduleTV.model';
import { getChanOneDaySchedule } from '@/controllers/schedule.controller';
import { notFound } from 'next/navigation';
import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import SchedulePage from '@/components/SchedulePage/SchedulePage';
import { getFormattedDateStr } from '@/libs/utils/dates';
import WeekScheduleTabs from '@/components/tabs/WeekScheduleTabs';

const BASE_URL = process.env.BASE_URL;

const {
  images: {
    channelLogo: { big: bigLogo },
  },
  infoPanelTitles: { comments: commentsTitle, views: viewsTitle },
  similar: { channels: simChannelsBefore },
} = META_CHANNEL;

const { getKeywords, getTitle, h1Start, descriptionStart } = SCHEDULE_META;

export interface IPageProps {
  params: { slug: string; url_date: string };
  // searchParams: TSearchParams;
}

export const generateMetadata = async ({
  params: { slug, url_date },
}: IPageProps): Promise<Metadata> => {
  const sqlResult = await getDBOnlineChannel(slug);
  if (!sqlResult || !sqlResult.length) return DEFAULT_META_DATA[LANGUAGE];

  const { title, description } = sqlResult[0];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [clearedCanonical, ..._] = canonical
  //   .replace(/\/$/, '')
  //   .split('/')
  //   .reverse();

  // if it is encrypted channel or category lybid || UA TV then canonical, else native url
  // const addCanonical =
  //   canonical && (cat_id === 23 || cat_parent_id === 2 || cat_parent_id === 25)
  //     ? clearedCanonical
  //     : chan_slug;
  const metaDescription = `${descriptionStart[LANGUAGE]} ${title}. ${cutText(description, 150)}`;
  const metaTitle = getTitle(title, url_date)[LANGUAGE];

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: getKeywords(title)[LANGUAGE],
    // alternates: {
    //   canonical: `${BASE_URL}/${EUrlBaseParam.CHANNEL_PARAMS}/${addCanonical}`,
    // },
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaTitle,
      description: metaDescription,
      url: `${BASE_URL}/${EUrlBaseParam.CHANNELS_TV_PROGRAM}/${slug}/${url_date}`,
      publishedTime: getFormattedDateStr(),
    },
  };
};

// export async function generateStaticParams(): Promise<
//   {
//     slug: string;
//   }[]
// > {
//   const channelSlugList = await getDBChannelSlugList();

//   if (channelSlugList instanceof Error) return [{ slug: '' }];

//   return channelSlugList.map((channel) => ({ slug: channel.cpu }));
// }

// export const dynamicParams = false;

export default async function Page({
  params: { slug, url_date },
  // searchParams: { date },
}: IPageProps) {
  const sqlResult = await getDBOnlineChannel(slug);
  if (!sqlResult || !sqlResult.length) notFound();

  // =================================================================
  // Check url_date
  // =================================================================

  // =================================================================
  // warn-once.js:16 Image with src "/Images/accordion/film24.png" has either width or height modified, but not the other.
  // If you use CSS to change the size of your image, also include the styles 'width: "auto"' or 'height: "auto"' to maintain the aspect ratio.
  // =================================================================

  const {
    id,
    title,
    logo,
    view,
    vipiko,
    vsetv,
    // cat_title,
    // cat_parent_title,
    // cat_parent_id,
    // cat_parent_cpu,
    // cat_slug,
  } = sqlResult[0];

  // const catLink =
  //   cat_parent_id > 0 ? `${cat_parent_cpu}#${cat_slug}` : cat_slug;

  // const catTitle =
  //   cat_parent_id > 0 ? `${cat_parent_title} - ${cat_title}` : cat_title;

  // const dbScheduleDataArr = [
  //   {
  //     tblName: EDBTableTitles.TV_SCHEDULE_VIPIKO,
  //     scheduleId: vipiko,
  //   },
  //   {
  //     tblName: EDBTableTitles.TV_SCHEDULE_VSE_TV,
  //     scheduleId: vsetv,
  //   },
  // ];
  const dbScheduleDataArr = [
    {
      tblName: EDBTableTitles.TV_SCHEDULE_VIPIKO,
      scheduleId: vipiko,
    },
    {
      tblName: EDBTableTitles.TV_SCHEDULE_VSE_TV,
      scheduleId: vsetv,
    },
    {
      tblName: EDBTableTitles.TV_SCHEDULE_VIPIKO,
      scheduleId: vipiko,
    },
  ];
  const filteredSchedules = dbScheduleDataArr.filter((t) => t.scheduleId);
  const schedules = await getChanOneDaySchedule(filteredSchedules, url_date);

  const similarChannelsResult = await getSimilarChannels(logo);
  const similarChannels =
    similarChannelsResult instanceof Error ? [] : similarChannelsResult;

  const commDbResult = await getComments(
    EDBTableTitles.COMMENTS_CHANNEL,
    `${id}`
  );
  const comments = commDbResult instanceof Error ? [] : commDbResult;

  return (
    <>
      <BreadCrumbServer />
      <article className="article">
        <Title>
          {`${h1Start[LANGUAGE]} "${title}"`}
          <FillingValidImage
            image={{
              ...bigLogo,
              src: `${bigLogo.path}${logo}`,
            }}
            defaultImage={bigLogo.defaultImage}
            alternativeImgString={bigLogo.alternativeImgStr}
            alt={`${bigLogo.alt[LANGUAGE]} "${title}"`}
            isBlur
          />
        </Title>

        <WeekScheduleTabs currentDate={url_date} />
        <SchedulePage
          scheduleList={schedules}
          urlDate={url_date}
          channelTitle={title}
        />

        <BottomInfoPanel
          items={[
            // {
            //   name: packageTitle[LANGUAGE],
            //   value: (
            //     <Link
            //       href={`/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${catLink}`}
            //     >
            //       {catTitle}
            //     </Link>
            //   ),
            // },
            { name: viewsTitle[LANGUAGE], value: view + 1 },
            { name: commentsTitle[LANGUAGE], value: comments.length },
          ]}
        />
      </article>

      {similarChannels.length ? (
        <SimilarArticles
          similarTitle={`${simChannelsBefore.title[LANGUAGE]}"${title}"`}
          similarArticlesMapped={similarChannels.map((chan) => (
            <li key={chan.cpu}>
              <SimilarChannel channelTitle={title} chanParams={chan} />
            </li>
          ))}
        />
      ) : null}

      <CommentBlock
        numberOfComments={comments.length}
        revalidateUrl={`/${EUrlBaseParam.CHANNELS_TV_PROGRAM}/${slug}/${url_date}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_CHANNEL}
        articleId={`${id}`}
        articleName={title}
      />
    </>
  );
}
