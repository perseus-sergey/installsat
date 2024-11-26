import mysql, { ConnectionOptions } from 'mysql2/promise';

const access: ConnectionOptions = {
  host: process.env.DB_HOST_REMOTE,
  user: process.env.DB_USER_REMOTE,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS_REMOTE,
  port: 3306,
};

let pool: mysql.Pool;

const getPool = (): mysql.Pool => {
  if (!pool) {
    pool = mysql.createPool({
      ...access,
      waitForConnections: true,
      connectionLimit: 20,
      queueLimit: 0,
      multipleStatements: true,
    });
  }

  return pool;
};

export const poolExecuteRemote = async <T>(
  sql: string,
  values: (string | number | boolean | null)[] = [],
  isQuery: boolean = false
): Promise<T | Error> => {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const [rows] = isQuery
      ? await connection.query(sql, values)
      : await connection.execute(sql, values);

    return rows as T;
  } catch (err) {
    console.error('MySQL query error:', err);

    return err as Error;
  } finally {
    connection.release();
  }
};
