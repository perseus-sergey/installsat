import { IChannel, META_CHANNEL } from '@/models/channel.model';
import { LANGUAGE } from '@/models/ui.model';
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
      <TitleH2>{getParamsTitle(title)[LANGUAGE]}</TitleH2>
      <ul>
        {chan_lang && (
          <li>
            {paramsLanguage[LANGUAGE]}
            <strong>{chan_lang}</strong>
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

export default ChannelOnlineParams;
