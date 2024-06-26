import { IChannel, META_CHANNEL } from '@/models/channel.model';
import { DEFAULT_LANG } from '@/models/ui.model';
import { TitleH2 } from '../ui/Titles/TitleH2';

interface IChannelParamsProps {
  channelDBParams: IChannel;
}

const { getParamsTitle, paramsLanguage, getParamsSite } =
  META_CHANNEL.chanParamsBlock;

const ChannelOnlineParams = ({
  channelDBParams: { title, url, chan_lang },
}: IChannelParamsProps) => {
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
        {url && (
          <li>
            {getParamsSite(title)[DEFAULT_LANG]} - <strong>{url}</strong>
          </li>
        )}
      </ul>
    </section>
  );
};

export default ChannelOnlineParams;
