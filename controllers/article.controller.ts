import { cache } from 'react';

import { poolExecute } from '@/libs/db/mysqldb';
import { IArticleModel } from '@/models/articles/article.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { ELanguage } from '@/models/language.model';

const { ARTICLE: TBL_ARTICLE, ARTICLE_CATEGORIES } = EDBTableTitles;

export const getArticle = cache(
  async (slug: string, lang: ELanguage): Promise<IArticleModel | null> => {
    const sql = `
  SELECT
  U.id,
  ${lang === ELanguage.UA ? 'U.title' : 'U.title_en'} AS title,
  ${lang === ELanguage.UA ? 'U.description' : 'U.description_en'} AS description,
  ${lang === ELanguage.UA ? 'U.keywords' : 'U.keywords_en'} AS keywords,
  ${lang === ELanguage.UA ? 'U.text' : 'U.text_en'} AS text,
  U.cpu AS slug,
  U.date,
  U.author,
  U.cat AS cat_id,
  U.view,
  U.logo,
  ${lang === ELanguage.UA ? 'C.title' : 'C.title_en'} AS cat_name,
  C.cpu AS cat_slug,
  C.folder AS cat_folder
FROM
  ${TBL_ARTICLE} U
LEFT JOIN
  ${ARTICLE_CATEGORIES} C ON U.cat = C.id
WHERE U.cpu = ?
LIMIT 1
`;
    const res = await poolExecute<IArticleModel[]>(sql, [slug]);

    return res instanceof Error || res.length === 0 ? null : res[0];
  }
);
