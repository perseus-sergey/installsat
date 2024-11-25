import { poolExecute } from '@/libs/db/mysqldb';
import { IDbIdAmountModel } from '@/models/admin.model';
import { IScheduleTVModel, IVseTvParsModel } from '@/models/scheduleTV.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { cache } from 'react';

const { TV_SCHEDULE_VSE_TV, CHANNELS } = EDBTableTitles;

export const getDBChannelScheduleShort = async (
  dbTableName: EDBTableTitles,
  chanelId: number,
  hourInterval: number,
  rowsLimit: number
): Promise<IScheduleTVModel[] | null> => {
  const sql = `
    SELECT *
    FROM ${dbTableName}
    WHERE chan_id = ?
    AND start >= NOW() - INTERVAL ? HOUR AND end <= NOW() + INTERVAL 20 HOUR
    ORDER BY start
    LIMIT ?
`;

  const res = await poolExecute<IScheduleTVModel[]>(sql, [
    chanelId,
    `${hourInterval}`,
    `${rowsLimit}`,
  ]);

  return res instanceof Error || !res.length ? null : res;
};

export const getChanOneDaySchedule = cache(
  async (
    scheduleTables: { tblName: EDBTableTitles; scheduleId: number }[],
    dateStr: string
  ): Promise<IScheduleTVModel[][] | null> => {
    if (!scheduleTables.length) return null;

    const sql = scheduleTables
      .map(
        ({ tblName, scheduleId }) =>
          `
      SELECT *
      FROM ${tblName}
      WHERE chan_id = ${scheduleId}
      AND start < DATE_ADD('${dateStr}', INTERVAL 30 HOUR)
      AND start > DATE_SUB('${dateStr}', INTERVAL 2 HOUR)     
      ORDER BY start;
      `
      )
      .join(' ');
    const res = await poolExecute<[IScheduleTVModel[]]>(sql, [null], true);

    return res instanceof Error || !Array.isArray(res) || !res.length
      ? null
      : res;
  }
);

export const getDBVseTvChannels = async (IDs?: string[]) => {
  //AND `vsetv` IN (176,328,30,772)
  const channels = IDs && IDs.length ? `AND vsetv IN (${IDs.join(',')})` : '';

  const sql = `
  SELECT MAX(id) AS id, vsetv, MAX(title) AS title, MAX(cpu) AS cpu
  FROM ${CHANNELS}
  WHERE vsetv IS NOT NULL
  AND vsetv != 0 
  ${channels}
  GROUP BY vsetv
`;
  const res = await poolExecute<IVseTvParsModel[]>(sql);

  if (res instanceof Error)
    throw new Error(`Error of get channel IDs from DB: ${res.message}`);

  return res;
};

export const insertDBVseTvChannels = async (values: string[]) => {
  const insertedStr = values.join(',');

  const sql = `
  INSERT INTO ${TV_SCHEDULE_VSE_TV}
  (start,end,chan_id,title)
  VALUES
  ${insertedStr}
`;
  const res = await poolExecute(sql);
  if (res instanceof Error) throw new Error(res.message);

  return res;
};

export const truncateDBVseTv = async () => {
  const res = await poolExecute(`TRUNCATE TABLE ${TV_SCHEDULE_VSE_TV}`);
  if (res instanceof Error)
    throw new Error(
      `Error of truncate table ${TV_SCHEDULE_VSE_TV} in DB: ${res.message}`
    );

  return res;
};

export const deleteDBVseTvChannel = async (
  channelID: string,
  channelTitle: string
) => {
  const res = await poolExecute(
    `DELETE FROM ${TV_SCHEDULE_VSE_TV} WHERE chan_id = ?`,
    [channelID]
  );
  if (res instanceof Error)
    throw new Error(
      `Error of delete schedule for channel ${channelTitle}(${channelID}) from DB: ${res.message}`
    );

  return res;
};

export const getDbIdAmount = async (
  tblName: EDBTableTitles = TV_SCHEDULE_VSE_TV
) => {
  const res = await poolExecute<IDbIdAmountModel[]>(
    `SELECT COUNT( id ) AS count FROM ${tblName}`
  );

  return res instanceof Error
    ? `Error of count id in DB table${tblName}: ${res.message}`
    : res;
};
