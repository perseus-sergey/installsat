import { ITblDigestParse } from '@/app/[lang]/(admin)/guru/parse/trans-news/page';
import { poolExecute, getPool } from '@/libs/db/mysqldb';
import { EDBTableTitles } from '@/models/ui.model';
import { ResultSetHeader } from 'mysql2';
import { cache } from 'react';

const pool = getPool();

export const getDBSatID = cache(async (satName: string) => {
  const sql = `
    SELECT id
    FROM ${EDBTableTitles.CHANNEL_SAT}
    WHERE description = ?
    LIMIT 1
  `;
  const res = await poolExecute<{ id: string }[]>(sql, [satName]);

  if (res instanceof Error) return `DB Error: ${res.message}`;
  if (res.length === 0)
    return `Error extracting SATELLITE ID from DB. Can't find satellite name «${satName}»`;

  return res[0];
});

export const insertDBTransNews = async (data: ITblDigestParse[]) => {
  const values = data.map((item) => [
    pool.escape(item.date),
    pool.escape(item.update),
    pool.escape(item.channel_title),
    pool.escape(item.action),
    pool.escape(item.text),
    pool.escape(item.sat),
    pool.escape(item.sat_name),
    pool.escape(item.sat_position),
    pool.escape(item.frequency_text),
    pool.escape(item.country),
  ]);

  const sql = `
      INSERT INTO ${EDBTableTitles.TRANS_NEWS} 
      (\`date\`, \`update\`, \`channel_title\`, \`action\`, \`text\`, \`sat\`, \`sat_name\`, \`sat_position\`, \`frequency_text\`, \`country\`)
      VALUES ${values.map((valueSet) => `(${valueSet.join(', ')})`).join(', ')};
    `;
  const res = await poolExecute<ResultSetHeader>(sql);

  if (res instanceof Error) throw new Error(`DB INSERT data: ${res.message}`);

  return `DB SUCCESS! inserted rows: ${res.affectedRows}`;
};

export const deleteDBOldTransNews = async (data: ITblDigestParse[]) => {
  const uniqueDateUpdatePairs = [
    ...new Set(
      data.map(
        (item) => `(${pool.escape(item.date)}, ${pool.escape(item.update)})`
      )
    ),
  ];

  const sql = `
    DELETE FROM ${EDBTableTitles.TRANS_NEWS}
    WHERE (\`date\`, \`update\`) IN (${uniqueDateUpdatePairs.join(', ')});
  `;
  const res = await poolExecute<ResultSetHeader>(sql);

  if (res instanceof Error) throw new Error(`DB DELETE data: ${res.message}`);

  return `DB SUCCESS! deleted rows: ${res.affectedRows}`;
};
