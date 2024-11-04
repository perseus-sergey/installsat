import { executePoolQuery } from './mysqldb.mjs';

export const getDbIdAmount = async (tblName) => {
  const res = await executePoolQuery(
    `SELECT COUNT( id ) AS count FROM ${tblName}`
  );

  return res instanceof Error
    ? `Error of count id in DB table${tblName}: ${res.message}`
    : res;
};
