import { poolExecute } from '@/libs/db/mysqldb';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { EDBTableTitles, TSearchParams } from '@/models/ui.model';
import { EUrlSearchParam } from '@/models/url.model';
import { ResultSetHeader } from 'mysql2';

// ****************************************************************
// For adding sat_grade and sat_slug to sat_digest tables
// ****************************************************************

const { FLY_SATELLITES } = EDBTableTitles;

const messages: string[] = [];

const addMessage = (message: string, error?: Error) => {
  messages.push(`${message}${error ? `: ${error.message}` : ''}`);
  console.log(`🚀 ~ ${message}${error ? ` ERROR: ${error}` : ''}`);
};

interface ISat {
  title: string;
  grade: string;
  slug: string;
}

const updateData = async (sat: ISat, tblName: string) => {
  if (!sat) return [new Error('Error: Received empty sat for update')];

  const sql = `
      UPDATE ${tblName}
      SET sat_slug = ?, sat_grade = ?
      WHERE sat_name = ?
    `;

  const res = await poolExecute<ResultSetHeader>(sql, [
    sat.slug,
    sat.grade,
    sat.title,
  ]);
  if (res instanceof Error)
    addMessage(`ERROR: DB UPDATE news for sat: ${sat.title}`);

  res instanceof Error
    ? addMessage(`ERROR: DB UPDATE news for sat: "${sat.title}"`, res)
    : addMessage(
        `--== SUCCESS: DB UPDATE ${res.affectedRows} channels for sat: "${sat.title}" ==--`
      );
};

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const searchQuery = validSearchParam(EUrlSearchParam.INTERVAL, searchParams);
  const year = parseInt(searchQuery, 10) || 0;
  let tblName = 'tbl_digest';
  if (year) tblName += `_${year}`;

  const flySatSql = `SELECT title, grade, slug FROM ${FLY_SATELLITES}`;

  const satData = await poolExecute<ISat[]>(flySatSql);
  if (satData instanceof Error) return JSON.stringify(satData);

  for (const sat of satData) {
    await updateData(sat, tblName);
  }

  return (
    <>
      <h2 className="font-bold text-blue-700 text-xl">Messages:</h2>
      <ul>
        {messages.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    </>
  );
}
