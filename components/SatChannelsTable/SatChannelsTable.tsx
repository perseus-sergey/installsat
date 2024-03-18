import { TSatChannelListModel } from '@/models/satChannelList.model';
import styles from './SatChannelsTable.module.scss';
import { imagePathValidate } from '@/libs/utilsServer';
import { IMG_PROPERTIES } from '@/models/ui.model';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { cutText } from '@/libs/utils';
import Tooltip from '../Tooltip/Tooltip';
import FillingImg from '../Images/FillingImage';

interface ISatChannelsTableProps {
  satChannels: TSatChannelListModel[];
}

const MCompressionColors = new Map([
  ['MPEG-2', '#E9E3FD'],
  ['DEFAULT', '#E9E3FD'],
  ['T2-MI', '#f5b3cb'],
  ['MPEG-4', '#FFEDCA'],
  ['DVB-S2', '#FFEDCA'],
  ['HD', '#C5F9F7'],
  ['4K UHD', '#81e3f3'],
]);

const MChanTheme = new Map([
  [1, 'public.png'],
  [2, 'news.png'],
  [3, 'cinema.png'],
  [4, 'sport.png'],
  [5, 'sunset.png'],
  [6, 'kids.png'],
  [7, 'xxx.png'],
  [8, 'music.png'],
  [9, 'discovery.png'],
  [10, 'comedy.png'],
  [11, 'game.png'],
  [12, 'religion.png'],
  [13, 'tv_shopping.png'],
  [14, 'fashion.png'],
]);
// 656D7D

const groupedChannels = (
  satChannels: TSatChannelListModel[]
): TSatChannelListModel[][] => {
  return Object.values(
    satChannels.reduce((acc: Record<number, TSatChannelListModel[]>, curr) => {
      const key = curr.frequency;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);

      return acc;
    }, {})
  ).sort((a, b) => a[0].freq - b[0].freq);
};

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
      {/* <td style='".$this->mpegColor ($arrChannal["compr"])."'><span>$arrChannal[compr]</span></td> */}
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
                    Назва: <strong>{satChannel.title}</strong>
                  </li>
                  <li>
                    Жанр: <strong>{satChannel.tem}</strong>
                  </li>
                  <li>
                    Мова: <strong>{satChannel.lan}</strong>
                  </li>
                  <li>
                    Опис:{' '}
                    <strong>{cutText(satChannel.description, 100)}</strong>
                  </li>
                  <li>
                    Формат: <strong>{satChannel.compr}</strong>
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
  <table className={styles.SatChannelsTable} data-testid="SatChannelsTable">
    <tbody>
      {groupedChannels(satChannels).map((satChannels, idx) => (
        <FrequencySegment key={idx} frequencyChannels={satChannels} />
      ))}
    </tbody>
  </table>
);

export default SatChannelsTable;
