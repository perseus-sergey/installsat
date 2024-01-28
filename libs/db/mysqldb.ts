import mysql from 'mysql2/promise';

export const executeQuery = async <T>(
  query: string,
  data: string[]
): Promise<T[]> => {
  // try {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: 8889,
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
