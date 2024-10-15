import { DateTime } from 'luxon';
import { DEFAULT_TIME_ZONE, IScheduleTVModel } from '@/models/scheduleTV.model';

interface IScheduleItemProps {
  schedule: IScheduleTVModel;
  now: DateTime;
  addHour: number;
}

const ScheduleItem = ({ schedule, now, addHour }: IScheduleItemProps) => {
  const dateStart = DateTime.fromJSDate(schedule.start)
    .setZone(DEFAULT_TIME_ZONE)
    .minus({
      hours: addHour,
    });
  const dateEnd = DateTime.fromJSDate(schedule.end)
    .setZone(DEFAULT_TIME_ZONE)
    .minus({
      hours: addHour,
    });

  let timeClass = 'text-indigo-800';
  let titleClass = 'text-slate-950';
  let rowStyle = '';

  if (dateStart <= now && dateEnd >= now) {
    timeClass = 'text-white';
    rowStyle = 'rounded-t-md bg-indigo-800';
    titleClass = 'text-indigo-50';
  } else if (dateStart < now) {
    timeClass = 'text-slate-500';
    titleClass = 'text-stone-600';
  }

  return (
    <>
      <div
        key={schedule.id}
        className={`${rowStyle} py-0.5 flex items-center sm:gap-2 gap-1`}
      >
        <span
          className={`${timeClass} flex-grow-0 flex-shrink-0 font-bold px-1`}
        >
          {dateStart.toFormat('HH:mm')}
        </span>
        <span className={`${titleClass}`}>{schedule.title}</span>
      </div>

      {schedule.prog_desc && (
        <p
          className="h-6 cursor-pointer ml-16 border-l-2 border-l-slate-400 text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis 
        transition-all duration-500 ease-in-out hover:m-0 hover:bg-gray-100 hover:whitespace-normal hover:h-auto"
        >
          <span className="bg-[url('/Images/external-link_12.png')] w-4 h-4 inline-block shrink-0 bg-no-repeat bg-right mr-1" />
          {schedule.prog_desc}
        </p>
      )}
    </>
  );
};

export default ScheduleItem;

// {cutText(schedule.prog_desc, descriptionMaxLength)}
