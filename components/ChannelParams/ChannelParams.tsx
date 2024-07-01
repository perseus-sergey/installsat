import { IChannel, META_CHANNEL } from '@/models/channel.model';
import Link from 'next/link';
import { EUrlBaseParam } from '@/models/url.model';
import { ELanguage } from '@/models/ui.model';
import { TitleH2 } from '../ui/Titles/TitleH2';

interface IChannelParamsProps {
  channelDBParams: IChannel;
  lang: ELanguage;
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
  lang,
}: IChannelParamsProps) => {
  const bissLink =
    encryption.toLowerCase() === 'biss'
      ? `/${lang}/${EUrlBaseParam.SAT_CHANNEL_LIST}/${sat_slug}#${chan_slug}`
      : '';

  return (
    <section>
      <TitleH2>{getParamsTitle(title)[lang]}</TitleH2>
      <ul>
        {chan_lang && (
          <li>
            {paramsLanguage[lang]}
            <strong>{chan_lang}</strong>
          </li>
        )}
        {compression && (
          <li>
            {paramsFormat[lang]}
            <strong>{compression}</strong>
          </li>
        )}
        {sat_title && (
          <li>
            {paramsSatellite[lang]}
            <Link
              href={`/${lang}/${EUrlBaseParam.SAT_COVERAGE_MAP}/${sat_slug}`}
            >
              <strong>{sat_title}</strong>
            </Link>
          </li>
        )}
        {freq && (
          <li>
            {paramsFrequency[lang]}
            <strong>
              {freq} {polar} {sr}
            </strong>
          </li>
        )}
        {fec && (
          <li>
            {paramsFEC[lang]}
            <strong>{fec}</strong>
          </li>
        )}
        {encryption && (
          <li>
            {bissLink ? (
              <>
                {paramsEncryption[lang]}
                <Link href={bissLink}>
                  <strong>{encryption}</strong>
                </Link>
              </>
            ) : (
              <>
                {paramsEncryption[lang]}
                <strong>{encryption}</strong>
              </>
            )}
          </li>
        )}
        {url && (
          <li>
            {getParamsSite(title)[lang]} - <strong>{url}</strong>
          </li>
        )}
      </ul>
    </section>
  );
};

export default ChannelParams;
