import { IChannel, META_CHANNEL } from '@/models/channel.model';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { CURRENT_LANGUAGE } from '@/models/ui.model';

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
    <section>
      <h2>{getParamsTitle(title)[CURRENT_LANGUAGE]}</h2>
      <ul>
        {chan_lang && (
          <li>
            {paramsLanguage[CURRENT_LANGUAGE]}
            <strong>{chan_lang}</strong>
          </li>
        )}
        {compression && (
          <li>
            {paramsFormat[CURRENT_LANGUAGE]}
            <strong>{compression}</strong>
          </li>
        )}
        {sat_title && (
          <li>
            {paramsSatellite[CURRENT_LANGUAGE]}
            <Link href={`/${EUrlBaseParam.SAT_COVERAGE_MAP}/${sat_slug}`}>
              <strong>{sat_title}</strong>
            </Link>
          </li>
        )}
        {freq && (
          <li>
            {paramsFrequency[CURRENT_LANGUAGE]}
            <strong>
              {freq} {polar} {sr}
            </strong>
          </li>
        )}
        {fec && (
          <li>
            {paramsFEC[CURRENT_LANGUAGE]}
            <strong>{fec}</strong>
          </li>
        )}
        {encryption && (
          <li>
            {bissLink ? (
              <>
                {paramsEncryption[CURRENT_LANGUAGE]}
                <Link href={bissLink}>
                  <strong>{encryption}</strong>
                </Link>
              </>
            ) : (
              <>
                {paramsEncryption[CURRENT_LANGUAGE]}
                <strong>{encryption}</strong>
              </>
            )}
          </li>
        )}
        {url && (
          <li>
            {getParamsSite(title)[CURRENT_LANGUAGE]} - <strong>{url}</strong>
          </li>
        )}
      </ul>
    </section>
  );
};

export default ChannelParams;
