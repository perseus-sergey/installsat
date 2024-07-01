import { executePoolQuery, getPool } from './mysqldb.mjs';
import memoize from 'lodash.memoize';

export const getDBSatID = memoize(async (satName) => {
  const sql = `
    SELECT id
    FROM tbl_chan_sat
    WHERE description = ?
    LIMIT 1
  `;
  const res = await executePoolQuery(sql, [satName]);

  if (res instanceof Error) return `DB Error: ${res.message}`;
  if (res.length === 0)
    return `Error extracting SATELLITE ID from DB. Can't find satellite name «${satName}»`;

  return res[0];
});

export const insertDBTransNews = async (data) => {
  const pool = getPool();

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
      INSERT INTO tbl_digest 
      (\`date\`, \`update\`, \`channel_title\`, \`action\`, \`text\`, \`sat\`, \`sat_name\`, \`sat_position\`, \`frequency_text\`, \`country\`)
      VALUES ${values.map((valueSet) => `(${valueSet.join(', ')})`).join(', ')};
    `;
  const res = await executePoolQuery(sql);

  if (res instanceof Error) throw new Error(`DB INSERT data: ${res.message}`);

  return `DB SUCCESS! inserted rows: ${res.affectedRows}`;
};

export const deleteDBOldTransNews = async (data) => {
  const pool = getPool();

  const uniqueDateUpdatePairs = [
    ...new Set(
      data.map(
        (item) => `(${pool.escape(item.date)}, ${pool.escape(item.update)})`
      )
    ),
  ];

  const sql = `
    DELETE FROM tbl_digest
    WHERE (\`date\`, \`update\`) IN (${uniqueDateUpdatePairs.join(', ')});
  `;
  const res = await executePoolQuery(sql);

  if (res instanceof Error)
    throw new Error(`DB DELETE data: ${res.message}!!! sql: ${sql}`);

  return `DB SUCCESS! deleted rows: ${res.affectedRows}`;
};

export const getDbIdAmount = async (tblName) => {
  const res = await executePoolQuery(
    `SELECT COUNT( id ) AS count FROM ${tblName}`
  );

  return res instanceof Error
    ? `Error of count id in DB table${tblName}: ${res.message}`
    : res;
};
