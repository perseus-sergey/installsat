import mysql, { ConnectionOptions } from 'mysql2/promise';

export const access: ConnectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? +process.env.DB_PORT : undefined,
  password: process.env.DB_PASS,
};

export const executeQuery = async <T>(
  sql: string,
  values: string[] = []
): Promise<T[] | Error> => {
  try {
    const connection = await mysql.createConnection(access);
    const [result] = await connection.execute(sql, values);
    await connection.end();

    return result as T[];
  } catch (err) {
    console.log(err);
    // throw err;

    return err as Error;
  }
};

export const executeMultipleQuery = async <T>(
  sql: string,
  values: string[] = []
): Promise<T | Error> => {
  try {
    const connection = await mysql.createConnection({
      ...access,
      multipleStatements: true,
    });
    const [result] = await connection.query(sql, values);
    await connection.end();

    return result as T;
  } catch (err) {
    console.log(err);
    // throw err;

    return err as Error;
  }
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
  values: (string | number | boolean)[] = []
): Promise<T | Error> => {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(sql, values);

    return rows as T;
  } catch (err) {
    console.error('MySQL query error:', err);

    return err as Error;
  } finally {
    connection.release();
  }
};

export const poolQuery = async <T>(
  sql: string,
  values: (string | number | boolean)[] = []
): Promise<T | Error> => {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query(sql, values);

    return rows as T;
  } catch (err) {
    console.error('MySQL query error:', err);

    return err as Error;
  } finally {
    connection.release();
  }
};

// export const executePoolQuery = async <P, T>(
//   sql: string,
//   values?: P[]
// ): Promise<T | Error> => {
//   const pool = getPool();
//   const connection = await pool.getConnection();

//   try {
//     const [rows] = await connection.query(sql, values ? [values] : []);

//     return rows as T;
//   } catch (err) {
//     console.error('MySQL query error:', err);
//     throw err;
//   } finally {
//     connection.release();
//   }
// };
