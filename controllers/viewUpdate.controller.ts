import { poolExecute } from '@/libs/db/mysqldb';

export const updateViewCount = async (
  dbTableTitle: string,
  articleId: string,
  oldViewNumber: number
) =>
  await poolExecute(`UPDATE ${dbTableTitle} SET view = ? WHERE id = ?`, [
    `${oldViewNumber + 1}`,
    articleId,
  ]);
