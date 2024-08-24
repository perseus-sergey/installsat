import BottomInfoPanel from '@/components/BottomInfoPanel/BottomInfoPanel';
import ChannelOnlineLink from '@/components/ui/buttons/ChannelOnlineLink/ChannelOnlineLink';
import { FlyChannelParams } from '@/components/ChannelParams/ChannelParams';
import DangerHtml from '@/components/ui/DangerHtml/DangerHtml';
import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import NoteBlock from '@/components/ui/NoteBlock/NoteBlock';
import SimilarArticles from '@/components/SimilarArticles/SimilarArticles';
import { SimilarFlyChannel } from '@/components/SimilarChannel/SimilarChannel';
import { Title } from '@/components/ui/Titles/Title';
import TvScheduleLink from '@/components/TvScheduleLink/TvScheduleLink';
import { updateViewCount } from '@/controllers/articles.controller';
import {
  getDBFlyChannel,
  getSimilarFlyChannels,
} from '@/controllers/channel.controller';
import { META_CHANNEL } from '@/models/channel.model';
import {
  EDBTableTitles,
  DEFAULT_META_DATA,
  ELanguage,
} from '@/models/ui.model';
import { EUrlAdminParam, EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import { Metadata } from 'next';
import GrooveLine from '@/components/ui/GrooveLine';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import EditLinkButton from '@/components/admin/EditLinkButton/EditLinkButton';
import { notFound } from 'next/navigation';
import { getELangKey } from '@/libs/utils/validSearchParam';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

const {
  images: {
    channelLogo: { big: bigLogo },
  },
  infoPanelTitles: { views: viewsTitle },
  titleBefore,
  keywordsBefore,
  preText,
  scheduleLinkText: { channel: scheduleTitle },
  noteTitle,
  getOnlineLinkText,
  getResponsibilityText,
  similar: { channels: simChannelsBefore },
} = META_CHANNEL;

export interface IChannelProps {
  params: { [key in EUrlBaseParam]: string };
}

export const generateMetadata = async ({
  params,
}: IChannelProps): Promise<Metadata> => {
  const slug = params[EUrlBaseParam.SLUG];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const flyChannels = await getDBFlyChannel(slug, lang);
  if (!flyChannels) return DEFAULT_META_DATA[lang];

  const {
    title,
    description,
    slug: chan_slug,
    sat_title,
    frequency,
    polarization,
  } = flyChannels;

  const metaTitle = `${titleBefore[lang]} ${title} | ${sat_title} ${frequency} ${polarization}`;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [clearedCanonical, ..._] = canonical
  //   .replace(/\/$/, '')
  //   .split('/')
  //   .reverse();

  // const addCanonical = canonical ? clearedCanonical : chan_slug;

  return {
    metadataBase: new URL(BASE_URL),
    title: metaTitle,
    description: description || metaTitle,
    keywords: keywordsBefore[lang] + description,
    alternates: {
      // canonical: `/${DEFAULT_LANG}/${EUrlBaseParam.KANAL}/${addCanonical}`,
      languages: {
        en: `/${ELanguage.EN}/${EUrlBaseParam.KANAL}/${chan_slug}`,
        uk: `/${ELanguage.UA}/${EUrlBaseParam.KANAL}/${chan_slug}`,
      },
    },
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title: metaTitle,
      description: description || metaTitle,
      url: `/${lang}/${EUrlBaseParam.KANAL}/${chan_slug}`,
      publishedTime: getFormattedDateStrYearFirst(),
    },
  };
};

export default async function Page({ params }: IChannelProps) {
  const slug = params[EUrlBaseParam.SLUG];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const flyChannels = await getDBFlyChannel(slug, lang);

  if (!flyChannels) notFound();

  const {
    id,
    title,
    logo,
    text,
    view,
    is_removed,
    sat_slug,
    sat_title,
    official_broadcast_url,
    vsetv,
    vipiko,
  } = flyChannels;

  const similarChannels = await getSimilarFlyChannels(title);

  // const similarArticles = await getSimilarArticles(
  //   chan_slug.split('-').slice(1).join('-')
  // );

  const currentDate = getFormattedDateStrYearFirst();

  updateViewCount(EDBTableTitles.FLY_CHANNELS, `${id}`, view);

  return (
    <>
      <EditLinkButton
        href={`/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.CHANNELS_EDIT}/edit/${id}`}
      />
      <BreadCrumbServer
        lang={lang}
        breadCrumbList={[
          {
            href: `${EUrlBaseParam.SAT_CHANNEL_LIST}/${sat_slug}`,
            title: sat_title,
          },
          `${titleBefore[lang]} "${title}"`,
        ]}
      />
      <article className="article">
        <Title>
          {`${titleBefore[lang]} "${title}"`}
          {logo && (
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
          )}
        </Title>

        {text ? (
          <div className="article-text">
            {is_removed === 1 && (
              <h2 style={{ color: '#ff0000' }}>{preText[lang]}</h2>
            )}
            <>
              <DangerHtml text={text} />
              <GrooveLine className="py-4" />
            </>
          </div>
        ) : null}

        {vipiko || vsetv ? (
          <TvScheduleLink
            lang={lang}
            title={`${scheduleTitle[lang]} "${title}"`}
            href={`/${lang}/${EUrlBaseParam.CHANNELS_TV_PROGRAM}/${slug}/${currentDate}`}
          />
        ) : null}

        {official_broadcast_url && (
          <ChannelOnlineLink
            lang={lang}
            href={`/${lang}/${EUrlBaseParam.ONLINE_CHANNEL_LIST}/${slug}`}
          >
            {getOnlineLinkText(title)[lang]}
          </ChannelOnlineLink>
        )}
        <FlyChannelParams channelDBParams={flyChannels} lang={lang} />

        <NoteBlock noteTitle={noteTitle[lang]}>
          {getResponsibilityText(title)[lang]}
        </NoteBlock>

        <BottomInfoPanel
          items={[
            {
              name: viewsTitle[lang],
              value: (view + 1).toLocaleString('en-US'),
            },
          ]}
        />
      </article>

      {similarChannels.length ? (
        <SimilarArticles
          similarTitle={`${simChannelsBefore.title[lang]} "${title}"`}
          similarArticlesMapped={similarChannels.map((chan) => (
            <li key={chan.slug}>
              <SimilarFlyChannel lang={lang} chanParams={chan} />
            </li>
          ))}
        />
      ) : null}
    </>
  );
}
