import mysql from 'mysql2/promise';

import env from '../../dotenv-config-node.mjs';

const access = {
  host: env.DB_HOST_REMOTE,
  user: env.DB_USER_REMOTE,
  database: env.DB_NAME,
  password: env.DB_PASS_REMOTE,
  port: 3306,
};

let pool;

const getPool = () => {
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

export const poolExecuteRemote = async (sql, values = [], isQuery = false) => {
  const pool = getPool();
  const connection = await pool.getConnection();

  try {
    const [rows] = isQuery
      ? await connection.query(sql, values)
      : await connection.execute(sql, values);

    return rows;
  } catch (err) {
    console.error('MySQL query error:', err);

    return err;
  } finally {
    connection.release();
  }
};
