import mysql, { ConnectionOptions } from 'mysql2/promise';

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

// export const pool = mysql.createPool({
//   ...access,
//   waitForConnections: true,
//   connectionLimit: 100,
//   queueLimit: 0,
//   multipleStatements: true,
// });

// export const poolExecute = async <T>(
//   sql: string,
//   values: (string | number | boolean)[] = []
// ): Promise<T | Error> => {
//   try {
//     const [rows] = await pool.execute(sql, values);

//     return rows as T;
//   } catch (err) {
//     console.log(err);

//     return err as Error;
//   }
// };

// export const poolQuery = async <T>(
//   sql: string,
//   values: (string | number | boolean)[] = []
// ): Promise<T | Error> => {
//   try {
//     const [rows] = await pool.query(sql, values);

//     return rows as T;
//   } catch (err) {
//     console.log(err);

//     return err as Error;
//   }
// };

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

// Error: Too many connections
//     at PromisePool.execute (webpack-internal:///(rsc)/./node_modules/mysql2/promise.js:374:22)
//     at poolExecute (webpack-internal:///(rsc)/./libs/db/mysqldb.ts:68:35)
//     at eval (webpack-internal:///(rsc)/./controllers/articles.controller.ts:26:84)
//     at path/to/site/node_modules/next/dist/compiled/next-server/app-page.runtime.dev.js:35:352706
//     at WidgetArticleCategories (webpack-internal:///(rsc)/./components/WidgetArticleCategories/WidgetArticleCategories.tsx:18:123)
//       ...
//       at listOnTimeout (node:internal/timers:573:17)
//       at process.processTimers (node:internal/timers:514:7) {
//     code: 'ER_CON_COUNT_ERROR',
//     errno: 1040,
//     sql: undefined,
//     sqlState: '',
//     sqlMessage: 'Too many connections'
//     ...
