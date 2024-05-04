import { IChannel, META_CHANNEL } from '@/models/channel.model';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { LANGUAGE } from '@/models/ui.model';
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
      <TitleH2>{getParamsTitle(title)[LANGUAGE]}</TitleH2>
      <ul>
        {chan_lang && (
          <li>
            {paramsLanguage[LANGUAGE]}
            <strong>{chan_lang}</strong>
          </li>
        )}
        {compression && (
          <li>
            {paramsFormat[LANGUAGE]}
            <strong>{compression}</strong>
          </li>
        )}
        {sat_title && (
          <li>
            {paramsSatellite[LANGUAGE]}
            <Link href={`/${EUrlBaseParam.SAT_COVERAGE_MAP}/${sat_slug}`}>
              <strong>{sat_title}</strong>
            </Link>
          </li>
        )}
        {freq && (
          <li>
            {paramsFrequency[LANGUAGE]}
            <strong>
              {freq} {polar} {sr}
            </strong>
          </li>
        )}
        {fec && (
          <li>
            {paramsFEC[LANGUAGE]}
            <strong>{fec}</strong>
          </li>
        )}
        {encryption && (
          <li>
            {bissLink ? (
              <>
                {paramsEncryption[LANGUAGE]}
                <Link href={bissLink}>
                  <strong>{encryption}</strong>
                </Link>
              </>
            ) : (
              <>
                {paramsEncryption[LANGUAGE]}
                <strong>{encryption}</strong>
              </>
            )}
          </li>
        )}
        {url && (
          <li>
            {getParamsSite(title)[LANGUAGE]} - <strong>{url}</strong>
          </li>
        )}
      </ul>
    </section>
  );
};

export default ChannelParams;
