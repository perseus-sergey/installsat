import { poolExecute } from '@/libs/db/mysqldb';
import {
  IAllNewsModel,
  WRONG_CAT_IDS,
} from '@/models/articles/articleList.model';
import { ELanguage } from '@/models/language.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { cache } from 'react';

const { ARTICLE: TBL_ARTICLE, ARTICLE_CATEGORIES } = EDBTableTitles;

interface ISingleCatArticlesModel {
  id: number;
  title: string;
  description: string;
  cpu: string;
  text: string;
}

export const getCurrentCatParams = cache(
  async (catCpu: string, lang: ELanguage) => {
    const { UA } = ELanguage;

    const sql = `
    SELECT id,
      ${lang === UA ? 'title' : 'title_en'} AS title,
      ${lang === UA ? 'description' : 'description_en'} AS description,
      ${lang === UA ? 'text' : 'text_en'} AS text,
      cpu
     FROM ${ARTICLE_CATEGORIES} 
     WHERE cpu = ?
     LIMIT 1
     `;

    const res = await poolExecute<ISingleCatArticlesModel[]>(sql, [catCpu]);

    return res instanceof Error ? null : res[0];
  }
);

interface IChankOfNews {
  quantity: number;
  start?: number;
  catId?: number;
  searchQuery?: string;
  lang: ELanguage;
}

export const getChunkOfNews = async ({
  quantity,
  start = 0,
  catId,
  searchQuery,
  lang,
}: IChankOfNews) => {
  const catValue = catId ? `=${catId}` : `NOT IN ${WRONG_CAT_IDS}`;

  const getSearchText = (alias = 'U.') => {
    const uaStr = `${alias}title LIKE "%${searchQuery}%" OR ${alias}description LIKE "%${searchQuery}%"`;

    return searchQuery
      ? lang === ELanguage.UA
        ? `AND (${uaStr})`
        : `AND (${alias}title_en LIKE "%${searchQuery}%" OR ${alias}description_en LIKE "%${searchQuery}%" OR ${uaStr})`
      : '';
  };
  // const searchText = searchQuery ? `LIKE "%${searchQuery}%"` : '!= ""';

  const sql = `
  SELECT 
  U.id,
  U.cat,
  U.title,
  U.cpu,
  U.description,
  U.title_en,
  U.description_en,
  U.date,
  U.author,
  U.logo,
  U.view,
  C.comment_count,
  T.total_count,
  C2.title AS category_title,
  C2.title_en AS category_title_en,
  C2.cpu AS category_cpu
FROM ${TBL_ARTICLE} U
LEFT JOIN (SELECT post, COUNT(id) AS comment_count FROM tbl_comments GROUP BY post) C ON U.id = C.post
LEFT JOIN ${ARTICLE_CATEGORIES} C2 ON U.cat = C2.id
CROSS JOIN
  (SELECT COUNT(id) AS total_count FROM ${TBL_ARTICLE} WHERE cat ${catValue} ${getSearchText('')}) T
WHERE 
  U.cat ${catValue}
${getSearchText()}
ORDER BY 
  U.date DESC, U.id DESC
LIMIT ?, ?
`;
  const res = await poolExecute<IAllNewsModel[]>(sql, [
    `${start}`,
    `${quantity}`,
  ]);

  return res instanceof Error ? [] : res;
};
