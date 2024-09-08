import {
  getFormattedDateStrYearFirst,
  getStartOfWeekDate,
} from '@/libs/utils/dates';
import styles from './OnlinePlayerTabs.module.scss';
import { createArray } from '@/libs/utils/utils';
import { SCHEDULE_META } from '@/models/scheduleTV.model';
import { ELanguage } from '@/models/ui.model';
import SeoLink from '../ui/SeoLink/SeoLink';

const { tabsTitles } = SCHEDULE_META.tabsWeek;

const WeekScheduleTabs = ({
  currentDate,
  lang,
  channelName,
}: {
  currentDate: string;
  channelName: string;
  lang: ELanguage;
}) => {
  const now = getFormattedDateStrYearFirst();
  const startDate = getStartOfWeekDate(new Date(currentDate));

  const tabs = createArray(7).reduce((acc, _, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateString = getFormattedDateStrYearFirst(date);

    acc.push(
      <li key={i}>
        {dateString !== currentDate ? (
          <SeoLink
            title={
              lang === ELanguage.UA
                ? `Дивитись розклад передач каналу "${channelName}" за ${date.toLocaleDateString('en-CA')}`
                : `Watch channel schedule for "${channelName}" on ${date.toLocaleDateString('en-CA')}`
            }
            href={dateString}
            className={`${styles.tabButton}${dateString === now ? ` ${styles.currentTab}` : ''}`}
          >
            {tabsTitles[lang][i]}, {date.getDate()}
          </SeoLink>
        ) : (
          <span className={styles.currentDayTab}>
            {tabsTitles[lang][i]}, {date.getDate()}
          </span>
        )}
      </li>
    );

    return acc;
  }, []);

  return (
    <nav className="py-4">
      <ul className="flex gap-1 flex-wrap justify-center">{tabs}</ul>
    </nav>
  );
};

export default WeekScheduleTabs;
