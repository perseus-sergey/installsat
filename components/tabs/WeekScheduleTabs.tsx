import {
  getFormattedDateStrYearFirst,
  getStartOfWeekDate,
} from '@/libs/utils/dates';
import styles from './OnlinePlayerTabs.module.scss';
import { createArray } from '@/libs/utils/utils';

const WeekScheduleTabs = ({ currentDate }: { currentDate: string }) => {
  const startDate = getStartOfWeekDate(new Date(currentDate));

  const tabs = createArray(7).reduce((acc, _, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateString = getFormattedDateStrYearFirst(date);

    const currentUrlDayClass = dateString === currentDate ? 'cur_day' : '';
    const todayClass =
      dateString === getFormattedDateStrYearFirst() ? 'tvProgCurDay' : '';

    acc.push(
      <li
        key={i}
        className={`${currentUrlDayClass} ${todayClass} ${styles.tabButton}`}
      >
        <a href={dateString}>
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'][i]}, {date.getDate()}
        </a>
      </li>
    );

    return acc;
  }, []);

  return (
    <ul style={{ listStyle: 'none' }} className="flex gap-1 flex-wrap">
      {tabs}
    </ul>
  );
};

export default WeekScheduleTabs;
