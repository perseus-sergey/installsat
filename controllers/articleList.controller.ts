import { poolExecute } from '@/libs/db/mysqldb';
import {
  IAllNewsModel,
  ISingleCatArticlesModel,
  WRONG_CAT_IDS,
} from '@/models/articles/articleList.model';
import { ELanguage } from '@/models/language.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { cache } from 'react';

const { ARTICLE: TBL_ARTICLE, ARTICLE_CATEGORIES } = EDBTableTitles;

export const getArticleCatList = async () => {
  const sql = `SELECT id, title, cpu, description, text, title_en, description_en, text_en FROM ${ARTICLE_CATEGORIES} WHERE id NOT IN ${WRONG_CAT_IDS}`;

  const res = await poolExecute<ISingleCatArticlesModel[]>(sql);

  return res instanceof Error ? [] : res;
};

export const getCurrentCatParams = cache(
  async (catCpu: string): Promise<ISingleCatArticlesModel> => {
    const allCatResponse = await getArticleCatList();
    const catParams =
      allCatResponse instanceof Error
        ? ''
        : allCatResponse.find((cat) => cat.cpu === catCpu);

    return (
      catParams || {
        title: '',
        description: '',
        title_en: '',
        description_en: '',
        id: -1,
        cpu: '',
        text: '',
        text_en: '',
      }
    );
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
