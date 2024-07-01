import { EDBTableTitles, ELanguage } from '@/models/ui.model';
import { DateTime } from 'luxon';
import { getDBChannelScheduleShort } from '@/controllers/schedule.controller';
import { IOnlineChannel } from '@/models/channel.model';
import { TitleH2 } from '../ui/Titles/TitleH2';
import { SCHEDULE_META } from '@/models/scheduleTV.model';
import ScheduleItem from '../ScheduleItem/ScheduleItem';

const {
  defaultHoursBeforeNow,
  defaultRowsLimit,
  exceptGenreIDs,
  exceptHoursBeforeNow,
  exceptRowsLimit,
  h2Start,
} = SCHEDULE_META.scheduleShort;

interface IScheduleShortProps {
  channelData: IOnlineChannel;
  lang: ELanguage;
}

const ScheduleShort = async ({
  channelData: { vsetv, vipiko, telegid_id, genre_id, title },
  lang,
}: IScheduleShortProps) => {
  const now = DateTime.local();
  let addHour = 0;

  let timeBefore, limitShed;

  if (exceptGenreIDs.some((id) => id === genre_id)) {
    timeBefore = addHour + exceptHoursBeforeNow;
    limitShed = exceptRowsLimit;
  } else {
    timeBefore = addHour + defaultHoursBeforeNow;
    limitShed = defaultRowsLimit;
  }

  let scheduleList = await getDBChannelScheduleShort(
    EDBTableTitles.TV_SCHEDULE_VIPIKO,
    vipiko,
    timeBefore,
    limitShed
  );

  if (scheduleList instanceof Error || !scheduleList.length) {
    scheduleList = await getDBChannelScheduleShort(
      EDBTableTitles.TV_SCHEDULE_VSE_TV,
      vsetv,
      timeBefore,
      limitShed
    );
    // addHour = 0;
  }

  if (scheduleList instanceof Error || !scheduleList.length) {
    scheduleList = await getDBChannelScheduleShort(
      EDBTableTitles.TV_SCHEDULE,
      telegid_id,
      timeBefore,
      limitShed
    );
  }

  if (scheduleList instanceof Error || !scheduleList.length) return null;

  return (
    <div>
      <>
        <TitleH2>
          {h2Start[lang]} ✧{title}✧
        </TitleH2>
        <div
          style={{
            padding: '20px',
            width: '90%',
            textShadow: '0 0.7px 0 #ffffff',
          }}
        >
          {scheduleList.map((schedule) => (
            <ScheduleItem
              schedule={schedule}
              now={now}
              addHour={addHour}
              key={schedule.id}
            />
          ))}
        </div>
      </>
    </div>
  );
};

export default ScheduleShort;
