import { executeQuery } from '@/libs/db/mysqldb';
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
