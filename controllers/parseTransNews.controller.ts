import { executeQuery } from '@/libs/db/mysqldb';
import { EDBTableTitles } from '@/models/ui.model';
import { cache } from 'react';

export const getDBSatID = cache(async (satName: string) => {
  const sql = `
    SELECT id
    FROM ${EDBTableTitles.CHANNEL_SAT}
    WHERE description = ?
    LIMIT 1
  `;
  const res = await executeQuery<{ id: string }>(sql, [satName]);

  return res instanceof Error ? `DB Error: ${res.message}` : res;
});
