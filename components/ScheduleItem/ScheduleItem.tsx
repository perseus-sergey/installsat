import { DateTime } from 'luxon';
import styles from './ScheduleItem.module.scss';
import { IScheduleTVModel, SCHEDULE_META } from '@/models/scheduleTV.model';
import { cutText } from '@/libs/utils/utils';
import DangerHtml from '../ui/DangerHtml/DangerHtml';

const { descriptionMaxLength } = SCHEDULE_META.scheduleShort;

interface IScheduleItemProps {
  schedule: IScheduleTVModel;
  now: DateTime;
  addHour: number;
}

const ScheduleItem = ({ schedule, now, addHour }: IScheduleItemProps) => {
  const dateStart = DateTime.fromJSDate(schedule.start).minus({
    hours: addHour,
  });
  const dateEnd = DateTime.fromJSDate(schedule.end).minus({
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
      <div key={schedule.id} className={styles.titleBlock}>
        <span className={timeClass}>{dateStart.toFormat('HH:mm')}</span>
        <DangerHtml
          className={titleClass}
          text={schedule.title}
          wrapperTagName="span"
        />
      </div>
      {schedule.prog_desc && (
        <p className={`${titleClass} ${styles.tvProgDescription}`}>
          {cutText(schedule.prog_desc, descriptionMaxLength)}
        </p>
      )}
    </>
  );
};

export default ScheduleItem;
