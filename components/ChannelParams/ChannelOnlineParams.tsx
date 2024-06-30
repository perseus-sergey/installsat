import { IChannel, META_CHANNEL } from '@/models/channel.model';
import { TitleH2 } from '../ui/Titles/TitleH2';
import { ELanguage } from '@/models/ui.model';

interface IChannelParamsProps {
  channelDBParams: IChannel;
  lang: ELanguage;
}

const { getParamsTitle, paramsLanguage, getParamsSite } =
  META_CHANNEL.chanParamsBlock;

const ChannelOnlineParams = ({
  channelDBParams: { title, url, chan_lang },
  lang,
}: IChannelParamsProps) => {
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
        {url && (
          <li>
            {getParamsSite(title)[lang]} - <strong>{url}</strong>
          </li>
        )}
      </ul>
    </section>
  );
};

export default ChannelOnlineParams;
