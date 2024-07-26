import mysql from 'mysql2/promise';
import '../../dotenv-config.mjs';

// const port = process.env.DB_PORT ? +process.env.DB_PORT : 0;

export const access = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? +process.env.DB_PORT : undefined,
  password: process.env.DB_PASS,
};

export const executeQuery = async (sql, values = []) => {
  try {
    const connection = await mysql.createConnection(access);
    const [result] = await connection.execute(sql, values);
    await connection.end();

    return result;
  } catch (err) {
    console.log(err);
    // throw err;

    return err;
  }
};

export const executeMultipleQuery = async (sql, values = []) => {
  try {
    const connection = await mysql.createConnection({
      ...access,
      multipleStatements: true,
    });
    const [result] = await connection.query(sql, values);
    await connection.end();

    return result;
  } catch (err) {
    console.log(err);
    // throw err;

    return err;
  }
};

let pool;

export const getPool = () => {
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

export const executePoolQuery = async (sql, values = []) => {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.execute(sql, values);

    return rows;
  } catch (err) {
    console.log(err);

    return err;
  } finally {
    connection.release();
  }
};
