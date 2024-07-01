import {
  getFormattedDateStrYearFirst,
  getStartOfWeekDate,
} from '@/libs/utils/dates';
import styles from './OnlinePlayerTabs.module.scss';
import { createArray } from '@/libs/utils/utils';
import { SCHEDULE_META } from '@/models/scheduleTV.model';
import Link from 'next/link';
import { ELanguage } from '@/models/ui.model';

const { tabsTitles } = SCHEDULE_META.tabsWeek;

const WeekScheduleTabs = ({
  currentDate,
  lang,
}: {
  currentDate: string;
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
          <Link
            href={dateString}
            className={`${styles.tabButton}${dateString === now ? ` ${styles.currentTab}` : ''}`}
          >
            {tabsTitles[lang][i]}, {date.getDate()}
          </Link>
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
