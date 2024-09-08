import styles from './TvScheduleLink.module.scss';
import { META_CHANNEL } from '@/models/channel.model';
import FillingValidImage from '../ui/Images/FillingValidImage';
import { ELanguage } from '@/models/ui.model';
import SeoLink from '../ui/SeoLink/SeoLink';

interface ITvScheduleLinkProps {
  title: React.ReactNode;
  href: string;
  lang: ELanguage;
  isOnlinePage?: boolean;
}

const {
  images: { scheduleImg },
  scheduleLinkText: { channel, onlineChannel },
} = META_CHANNEL;

const TvScheduleLink = ({
  title,
  href,
  lang,
  isOnlinePage = false,
}: ITvScheduleLinkProps) => (
  <div className={styles.TvScheduleLink} data-testid="TvScheduleLink">
    <FillingValidImage
      image={scheduleImg}
      alt={scheduleImg.alt[lang]}
      alternativeImgString={scheduleImg.alternativeImgStr}
    />
    <SeoLink
      className={styles.linkBtn}
      href={href}
      title={
        lang === ELanguage.UA
          ? `Дивитись розклад передач каналу "${title}" на сьогодні`
          : `Watch the program schedule of channel "${title}" for today`
      }
    >
      {`${isOnlinePage ? onlineChannel[lang] : channel[lang]} "${title}"`}
    </SeoLink>
  </div>
);

export default TvScheduleLink;
