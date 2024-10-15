import { SCHEDULE_LINK } from '@/models/channels/channel.model';
import { ELanguage } from '@/models/language.model';
import SeoLink from '../ui/SeoLink/SeoLink';
import scheduleImg from 'public/Images/schedule-icon96.png';
import Image from 'next/image';

interface ITvScheduleLinkProps {
  title: React.ReactNode;
  href: string;
  lang: ELanguage;
  isOnlinePage?: boolean;
}

const {
  scheduleLinkText: { channel, onlineChannel },
  scheduleImgAlt,
} = SCHEDULE_LINK;

const TvScheduleLink = ({
  title,
  href,
  lang,
  isOnlinePage = false,
}: ITvScheduleLinkProps) => (
  <div
    className="flex items-center justify-center gap-2 my-4 mx-auto"
    data-testid="TvScheduleLink"
  >
    <Image
      src={scheduleImg}
      alt={scheduleImgAlt[lang]}
      className="flex-shrink-0"
    />

    <SeoLink
      className="py-2 px-3 font-bold text-white text-center text-xl sm:text-2xl border border-solid border-blue-300 cursor-pointer rounded-md bg-gradient-to-b from-sky-400 to-blue-500 hover:to-blue-600 shadow"
      style={{ textShadow: '0 -1px 1px rgba(0, 0, 0, 0.25)' }}
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
