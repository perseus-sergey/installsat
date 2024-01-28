import mysql from 'mysql2/promise';

export const executeQuery = async <T>(
  query: string,
  data: string[]
): Promise<T[]> => {
  const port = process.env.DB_PORT ? +process.env.DB_PORT : 0;
  // try {
  const connection = port
    ? await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        port,
        password: process.env.DB_PASS,
      })
    : await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
      });
  const [result] = await connection.execute(query, data);
  await connection.end();

  return result as T[];
  // } catch (err) {
  //   console.log(err);

  //   return err as Error;
  // }
};
