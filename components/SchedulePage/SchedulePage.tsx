import { IScheduleTVModel, SCHEDULE_META } from '@/models/scheduleTV.model';
import ScheduleItem from '../ScheduleItem/ScheduleItem';
import './SchedulePage.scss';
import { DateTime } from 'luxon';
import { Fragment } from 'react';
import { LANGUAGE } from '@/models/ui.model';
import EmptyData from '../errors/EmptyData/EmptyData';
import { TitleH2 } from '../ui/Titles/TitleH2';
import { getDayOfMonthStr } from '@/libs/utils/dates';

const {
  h2TitleForDate,
  tabsSource: { tabCaptionStart, ariaLabel },
  errorMessage: { scheduleNotAvailableForDate },
} = SCHEDULE_META;

interface ISchedulePageProps {
  scheduleList: IScheduleTVModel[][] | null;
  urlDate: string;
  channelTitle: string;
}

const SchedulePage = ({
  scheduleList,
  urlDate,
  channelTitle,
}: ISchedulePageProps) => {
  const now = DateTime.local();
  const dayStr = getDayOfMonthStr(urlDate, LANGUAGE);
  const availableSchedulesLength = !scheduleList
    ? 0
    : scheduleList?.filter((scheduleList) => scheduleList.length).length;

  return scheduleList && availableSchedulesLength > 0 ? (
    <div className={'flex flex-wrap flex-col items-center'}>
      <TitleH2>{h2TitleForDate(channelTitle, dayStr)[LANGUAGE]}</TitleH2>

      {scheduleList.map((tbl, index) => {
        const i = index + 1;

        return (
          tbl.length > 0 && (
            <ul
              id={`content-${i}`}
              className={`max-w-[95%] ${availableSchedulesLength > 1 ? 'hidden' : ''}`}
            >
              {tbl.map((item) => (
                <li key={item.id} style={{ listStyle: 'none' }}>
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
                    aria-label={ariaLabel[LANGUAGE]}
                  >
                    {tabCaptionStart[LANGUAGE]}
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
      description={scheduleNotAvailableForDate(channelTitle, dayStr)[LANGUAGE]}
    />
  );
};

export default SchedulePage;
