import {
  MChanTheme,
  MCompressionColors,
  META_ALL_SAT_CHANNEL_LIST,
  META_SAT_CHANNEL_LIST,
  CHANNEL_TOOLTIP_TITLES,
  TSatChannelListModel,
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

interface ISatChannelsTableProps {
  satChannels: TSatChannelListModel[][][];
}

const FrequencySegment = ({
  frequencyChannels,
}: {
  frequencyChannels: TSatChannelListModel[];
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
                      {CHANNEL_TOOLTIP_TITLES.name.ua}: <strong>{title}</strong>
                    </li>
                    <li>
                      {CHANNEL_TOOLTIP_TITLES.genre.ua}: <strong>{tem}</strong>
                    </li>
                    <li>
                      {CHANNEL_TOOLTIP_TITLES.language.ua}:{' '}
                      <strong>{lan}</strong>
                    </li>
                    <li>
                      {CHANNEL_TOOLTIP_TITLES.description.ua}:{' '}
                      <strong>{cutText(description, 100)}</strong>
                    </li>
                    <li>
                      {CHANNEL_TOOLTIP_TITLES.name.ua}: <strong>{compr}</strong>
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
          <Link href={`/${EUrlBaseParam.CHANNEL_PARAMS}/${cpu}`}>{title}</Link>
          {biss && <p className={styles.biss}>{biss}</p>}
        </td>
        <td className={styles.tdGenre}>
          <FillingImg
            width="24px"
            height="24px"
            src={`/Images/genre/${MChanTheme.get(tema)}`}
          />
        </td>
      </tr>
    )
  );

const SatChannelsTable = ({ satChannels }: ISatChannelsTableProps) => (
  <>
    {satChannels.map((sat, i) => (
      <>
        {satChannels.length > 1 && (
          <h2 key={i} className={styles.satTitle} id={sat[0][0].sat_slug}>
            <TooltipSimple
              tooltipText={META_ALL_SAT_CHANNEL_LIST.anchors.goUpLink.title.ua}
            >
              <Link
                href={`/${EUrlBaseParam.SAT_CHANNEL_LIST}`}
                title={META_ALL_SAT_CHANNEL_LIST.anchors.goUpLink.title.ua}
                className={styles.goUpLink}
              >
                {META_ALL_SAT_CHANNEL_LIST.anchors.goUpLink.img}
              </Link>
            </TooltipSimple>
            <TooltipSimple
              tooltipText={
                META_ALL_SAT_CHANNEL_LIST.links.satTitleLink.tooltipTitle.ua
              }
            >
              <Link
                className={styles.satTitleLink}
                href={`${META_ALL_SAT_CHANNEL_LIST.links.satTitleLink.linkUrl}/${sat[0][0].sat_slug}`}
              >
                {`${sat[0][0].sat_title} - ${sat[0][0].sat_position}`}
                <FillingValidImage
                  image={{
                    ...META_SAT_CHANNEL_LIST.h1SatImage,
                    src: `${META_SAT_CHANNEL_LIST.h1SatImage.path}${sat[0][0].sat_logo}`,
                  }}
                  defaultImage={META_SAT_CHANNEL_LIST.h1SatImage.defaultImage}
                  alternativeImgString={
                    META_SAT_CHANNEL_LIST.h1SatImage.alternativeString
                  }
                  alt={`${META_SAT_CHANNEL_LIST.h1SatImage.alt.ua} ${sat[0][0].sat_title}`}
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
