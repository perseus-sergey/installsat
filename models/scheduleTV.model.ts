export interface IScheduleTVModel {
  id: string;
  start: Date;
  end: Date;
  chan_id: string;
  title: string;
  prog_desc?: string;
}

export const SCHEDULE = {
  scheduleShort: {
    descriptionMaxLength: 250,
    defaultHoursBeforeNow: 4,
    defaultRowsLimit: 15,
    exceptGenreIDs: [2, 6, 8, 14], // 'tematika-novosti' 'detskiye' 'tematika-muzikalnyie' 'tematika-fashion'
    exceptHoursBeforeNow: 2,
    exceptRowsLimit: 20,
  },
};
