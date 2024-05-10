import {
  MChanTheme,
  MCompressionColors,
  META_ALL_SAT_CHANNEL_LIST,
  META_SAT_CHANNEL_LIST,
  CHANNEL_TOOLTIP_TITLES,
  ISatChannelListModel,
} from '@/models/channelList.model';
import styles from './SatChannelsTable.module.scss';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { cutText } from '@/libs/utils/utils';
import FillingImg from '../ui/Images/FillingImage';
import TooltipSimple from '../ui/TooltipSimple/TooltipSimple';
import FillingValidImage from '../ui/Images/FillingValidImage';
import { META_CHANNEL } from '@/models/channel.model';
import { LANGUAGE } from '@/models/ui.model';
import ChannelCardTooltip from '../ChannelCardTooltip/ChannelCardTooltip';
import GoUpLink from '../ui/GoUpLink/GoUpLink';
import { TitleH2List } from '../ui/Titles/TitleH2List';
import EmptyData from '../errors/EmptyData/EmptyData';

const {
  links: { satTitleLink },
} = META_ALL_SAT_CHANNEL_LIST;

const {
  images: { h1SatImage, genreImage },
} = META_SAT_CHANNEL_LIST;

interface ISatChannelsTableProps {
  satChannels: ISatChannelListModel[][][];
  isSingleSat?: boolean;
}

const FrequencySegment = ({
  frequencyChannels,
}: {
  frequencyChannels: ISatChannelListModel[];
}) =>
  frequencyChannels.map(
    ({ logo, compr, title, tem, lan, description, cpu, biss, tema }, idx) => (
      <tr key={idx}>
        {!idx && (
          <td rowSpan={frequencyChannels.length} className={styles.tdFrequency}>
            <strong>
              {`${frequencyChannels[0].freq} ${frequencyChannels[0].polar}`}
              <br />
              {`${frequencyChannels[0].sr}, ${frequencyChannels[0].fec}`}
              <br />
            </strong>
            <span className={styles.beam}>{frequencyChannels[0].beam} луч</span>
          </td>
        )}
        <td
          className={styles.tdCompression}
          style={{
            backgroundColor: `${MCompressionColors.get(compr.toUpperCase() || 'DEFAULT')}`,
          }}
        >
          {compr}
        </td>
        <td className={styles.tdChanLogo}>
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
                title: CHANNEL_TOOLTIP_TITLES.name[LANGUAGE],
                description: title,
              },
              {
                title: CHANNEL_TOOLTIP_TITLES.genre[LANGUAGE],
                description: tem,
              },
              {
                title: CHANNEL_TOOLTIP_TITLES.language[LANGUAGE],
                description: lan,
              },
              {
                title: CHANNEL_TOOLTIP_TITLES.description[LANGUAGE],
                description: cutText(description, 100),
              },
              {
                title: CHANNEL_TOOLTIP_TITLES.compression[LANGUAGE],
                description: compr,
              },
            ]}
          />
        </td>
        <td className={styles.tdTitle}>
          <Link id={cpu} href={`/${EUrlBaseParam.CHANNEL_PARAMS}/${cpu}`}>
            {title}
          </Link>
          {biss && <p className={styles.biss}>{biss}</p>}
        </td>
        <td className={styles.tdGenre}>
          <TooltipSimple tooltipText={tem}>
            <FillingImg
              width={genreImage.width}
              height={genreImage.height}
              alt={`${genreImage.altPre} ${tem}`}
              src={`${genreImage.path}${MChanTheme.get(tema)}`}
            />
          </TooltipSimple>
        </td>
      </tr>
    )
  );

const SatChannelsTable = ({
  satChannels,
  isSingleSat = false,
}: ISatChannelsTableProps) =>
  satChannels.length > 0 && satChannels[0].length > 0 ? (
    <>
      {satChannels.map((sat) => (
        <>
          {!isSingleSat && (
            <TitleH2List id={sat[0][0].sat_slug}>
              <GoUpLink />

              <TooltipSimple tooltipText={satTitleLink.tooltipTitle[LANGUAGE]}>
                <Link
                  className={styles.satTitleLink}
                  href={`${satTitleLink.linkUrl}/${sat[0][0].sat_slug}`}
                >
                  {`${sat[0][0].sat_title} - ${sat[0][0].sat_position}`}
                </Link>
              </TooltipSimple>
              <TooltipSimple tooltipText={satTitleLink.tooltipTitle[LANGUAGE]}>
                <Link
                  className={styles.satTitleLink}
                  href={`${satTitleLink.linkUrl}/${sat[0][0].sat_slug}`}
                >
                  <FillingValidImage
                    image={{
                      ...h1SatImage,
                      src: `${h1SatImage.path}${sat[0][0].sat_logo}`,
                    }}
                    defaultImage={h1SatImage.defaultImage}
                    alternativeImgString={h1SatImage.alternativeString}
                    alt={`${h1SatImage.alt[LANGUAGE]} ${sat[0][0].sat_title}`}
                    isBlur
                  />
                </Link>
              </TooltipSimple>
            </TitleH2List>
          )}
          <table
            className={styles.SatChannelsTable}
            data-testid="SatChannelsTable"
          >
            <tbody>
              {sat.map((freqChannels, idx) => (
                <FrequencySegment key={idx} frequencyChannels={freqChannels} />
              ))}
            </tbody>
          </table>
        </>
      ))}
    </>
  ) : (
    <EmptyData />
  );

export default SatChannelsTable;
