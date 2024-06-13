import { EDBTableTitles } from './commons.mjs';
import { executePoolQuery } from './mysqldb.mjs';

const { TV_SCHEDULE_VSE_TV } = EDBTableTitles;

export const getDBVseTvChannels = async () => {
  //AND `vsetv` IN (176,328,30,772)

  const sql = `
  SELECT MAX(id) AS id, vsetv, MAX(title) AS title, MAX(cpu) AS cpu
  FROM tbl_channals
  WHERE vsetv IS NOT NULL
  AND vsetv != 0 
  GROUP BY vsetv
`;
  const res = await executePoolQuery(sql);

  if (res instanceof Error)
    throw new Error(`Error of get channel IDs from DB: ${res.message}`);

  return res;
};

export const insertDBVseTvChannels = async (values) => {
  const insertedStr = values.join(',');

  const sql = `
  INSERT INTO ${TV_SCHEDULE_VSE_TV}
  (start,end,chan_id,title)
  VALUES
  ${insertedStr}
`;
  const res = await executePoolQuery(sql);

  return res instanceof Error
    ? `Error of insert channel schedule to DB: ${res.message}`
    : null;
  // return res instanceof Error
  //   ? `Error of insert channel schedule to DB: ${res.message}`
  //   : `DB SUCCESS! Inserted rows: ${res.affectedRows}`;
};

export const truncateDBVseTv = async () => {
  const res = await executePoolQuery(`TRUNCATE TABLE ${TV_SCHEDULE_VSE_TV}`);
  if (res instanceof Error)
    throw new Error(
      `Error of truncate table ${TV_SCHEDULE_VSE_TV} in DB: ${res.message}`
    );

  return res;
};

export const deleteDBVseTvChannel = async (channelID, channelTitle) => {
  const res = await executePoolQuery(
    `DELETE FROM ${TV_SCHEDULE_VSE_TV} WHERE chan_id = ?`,
    [channelID]
  );
  if (res instanceof Error)
    throw new Error(
      `Error of delete schedule for channel ${channelTitle}(${channelID}) from DB: ${res.message}`
    );

  return res;
};
