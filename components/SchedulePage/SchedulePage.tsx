import { SCHEDULE_META } from '@/models/scheduleTV.model';
import ScheduleItem from '../ScheduleItem/ScheduleItem';
import './SchedulePage.scss';
import { DateTime } from 'luxon';
import { Fragment } from 'react';
import EmptyData from '../errors/EmptyData/EmptyData';
import { TitleH2 } from '../ui/Titles/TitleH2';
import { getDayOfMonthStr } from '@/libs/utils/dates';
import {
  DEFAULT_TIME_ZONE,
  EDBTableTitles,
  ELanguage,
} from '@/models/ui.model';
import { getChanOneDaySchedule } from '@/controllers/schedule.controller';

const {
  h2TitleForDate,
  tabsSource: { tabCaptionStart, ariaLabel },
  errorMessage: { scheduleNotAvailableForDate },
} = SCHEDULE_META;

interface ISchedulePageProps {
  urlDate: string;
  channelTitle: string;
  lang: ELanguage;
  filteredSchedules: {
    tblName: EDBTableTitles;
    scheduleId: number;
  }[];
  url_date: string;
}

const SchedulePage = async ({
  urlDate,
  channelTitle,
  lang,
  filteredSchedules,
  url_date,
}: ISchedulePageProps) => {
  const now = DateTime.local().setZone(DEFAULT_TIME_ZONE);
  const dayStr = getDayOfMonthStr(urlDate, lang);

  const scheduleList = await getChanOneDaySchedule(filteredSchedules, url_date);

  const availableSchedulesLength = !scheduleList
    ? 0
    : scheduleList?.filter((scheduleList) => scheduleList.length).length;

  return scheduleList && availableSchedulesLength > 0 ? (
    <div className={'flex flex-wrap flex-col items-center'}>
      <TitleH2>{h2TitleForDate(channelTitle, dayStr)[lang]}</TitleH2>

      {scheduleList.map((tbl, index) => {
        const i = index + 1;

        return (
          tbl.length > 0 && (
            <ul
              id={`content-${i}`}
              className={`max-w-[95%] list-none ${availableSchedulesLength > 1 ? 'hidden' : ''}`}
            >
              {tbl.map((item) => (
                <li key={item.id}>
                  <ScheduleItem schedule={item} addHour={0} now={now} />
                </li>
              ))}
            </ul>
          )
        );
      })}

      {availableSchedulesLength > 1 && (
        <nav className="tab-nav flex order-[-1] mb-4 gap-8">
          {scheduleList.map((tbl, index) => {
            const i = index + 1;

            return (
              tbl.length > 0 && (
                <Fragment key={index}>
                  <input
                    className="tabInput"
                    type="radio"
                    name="tab-btn"
                    id={`tab-${i}`}
                    value=""
                    defaultChecked={!index ? true : false}
                  />
                  <label
                    htmlFor={`tab-${i}`}
                    className="tabLabel"
                    role="button"
                    aria-label={ariaLabel[lang]}
                  >
                    {tabCaptionStart[lang]}
                    {' .'.repeat(i)}
                  </label>
                </Fragment>
              )
            );
          })}
        </nav>
      )}
    </div>
  ) : (
    <EmptyData
      lang={lang}
      description={scheduleNotAvailableForDate(channelTitle, dayStr)[lang]}
    />
  );
};

export default SchedulePage;
