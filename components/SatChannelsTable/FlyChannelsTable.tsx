import {
  MChanTheme,
  MCompressionColors,
  META_ALL_SAT_CHANNEL_LIST,
  META_SAT_CHANNEL_LIST,
  CHANNEL_TOOLTIP_TITLES,
  IFlySatChannelListModel,
} from '@/models/channelList.model';
import styles from './SatChannelsTable.module.scss';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { cutText } from '@/libs/utils/utils';
import FillingImg from '../ui/Images/FillingImage';
import TooltipSimple from '../ui/tooltips/TooltipSimple/TooltipSimple';
import FillingValidImage from '../ui/Images/FillingValidImage';
import { META_CHANNEL } from '@/models/channel.model';
import ChannelCardTooltip from '../ChannelCardTooltip/ChannelCardTooltip';
import GoUpLink from '../ui/GoUpLink/GoUpLink';
import { TitleH2List } from '../ui/Titles/TitleH2List';
import EmptyData from '../errors/EmptyData/EmptyData';
import { ELanguage } from '@/models/ui.model';

const {
  links: { satTitleLink },
} = META_ALL_SAT_CHANNEL_LIST;

const {
  images: { h1SatImage, genreImage },
} = META_SAT_CHANNEL_LIST;

interface ISatChannelsTableProps {
  lang: ELanguage;
  satChannels: IFlySatChannelListModel[][][];
  isSingleSat?: boolean;
}

const FrequencySegment = ({
  frequencyChannels,
  lang,
}: {
  frequencyChannels: IFlySatChannelListModel[];
  lang: ELanguage;
}) =>
  frequencyChannels.map(
    (
      {
        logo,
        compress,
        title,
        theme,
        lan,
        description_en,
        slug,
        biss,
        theme_id,
      },
      idx
    ) => {
      return (
        <tr key={idx}>
          {!idx && (
            <td
              rowSpan={frequencyChannels.length}
              className={styles.tdFrequency}
            >
              <strong>
                {`${frequencyChannels[0].frequency} ${frequencyChannels[0].polarization}`}
                <br />
                {`${frequencyChannels[0].sr}, ${frequencyChannels[0].fec}`}
                <br />
              </strong>
              <span className={styles.beam}>
                {frequencyChannels[0].beam}{' '}
                {lang === ELanguage.UA ? 'луч' : 'beam'}
              </span>
            </td>
          )}
          <td
            className={styles.tdCompression}
            style={{
              backgroundColor: `${MCompressionColors.get(compress.toUpperCase() || 'DEFAULT')}`,
            }}
          >
            {compress}
          </td>
          <td className={styles.tdChanLogo}>
            {logo && (
              <ChannelCardTooltip
                mainImage={{
                  ...META_CHANNEL.images.channelLogo.small,
                  src: `${META_CHANNEL.images.channelLogo.small.path}${logo}`,
                }}
                mainDefaultImage={
                  META_CHANNEL.images.channelLogo.small.defaultImage
                }
                mainAlternativeImgString={
                  META_CHANNEL.images.channelLogo.small.alternativeImgStr
                }
                mainIsChangeToGif
                tooltipImage={{
                  ...META_CHANNEL.images.channelLogo.big,
                  src: `${META_CHANNEL.images.channelLogo.big.path}${logo}`,
                }}
                tooltipDefaultImage={
                  META_CHANNEL.images.channelLogo.big.defaultImage
                }
                tooltipAlternativeImgString={
                  META_CHANNEL.images.channelLogo.big.alternativeImgStr
                }
                tooltipTextList={[
                  {
                    title: CHANNEL_TOOLTIP_TITLES.name[lang],
                    description: title,
                  },
                  {
                    title: CHANNEL_TOOLTIP_TITLES.genre[lang],
                    description: theme,
                  },
                  {
                    title: CHANNEL_TOOLTIP_TITLES.language[lang],
                    description: lan,
                  },
                  {
                    title: CHANNEL_TOOLTIP_TITLES.description[lang],
                    description: cutText(description_en, 100),
                  },
                  {
                    title: CHANNEL_TOOLTIP_TITLES.compression[lang],
                    description: compress,
                  },
                ]}
              />
            )}
          </td>
          <td className={styles.tdTitle}>
            <Link
              id={slug}
              href={`/${lang}/${EUrlBaseParam.CHANNEL_PARAMS}/${slug}`}
            >
              {title}
            </Link>
            {biss && <p className={styles.biss}>{biss}</p>}
          </td>
          <td className={styles.tdGenre}>
            {theme_id && (
              <div className="flex flex-col items-center">
                <TooltipSimple tooltipText={theme}>
                  <FillingImg
                    width={genreImage.width}
                    height={genreImage.height}
                    alt={`${genreImage.altPre} ${theme}`}
                    src={`${genreImage.path}${MChanTheme.get(theme_id)}`}
                  />
                </TooltipSimple>
              </div>
            )}
          </td>
        </tr>
      );
    }
  );

const FlyChannelsTable = ({
  satChannels,
  lang,
  isSingleSat = false,
}: ISatChannelsTableProps) =>
  satChannels.length > 0 && satChannels[0].length > 0 ? (
    <>
      {satChannels.map((sat) => (
        <>
          {!isSingleSat && (
            <TitleH2List id={sat[0][0].sat_slug}>
              <GoUpLink lang={lang} />

              <TooltipSimple tooltipText={satTitleLink.tooltipTitle[lang]}>
                <Link
                  className={styles.satTitleLink}
                  href={`/${lang}${satTitleLink.linkUrl}/${sat[0][0].sat_slug}`}
                >
                  {`${sat[0][0].sat_title} - ${sat[0][0].sat_position}`}
                </Link>
              </TooltipSimple>
              <TooltipSimple tooltipText={satTitleLink.tooltipTitle[lang]}>
                <Link
                  className={styles.satTitleLink}
                  href={`/${lang}${satTitleLink.linkUrl}/${sat[0][0].sat_slug}`}
                >
                  <FillingValidImage
                    image={{
                      ...h1SatImage,
                      src: `${h1SatImage.path}${sat[0][0].sat_logo}`,
                    }}
                    defaultImage={h1SatImage.defaultImage}
                    alternativeImgString={h1SatImage.alternativeString}
                    alt={`${h1SatImage.alt[lang]} ${sat[0][0].sat_title}`}
                    isBlur
                  />
                </Link>
              </TooltipSimple>
            </TitleH2List>
          )}
          <table className={styles.SatChannelsTable}>
            <tbody>
              {sat.map((freqChannels, idx) => (
                <FrequencySegment
                  key={idx}
                  frequencyChannels={freqChannels}
                  lang={lang}
                />
              ))}
            </tbody>
          </table>
        </>
      ))}
    </>
  ) : (
    <EmptyData lang={lang} />
  );

export default FlyChannelsTable;
