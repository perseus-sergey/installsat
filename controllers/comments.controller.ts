import { ZodError } from 'zod';
import { executeQuery } from '@/libs/db/mysqldb';
import { getFormattedDateStr } from '@/libs/utils';
import { ICommentsModel } from '@/models/articles.model';
import { IFormState } from '@/models/comments.model';

export const getComments = async (tblName: string, postId: number) => {
  const sql = `
  SELECT * FROM ${tblName} WHERE post = ? ORDER BY id DESC
`;

  return await executeQuery<ICommentsModel>(sql, [`${postId}`]);
};

export const insertComment = async (
  dbTableName: string,
  articleId: number,
  author: string,
  email: string,
  text: string,
  ip = '',
  country = ''
) =>
  await executeQuery(
    `INSERT INTO ${dbTableName} (post,author,mail,text,date,ip,country) VALUES (?,?,?,?,?,?,?)`,
    [
      `${articleId}`,
      `${author}`,
      `${email}`,
      `${text}`,
      `${getFormattedDateStr()}`,
      `${ip}`,
      `${country}`,
    ]
  );
export const fromErrorToFormState = (error: unknown): IFormState => {
  if (error instanceof ZodError) {
    return {
      status: 'ERROR' as const,
      message: '',
      fieldErrors: error.flatten().fieldErrors,
      timestamp: Date.now(),
    };
  } else if (error instanceof Error) {
    return {
      status: 'ERROR' as const,
      message: error.message,
      fieldErrors: {},
      timestamp: Date.now(),
    };
  } else {
    return {
      status: 'ERROR' as const,
      message: 'An unknown error occurred',
      fieldErrors: {},
      timestamp: Date.now(),
    };
  }
};

export const toFormState = (
  status: IFormState['status'],
  message: string
): IFormState => {
  return {
    status,
    message,
    fieldErrors: {},
    timestamp: Date.now(),
  };
};
