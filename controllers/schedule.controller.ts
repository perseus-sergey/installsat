import { executeMultipleQuery, executeQuery } from '@/libs/db/mysqldb';
import { IScheduleTVModel } from '@/models/scheduleTV.model';
import { EDBTableTitles } from '@/models/ui.model';
import { cache } from 'react';

export const getDBChannelScheduleShort = cache(
  async (
    dbTableName: EDBTableTitles,
    chanelId: number,
    hourInterval: number,
    rowsLimit: number
  ) => {
    const sql = `
    SELECT *
    FROM ${dbTableName}
    WHERE chan_id = ?
    AND start >= NOW() - INTERVAL ? HOUR AND end <= NOW() + INTERVAL 20 HOUR
    ORDER BY start
    LIMIT ?
`;

    return await executeQuery<IScheduleTVModel>(sql, [
      `${chanelId}`,
      `${hourInterval}`,
      `${rowsLimit}`,
    ]);
  }
);

export const getChanOneDaySchedule = cache(
  async (
    scheduleTables: { tblName: EDBTableTitles; scheduleId: number }[],
    dateStr: string
  ) => {
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
    const res = await executeMultipleQuery<IScheduleTVModel>(sql);

    return res instanceof Error ? null : res;
  }
);
