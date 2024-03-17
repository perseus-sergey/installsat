import { TSatChannelListModel } from '@/models/satChannelList.model';
import styles from './SatChannelsTable.module.scss';
import { imagePathValidate } from '@/libs/utilsServer';
import { IMG_PROPERTIES } from '@/models/ui.model';
import Link from 'next/link';
import BlurImage from '../BlurImage/BlurImage';
import { EUrlBaseParam } from '@/models/url.model';
import { cutText } from '@/libs/utils';
import Tooltip from '../Tooltip/Tooltip';

interface ISatChannelsTableProps {
  satChannels: TSatChannelListModel[];
}

const SatChannelsTable = ({ satChannels }: ISatChannelsTableProps) => (
  <section className={styles.SatChannelsTable} data-testid="SatChannelsTable">
    <table>
      <tbody>
        {satChannels.map((satChannel) => (
          <tr key={satChannel.cpu}>
            <td>
              <strong>
                {`${satChannel.freq} ${satChannel.polar}`}
                <br />
                {`${satChannel.sr}, ${satChannel.fec}`}
                <br />
              </strong>
              <span style={{ color: '#666' }}>{satChannel.beam} луч</span>
            </td>
            {/* <td style='".$this->mpegColor ($arrChannal["compr"])."'><span>$arrChannal[compr]</span></td> */}
            <td>{satChannel.compr}</td>
            <td>
              <Tooltip
                hintHtml={
                  <>
                    <BlurImage
                      imgParentWidth={IMG_PROPERTIES.channelLogo.big.width}
                      imgParentHeight={IMG_PROPERTIES.channelLogo.big.height}
                      imgPath={
                        imagePathValidate(
                          `${IMG_PROPERTIES.channelLogo.big.path}${satChannel.logo}`,
                          IMG_PROPERTIES.channelLogo.big.defaultImage
                        ) || IMG_PROPERTIES.channelLogo.big.defaultImage
                      }
                      alt={satChannel.title}
                    />
                    <div className="py-2.5 px-5">
                      <ul>
                        <li>
                          Назва: <strong>{satChannel.title}</strong>
                        </li>
                        <li>
                          Формат: <strong>{satChannel.compr}</strong>
                        </li>
                        <li>
                          Мова: <strong>{satChannel.lan}</strong>
                        </li>
                        <li>
                          Опис:{' '}
                          <strong>
                            {cutText(satChannel.description, 100)}
                          </strong>
                        </li>
                      </ul>
                    </div>
                  </>
                }
              >
                <BlurImage
                  imgParentWidth={IMG_PROPERTIES.channelLogo.small.width}
                  imgParentHeight={IMG_PROPERTIES.channelLogo.small.height}
                  imgPath={
                    imagePathValidate(
                      `${IMG_PROPERTIES.channelLogo.small.path}${satChannel.logo}`,
                      IMG_PROPERTIES.channelLogo.small.defaultImage,
                      true
                    ) || IMG_PROPERTIES.channelLogo.small.defaultImage
                  }
                  alt={satChannel.title}
                />
              </Tooltip>
            </td>
            <td>
              <Link href={`/${EUrlBaseParam.CHANNEL_PARAMS}/${satChannel.cpu}`}>
                {satChannel.title}
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
);

export default SatChannelsTable;
