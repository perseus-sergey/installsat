import { executePoolQuery } from './mysqldb.mjs';

export const clearTable = async (tableName) => {
  const res = await executePoolQuery(`TRUNCATE TABLE ${tableName}`);
  if (res instanceof Error)
    throw new Error(`DB TRUNCATE table ${tableName}: ${res.message}`);

  return `SUCCESS: Table ${tableName} cleared`;
};
