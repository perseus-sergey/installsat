import mysql, { ConnectionOptions, ResultSetHeader } from 'mysql2/promise';

// const port = process.env.DB_PORT ? +process.env.DB_PORT : 0;

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

export const pool = mysql.createPool({
  ...access,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // multipleStatements: true,
});

export const executePoolQuery = async <T>(
  sql: string,
  values: string[] = []
): Promise<T[] | Error | ResultSetHeader> => {
  try {
    const [rows] = await pool.execute(sql, values);

    return rows as T[] | ResultSetHeader;
  } catch (err) {
    console.log(err);

    return err as Error;
  }
};
