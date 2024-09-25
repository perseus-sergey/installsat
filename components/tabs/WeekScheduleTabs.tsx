import {
  getFormattedDateStrYearFirst,
  getStartOfWeekDate,
} from '@/libs/utils/dates';
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
            className={`rounded-[2px_15px_0_0] max-w-32 w-fit flex items-center py-1 px-4 text-stone-600 cursor-pointer bg-stone-50 border border-solid border-stone-400 hover:border-orange-200 hover:bg-yellow-100 hover:text-orange-600 transition-transform transform hover:translate-y-px
            ${dateString === now ? ` text-white !bg-indigo-900 border-b-rose-500` : ''}`}
          >
            {tabsTitles[lang][i]}, {date.getDate()}
          </SeoLink>
        ) : (
          <span className="flex py-1 px-4 text-indigo-800 font-bold">
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
