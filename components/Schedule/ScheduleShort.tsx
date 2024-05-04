import { EDBTableTitles } from '@/models/ui.model';
import styles from './Schedule.module.scss';
import { DateTime } from 'luxon';
import { getDBChannelScheduleShort } from '@/controllers/schedule.controller';
import { cutText } from '@/libs/utils/utils';
import { IOnlineChannel } from '@/models/channel.model';
import { TitleH2 } from '../ui/Titles/TitleH2';

interface IScheduleShortProps {
  channelData: IOnlineChannel;
}

const ScheduleShort = async ({
  channelData: { vsetv, vipiko, telegid_id, genre_id, title },
}: IScheduleShortProps) => {
  const now = DateTime.local();
  // let addHour = 1;
  let addHour = 0;

  let timeBefore, limitShed;
  // 'tematika-novosti' 'detskiye' 'tematika-muzikalnyie' 'tematika-fashion'
  if ([2, 6, 8, 14].some((id) => id === genre_id)) {
    timeBefore = addHour + 2;
    limitShed = 20;
  } else {
    timeBefore = addHour + 4;
    limitShed = 15;
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
    <div className={styles.ScheduleShort} data-testid="ScheduleShort">
      <>
        <TitleH2>Розклад передач каналу ✧{title}✧</TitleH2>
        <div className={styles.ScheduleBlock}>
          {scheduleList.map((shed) => {
            const dateStart = DateTime.fromJSDate(shed.start).minus({
              hours: addHour,
            });
            const dateEnd = DateTime.fromJSDate(shed.end).minus({
              hours: addHour,
            });

            let timeClass = styles.timeFuture;
            let titleClass = styles.titleFuture;

            if (dateStart <= now && dateEnd >= now) {
              timeClass = styles.timeNow;
              titleClass = styles.titleNow;
            } else if (dateStart < now) {
              timeClass = styles.timePast;
              titleClass = styles.titlePast;
            }

            return (
              <>
                <div key={shed.id} className={styles.titleBlock}>
                  <span className={timeClass}>
                    {dateStart.toFormat('HH:mm')}
                  </span>
                  <span className={titleClass}>{shed.title}</span>
                </div>
                {shed.prog_desc && (
                  <p className={`${titleClass} ${styles.tvProgDescription}`}>
                    {cutText(shed.prog_desc, 250)}
                  </p>
                )}
              </>
            );
          })}
        </div>
      </>
    </div>
  );
};

export default ScheduleShort;
