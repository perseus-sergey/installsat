import mysql from 'mysql2/promise';
// import { FieldPacket, ResultSetHeader } from 'mysql2';

import { Title } from '@/components/ui/Titles/Title';
import { EDBTableTitles } from '@/models/dbTblNames.model';

export const dynamic = 'force-dynamic';

// =================================================================
// одноразовий скрипт!!!
// берем normalized_name і назву лого з локальноі таблиці
// в віддалену таблицю записуємо назви лого для таких саме полів normalized_name з локальноі таблиці
// =================================================================

const { FLY_CHANNELS } = EDBTableTitles;

// const localDbConfig = {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASS,
// };

const remoteDbConfig = {
  host: process.env.DB_HOST_REMOTE,
  user: process.env.DB_USER_REMOTE,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS_REMOTE,
  port: 3306,
};

// const syncLogos = async () => {
//   const localConnection = await mysql.createConnection(localDbConfig);
//   const remoteConnection = await mysql.createConnection(remoteDbConfig);
//   let count = 0;

//   try {
//     const [rows] = await localConnection.execute(
//       `SELECT normalized_name, logo FROM ${FLY_CHANNELS} WHERE logo IS NOT NULL`
//     );

//     for (const row of rows as { normalized_name: string; logo: string }[]) {
//       try {
//         const [result] = (await remoteConnection.execute(
//           `UPDATE ${FLY_CHANNELS} SET logo = ? WHERE normalized_name = ?`,
//           [row.logo, row.normalized_name]
//         )) as [ResultSetHeader, FieldPacket[]];

//         if (result.affectedRows > 0) count += result.affectedRows;
//       } catch (error) {
//         console.error(
//           `Error updating remote database for ${row.normalized_name}:`,
//           error
//         );
//       }
//     }
//   } catch (error) {
//     console.log('🚀 ~ getLocaleDb ~ error:', error);
//   } finally {
//     localConnection.end();
//     remoteConnection.end();
//   }

//   return count;
// };

const getRemoteDb = async () => {
  const remoteConnection = await mysql.createConnection(remoteDbConfig);

  try {
    const [rows] = await remoteConnection.execute(
      `SELECT normalized_name, logo FROM ${FLY_CHANNELS} WHERE logo IS NULL LIMIT 10`
    );

    return rows as { normalized_name: string; logo: string }[];
  } catch (error) {
    console.log('🚀 ~ getRemoteDb ~ error:', error);
  } finally {
    remoteConnection.end();
  }
};

export default async () => {
  const messages = await getRemoteDb();
  // const messages = await syncLogos();

  return (
    <>
      <Title>Copy locale db logo names to Remote db</Title>
      <pre>{JSON.stringify(messages, null, 2)}</pre>

      {/* <h2 className="font-bold text-blue-700 text-xl">
        Copied: {messages} logos
      </h2> */}
    </>
  );
};
