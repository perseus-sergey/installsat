import { IChannel, META_CHANNEL } from '@/models/channel.model';
import styles from './ChannelParams.module.scss';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';

interface IChannelParamsProps {
  channelDBParams: IChannel;
}

const {
  getParamsTitle,
  paramsLanguage,
  paramsFormat,
  paramsSatellite,
  paramsFrequency,
  paramsFEC,
  paramsEncryption,
  getParamsSite,
} = META_CHANNEL.chanParamsBlock;

const ChannelParams = ({
  channelDBParams: {
    title,
    compression,
    sat_title,
    freq,
    fec,
    polar,
    sr,
    url,
    chan_lang,
    encryption,
    sat_slug,
    chan_slug,
  },
}: IChannelParamsProps) => {
  const bissLink =
    encryption.toLowerCase() === 'biss'
      ? `/${EUrlBaseParam.SAT_CHANNEL_LIST}/${sat_slug}#${chan_slug}`
      : '';

  return (
    <section className={styles.ChannelParams} data-testid="ChannelParams">
      <h2 className="txtshadowblack">{getParamsTitle(title).ua}</h2>
      <ul>
        {chan_lang && (
          <li>
            {paramsLanguage.ua}
            <strong>{chan_lang}</strong>
          </li>
        )}
        {compression && (
          <li>
            {paramsFormat.ua}
            <strong>{compression}</strong>
          </li>
        )}
        {sat_title && (
          <li>
            {paramsSatellite.ua}
            <Link href={`/${EUrlBaseParam.SAT_COVERAGE_MAP}/${sat_slug}`}>
              <strong>{sat_title}</strong>
            </Link>
          </li>
        )}
        {freq && (
          <li>
            {paramsFrequency.ua}
            <strong>
              {freq} {polar} {sr}
            </strong>
          </li>
        )}
        {fec && (
          <li>
            {paramsFEC.ua}
            <strong>{fec}</strong>
          </li>
        )}
        {encryption && (
          <li>
            {bissLink ? (
              <>
                {paramsEncryption.ua}
                <Link href={bissLink}>
                  <strong>{encryption}</strong>
                </Link>
              </>
            ) : (
              <>
                {paramsEncryption.ua}
                <strong>{encryption}</strong>
              </>
            )}
          </li>
        )}
        {url && (
          <li>
            {getParamsSite(title).ua} - <strong>{url}</strong>
          </li>
        )}
      </ul>
    </section>
  );
};

export default ChannelParams;
