import { IChannel, META_CHANNEL } from '@/models/channel.model';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { DEFAULT_LANG } from '@/models/ui.model';
import { TitleH2 } from '../ui/Titles/TitleH2';

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
      <TitleH2>{getParamsTitle(title)[DEFAULT_LANG]}</TitleH2>
      <ul>
        {chan_lang && (
          <li>
            {paramsLanguage[DEFAULT_LANG]}
            <strong>{chan_lang}</strong>
          </li>
        )}
        {compression && (
          <li>
            {paramsFormat[DEFAULT_LANG]}
            <strong>{compression}</strong>
          </li>
        )}
        {sat_title && (
          <li>
            {paramsSatellite[DEFAULT_LANG]}
            <Link href={`/${EUrlBaseParam.SAT_COVERAGE_MAP}/${sat_slug}`}>
              <strong>{sat_title}</strong>
            </Link>
          </li>
        )}
        {freq && (
          <li>
            {paramsFrequency[DEFAULT_LANG]}
            <strong>
              {freq} {polar} {sr}
            </strong>
          </li>
        )}
        {fec && (
          <li>
            {paramsFEC[DEFAULT_LANG]}
            <strong>{fec}</strong>
          </li>
        )}
        {encryption && (
          <li>
            {bissLink ? (
              <>
                {paramsEncryption[DEFAULT_LANG]}
                <Link href={bissLink}>
                  <strong>{encryption}</strong>
                </Link>
              </>
            ) : (
              <>
                {paramsEncryption[DEFAULT_LANG]}
                <strong>{encryption}</strong>
              </>
            )}
          </li>
        )}
        {url && (
          <li>
            {getParamsSite(title)[DEFAULT_LANG]} - <strong>{url}</strong>
          </li>
        )}
      </ul>
    </section>
  );
};

export default ChannelParams;
