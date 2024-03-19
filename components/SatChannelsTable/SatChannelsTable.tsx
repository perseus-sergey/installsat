import {
  MChanTheme,
  MCompressionColors,
  META_SAT_CHANNEL_LIST,
  TOOLTIP_TITLES,
  TSatChannelListModel,
} from '@/models/satChannelList.model';
import styles from './SatChannelsTable.module.scss';
import { imagePathValidate } from '@/libs/utilsServer';
import { IMG_PROPERTIES } from '@/models/ui.model';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { cutText } from '@/libs/utils';
import Tooltip from '../Tooltip/Tooltip';
import FillingImg from '../Images/FillingImage';
import { Title } from '../Title/Title';

interface ISatChannelsTableProps {
  satChannels: TSatChannelListModel[][][];
}

const FrequencySegment = ({
  frequencyChannels,
}: {
  frequencyChannels: TSatChannelListModel[];
}) =>
  frequencyChannels.map((satChannel, idx) => (
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
          backgroundColor: `${MCompressionColors.get(satChannel.compr.toUpperCase() || 'DEFAULT')}`,
        }}
      >
        {satChannel.compr}
      </td>
      <td className={styles.tdChanLogo}>
        <Tooltip
          hintHtml={
            <>
              <FillingImg
                width={IMG_PROPERTIES.channelLogo.big.width}
                height={IMG_PROPERTIES.channelLogo.big.height}
                src={
                  imagePathValidate(
                    `${IMG_PROPERTIES.channelLogo.big.path}${satChannel.logo}`,
                    IMG_PROPERTIES.channelLogo.big.defaultImage
                  ) || IMG_PROPERTIES.channelLogo.big.defaultImage
                }
                alt={satChannel.title}
                isBlur
              />
              <div className="py-2.5 px-5">
                <ul>
                  <li>
                    {TOOLTIP_TITLES.name.ua}:{' '}
                    <strong>{satChannel.title}</strong>
                  </li>
                  <li>
                    {TOOLTIP_TITLES.genre.ua}: <strong>{satChannel.tem}</strong>
                  </li>
                  <li>
                    {TOOLTIP_TITLES.language.ua}:{' '}
                    <strong>{satChannel.lan}</strong>
                  </li>
                  <li>
                    {TOOLTIP_TITLES.description.ua}:{' '}
                    <strong>{cutText(satChannel.description, 100)}</strong>
                  </li>
                  <li>
                    {TOOLTIP_TITLES.name.ua}:{' '}
                    <strong>{satChannel.compr}</strong>
                  </li>
                </ul>
              </div>
            </>
          }
        >
          <FillingImg
            width={IMG_PROPERTIES.channelLogo.small.width}
            height={IMG_PROPERTIES.channelLogo.small.height}
            src={
              imagePathValidate(
                `${IMG_PROPERTIES.channelLogo.small.path}${satChannel.logo}`,
                IMG_PROPERTIES.channelLogo.small.defaultImage,
                true
              ) || IMG_PROPERTIES.channelLogo.small.defaultImage
            }
            alt={satChannel.title}
            isBlur
          />
        </Tooltip>
      </td>
      <td className={styles.tdTitle}>
        <Link href={`/${EUrlBaseParam.CHANNEL_PARAMS}/${satChannel.cpu}`}>
          {satChannel.title}
        </Link>
        {satChannel.biss && <p className={styles.biss}>{satChannel.biss}</p>}
      </td>
      <td className={styles.tdGenre}>
        <FillingImg
          width="24px"
          height="24px"
          src={`/images/genre/${MChanTheme.get(satChannel.tema)}`}
        />
      </td>
    </tr>
  ));

const SatChannelsTable = ({ satChannels }: ISatChannelsTableProps) => (
  <>
    {satChannels.map((sat, i) => {
      const h1ImagePath = imagePathValidate(
        `${META_SAT_CHANNEL_LIST.h1SatImage.path}${sat[0][0].sat_logo}`,
        META_SAT_CHANNEL_LIST.h1SatImage.defaultImage
      );

      return (
        <>
          {satChannels.length > 1 && (
            <Title
              key={i}
              className="flex items-center justify-around gap-4"
              style={{ borderBottom: '2px groove' }}
            >
              {`${sat[0][0].sat_title} - ${sat[0][0].sat_position}`}
              {h1ImagePath ? (
                <FillingImg
                  width={META_SAT_CHANNEL_LIST.h1SatImage.width}
                  height={META_SAT_CHANNEL_LIST.h1SatImage.height}
                  src={h1ImagePath}
                  alt={`Satellite logo for ${sat[0][0].title}`}
                  isBlur
                />
              ) : (
                <span className="text-8xl">
                  {META_SAT_CHANNEL_LIST.h1SatImage.alternativeSymbol}
                </span>
              )}
            </Title>
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
      );
    })}
  </>
);

export default SatChannelsTable;
