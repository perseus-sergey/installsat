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
import {
  CHANNEL_IMAGES,
  CHANNEL_RESPONSIBILITIES,
  META_CHANNEL,
  SIMILAR,
} from '@/models/channel.model';
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
import TextUnderH1 from '@/components/TextUnderH1/TextUnderH1';
import {
  MChanTheme,
  SAT_CHANNEL_LIST_IMAGES,
} from '@/models/channelList.model';
import FillingImg from '@/components/ui/Images/FillingImage';
import { INFO_PANEL_TITLES } from '@/models/articles.model';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

export const revalidate = 3600 * 12; // invalidate cache every 12 hours

const { titleBefore, preText } = META_CHANNEL;
const { views: viewsTitle } = INFO_PANEL_TITLES;
const { genreImage } = SAT_CHANNEL_LIST_IMAGES;
const { noteTitle, getResponsibilityText } = CHANNEL_RESPONSIBILITIES;
const { channels: simChannelsBefore } = SIMILAR;
const {
  channelLogo: { big: bigLogo },
} = CHANNEL_IMAGES;

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
    keywords,
    slug: chan_slug,
    sat_title,
    frequency,
    polarization,
    beam,
    a_pid,
  } = flyChannels;

  const metaTitle = `${titleBefore[lang]} ${title} | ${sat_title} ${frequency} ${polarization}`;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [clearedCanonical, ..._] = canonical
  //   .replace(/\/$/, '')
  //   .split('/')
  //   .reverse();

  // const addCanonical = canonical ? clearedCanonical : chan_slug;
  const chanDescription = description || `${metaTitle} | ${beam} | ${a_pid}`;

  return {
    metadataBase: new URL(BASE_URL),
    title: metaTitle,
    description: chanDescription,
    keywords: keywords || chanDescription,
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
    theme,
    genre_description,
    theme_id,
    view,
    is_removed,
    sat_slug,
    sat_title,
    official_broadcast_url,
    vsetv,
    vipiko,
  } = flyChannels;

  const genreImgSrc = theme_id ? MChanTheme.get(theme_id) : theme_id;

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
          {`${titleBefore[lang]} ≪${title}≫`}
          {logo && (
            <FillingValidImage
              image={{
                ...bigLogo,
                src: `${bigLogo.path}${logo}`,
              }}
              defaultImage={bigLogo.defaultImage}
              alt={`${bigLogo.alt[lang]} "${title}"`}
            />
          )}
        </Title>

        {theme && (
          <TextUnderH1>
            <div className="flex flex-wrap items-center gap-2">
              <FillingImg
                width={genreImage.width}
                height={genreImage.height}
                alt={`${genreImage.altPre} "${theme}"`}
                src={`${genreImage.path}${genreImgSrc}`}
              />
              <b>{theme}:</b> {genre_description}
            </div>
          </TextUnderH1>
        )}

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
            title={title}
            href={`/${lang}/${EUrlBaseParam.CHANNELS_TV_PROGRAM}/${slug}/${currentDate}`}
          />
        ) : null}

        {official_broadcast_url && (
          <ChannelOnlineLink
            lang={lang}
            href={`/${lang}/${EUrlBaseParam.ONLINE_CHANNEL_LIST}/${slug}`}
            channelName={title}
          />
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
              <SimilarFlyChannel
                lang={lang}
                chanParams={chan}
                chanName={title}
              />
            </li>
          ))}
        />
      ) : null}
    </>
  );
}
