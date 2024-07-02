import Link from 'next/link';
import styles from './TvScheduleLink.module.scss';
import { META_CHANNEL } from '@/models/channel.model';
import FillingValidImage from '../ui/Images/FillingValidImage';
import { ELanguage } from '@/models/ui.model';

interface ITvScheduleLinkProps {
  title: React.ReactNode;
  href: string;
  lang: ELanguage;
}

const TvScheduleLink = ({ title, href, lang }: ITvScheduleLinkProps) => (
  <div className={styles.TvScheduleLink} data-testid="TvScheduleLink">
    <FillingValidImage
      image={META_CHANNEL.images.scheduleImg}
      alt={META_CHANNEL.images.scheduleImg.alt[lang]}
      alternativeImgString={META_CHANNEL.images.scheduleImg.alternativeImgStr}
    />
    <Link className={styles.linkBtn} href={href}>
      {title}
    </Link>
  </div>
);

export default TvScheduleLink;
