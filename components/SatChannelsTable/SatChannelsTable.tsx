import {
  MChanTheme,
  MCompressionColors,
  META_ALL_SAT_CHANNEL_LIST,
  META_SAT_CHANNEL_LIST,
  CHANNEL_TOOLTIP_TITLES,
  ISatChannelListEmptyModel,
} from '@/models/channelList.model';
import styles from './SatChannelsTable.module.scss';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { cutText } from '@/libs/utils';
import Tooltip from '../Tooltip/Tooltip';
import FillingImg from '../Images/FillingImage';
import TooltipSimple from '../TooltipSimple/TooltipSimple';
import FillingValidImage from '../Images/FillingValidImage';
import { META_CHANNEL } from '@/models/channel.model';
import { LANGUAGE } from '@/models/ui.model';

const {
  anchors: { goUpLink },
  links: { satTitleLink },
} = META_ALL_SAT_CHANNEL_LIST;

const {
  images: { h1SatImage, genreImage },
} = META_SAT_CHANNEL_LIST;

interface ISatChannelsTableProps {
  satChannels: ISatChannelListEmptyModel[][][];
  isSingleSat?: boolean;
}

const FrequencySegment = ({
  frequencyChannels,
}: {
  frequencyChannels: ISatChannelListEmptyModel[];
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
          <Tooltip
            hintHtml={
              <>
                <FillingValidImage
                  image={{
                    ...META_CHANNEL.images.channelLogo.big,
                    src: `${META_CHANNEL.images.channelLogo.big.path}${logo}`,
                  }}
                  defaultImage={
                    META_CHANNEL.images.channelLogo.big.defaultImage
                  }
                  alternativeImgString={
                    META_CHANNEL.images.channelLogo.big.alternativeImgStr
                  }
                />
                <div className="py-2.5 px-5">
                  <ul>
                    <li>
                      {CHANNEL_TOOLTIP_TITLES.name[LANGUAGE]}:{' '}
                      <strong>{title}</strong>
                    </li>
                    <li>
                      {CHANNEL_TOOLTIP_TITLES.genre[LANGUAGE]}:{' '}
                      <strong>{tem}</strong>
                    </li>
                    <li>
                      {CHANNEL_TOOLTIP_TITLES.language[LANGUAGE]}:{' '}
                      <strong>{lan}</strong>
                    </li>
                    <li>
                      {CHANNEL_TOOLTIP_TITLES.description[LANGUAGE]}:{' '}
                      <strong>{cutText(description, 100)}</strong>
                    </li>
                    <li>
                      {CHANNEL_TOOLTIP_TITLES.name[LANGUAGE]}:{' '}
                      <strong>{compr}</strong>
                    </li>
                  </ul>
                </div>
              </>
            }
          >
            <FillingValidImage
              image={{
                ...META_CHANNEL.images.channelLogo.small,
                src: `${META_CHANNEL.images.channelLogo.small.path}${logo}`,
              }}
              defaultImage={META_CHANNEL.images.channelLogo.small.defaultImage}
              alternativeImgString={
                META_CHANNEL.images.channelLogo.small.alternativeImgStr
              }
              isChangeToGif
            />
          </Tooltip>
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
              src={`/Images/genre/${MChanTheme.get(tema)}`}
            />
          </TooltipSimple>
        </td>
      </tr>
    )
  );

const SatChannelsTable = ({
  satChannels,
  isSingleSat = false,
}: ISatChannelsTableProps) => (
  <>
    {satChannels.map((sat, i) => (
      <>
        {!isSingleSat && (
          <h2 key={i} className={styles.satTitle} id={sat[0][0].sat_slug}>
            <TooltipSimple tooltipText={goUpLink.title[LANGUAGE]}>
              <Link
                href={`#`}
                title={goUpLink.title[LANGUAGE]}
                className={styles.goUpLink}
              >
                {goUpLink.img}
              </Link>
            </TooltipSimple>

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
          </h2>
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
);

export default SatChannelsTable;
