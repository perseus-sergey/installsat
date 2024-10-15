import mysql, { ConnectionOptions } from 'mysql2/promise';

export const access: ConnectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? +process.env.DB_PORT : undefined,
  password: process.env.DB_PASS,
};

let pool: mysql.Pool;

export const getPool = (): mysql.Pool => {
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

export const poolExecute = async <T>(
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
