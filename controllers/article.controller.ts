import { cache } from 'react';

import { poolExecute } from '@/libs/db/mysqldb';
import { IArticleModel } from '@/models/articles/article.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { ELanguage, langSuffixUaEmpty } from '@/models/language.model';

const { ARTICLE: TBL_ARTICLE, ARTICLE_CATEGORIES } = EDBTableTitles;

export const getArticle = cache(
  async (slug: string, lang: ELanguage): Promise<IArticleModel | null> => {
    const sql = `
  SELECT
  U.id,
  COALESCE(U.title${langSuffixUaEmpty[lang]}, U.title_en) AS title,
  COALESCE(U.description${langSuffixUaEmpty[lang]}, U.description_en) AS description,
  COALESCE(U.keywords${langSuffixUaEmpty[lang]}, U.keywords_en) AS keywords,
  COALESCE(U.text${langSuffixUaEmpty[lang]}, U.text_en) AS text,
  U.cpu AS slug,
  U.date,
  U.author,
  U.cat AS cat_id,
  U.view,
  U.logo,
  C.title${langSuffixUaEmpty[lang]} AS cat_name,
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
