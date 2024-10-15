import {
  CHANNEL_PARAMS_BLOCK,
  IChannel,
} from '@/models/channels/channel.model';
import { TitleH2 } from '../ui/Titles/TitleH2';
import { ELanguage } from '@/models/language.model';

interface IChannelParamsProps {
  channelDBParams: IChannel;
  lang: ELanguage;
}

const { getParamsTitle, paramsLanguage, getParamsSite } = CHANNEL_PARAMS_BLOCK;

const ChannelOnlineParams = ({
  channelDBParams: { title, url, chan_lang },
  lang,
}: IChannelParamsProps) => {
  return (
    <section>
      <TitleH2>{getParamsTitle(title)[lang]}</TitleH2>
      <ul
        className="p-4 pl-12 font-georgia text-xl"
        style={{ listStyleImage: 'url(/Images/galka_blue.png)' }}
      >
        {chan_lang && (
          <li>
            {paramsLanguage[lang]} - <strong>{chan_lang}</strong>
          </li>
        )}
        {url && (
          <li>
            {getParamsSite(title)[lang]} - <b>{url}</b>
          </li>
        )}
      </ul>
    </section>
  );
};

export default ChannelOnlineParams;
