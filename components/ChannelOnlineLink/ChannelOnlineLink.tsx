import Link from 'next/link';
import styles from './ChannelOnlineLink.module.scss';
import FillingValidImage from '../Images/FillingValidImage';
import { META_CHANNEL } from '@/models/channel.model';

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
        alt={onlineLinkImg.alt.ua}
      />
      {children}
    </Link>
  </div>
);

export default ChannelOnlineLink;

//       {/* if ($this->arrDbQuary[0]["tvforsite_net"]) {
// 	return "
// 		<p style='text-align:center;'>
// 			<a target='_blank' id='flash' class = 'thhead' href='".SITE_ROOT."/tv-online/{$this->arrDbQuary[0]["cpu"]}/'>
// 			<img style='padding-right:5px;bottom:-9px;position:relative;' width='32' height='32' src='/Images/  ' alt='Онлайн ТВ' />
// 			Канал \"{$this->title}\" онлайн
// 			</a>
// 		</p>
// 	";
// } */}
