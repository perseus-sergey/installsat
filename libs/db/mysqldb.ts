import mysql from 'mysql2/promise';

export const executeQuery = async <T>(
  query: string,
  data: string[]
): Promise<T[]> => {
  // try {
  const connection = await mysql.createConnection({
    host: 'localhost',
    // host: process.env.DB_HOST,
    user: 'tvefir',
    // user: process.env.DB_USER,
    database: 'installsat',
    // database: process.env.DB_NAME,
    port: 8889,
    password: 'Fir-2805004557',
  });
  const [result] = await connection.execute(query, data);
  await connection.end();

  return result as T[];
  // } catch (err) {
  //   console.log(err);

  //   return err as Error;
  // }
};
