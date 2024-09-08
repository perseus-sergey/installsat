import styles from './ChannelOnlineLink.module.scss';
import FillingValidImage from '../../Images/FillingValidImage';
import { META_CHANNEL } from '@/models/channel.model';
import { ELanguage } from '@/models/ui.model';
import SeoLink from '../../SeoLink/SeoLink';

const {
  images: { onlineLinkImg },
  getOnlineLinkText,
} = META_CHANNEL;

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
  <div className={styles.ChannelOnlineLink} data-testid="ChannelOnlineLink">
    <SeoLink
      className={styles.link}
      href={href}
      title={
        lang === ELanguage.UA
          ? `Перейти до сторінки з онлайн трансляцією каналу "${channelName}"`
          : `Go to the online broadcasting page of "${channelName}" channel`
      }
    >
      <FillingValidImage
        image={onlineLinkImg}
        alternativeImgString={onlineLinkImg.alternativeImgStr}
        alt={onlineLinkImg.alt[lang]}
      />
      {getOnlineLinkText(channelName)[lang]}
    </SeoLink>
  </div>
);

export default ChannelOnlineLink;
