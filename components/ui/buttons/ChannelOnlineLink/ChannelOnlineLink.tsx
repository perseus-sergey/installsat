import Link from 'next/link';
import styles from './ChannelOnlineLink.module.scss';
import FillingValidImage from '../../../Images/FillingValidImage';
import { META_CHANNEL } from '@/models/channel.model';
import { LANGUAGE } from '@/models/ui.model';

const {
  images: { onlineLinkImg },
} = META_CHANNEL;

interface IChannelOnlineLinkProps {
  children?: React.ReactNode;
  href: string;
}

const ChannelOnlineLink = ({ children, href }: IChannelOnlineLinkProps) => (
  <div className={styles.ChannelOnlineLink} data-testid="ChannelOnlineLink">
    <Link className={styles.link} href={href}>
      <FillingValidImage
        image={onlineLinkImg}
        alternativeImgString={onlineLinkImg.alternativeImgStr}
        alt={onlineLinkImg.alt[LANGUAGE]}
      />
      {children}
    </Link>
  </div>
);

export default ChannelOnlineLink;
