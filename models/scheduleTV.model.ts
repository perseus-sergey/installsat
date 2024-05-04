export interface IScheduleTVModel {
  id: string;
  start: Date;
  end: Date;
  chan_id: string;
  title: string;
  prog_desc?: string;
}
