import styles from './ChannelOnlineLink.module.scss';
import { ONLINE_CHANNEL_LINK } from '@/models/channels/channel.model';
import { ELanguage } from '@/models/language.model';
import SeoLink from '../../SeoLink/SeoLink';
import onlineImg from 'public/Images/network-wireless_32.png';
import Image from 'next/image';

const { imageAlt, getOnlineLinkText } = ONLINE_CHANNEL_LINK;

interface IChannelOnlineLinkProps {
  channelName: string;
  href: string;
  lang: ELanguage;
}

const ChannelOnlineLink = ({
  channelName,
  href,
  lang,
}: IChannelOnlineLinkProps) => (
  <div className="flex justify-center m-1 font-verdana font-bold">
    <SeoLink
      className={`${styles.link} border-2 border-indigo-300 rounded-full py-2 px-3 flex items-center justify-center gap-4`}
      style={{ textShadow: '1px 1px 0 #f9f9f9' }}
      data-testid="ChannelOnlineLink"
      href={href}
      title={
        lang === ELanguage.UA
          ? `Перейти до сторінки з онлайн трансляцією каналу "${channelName}"`
          : `Go to the online broadcasting page of "${channelName}" channel`
      }
    >
      <Image src={onlineImg} alt={imageAlt[lang]} className="flex-shrink-0" />
      {getOnlineLinkText(channelName)[lang]}
    </SeoLink>
  </div>
);

export default ChannelOnlineLink;
