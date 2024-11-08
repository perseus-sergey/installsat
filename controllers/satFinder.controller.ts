import { cache } from 'react';

import { poolExecute } from '@/libs/db/mysqldb';
import { IArticleModel } from '@/models/articles/article.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { ELanguage, langSuffixUaEmpty } from '@/models/language.model';

const { ARTICLE: TBL_ARTICLE } = EDBTableTitles;

export const getSatFinderArticle = cache(async (lang: ELanguage) => {
  const sql = `
  SELECT 
    id,
    COALESCE(title${langSuffixUaEmpty[lang]}, title_en) AS title,
    COALESCE(description${langSuffixUaEmpty[lang]}, description_en) AS description,
    COALESCE(keywords${langSuffixUaEmpty[lang]}, keywords_en) AS keywords,
    COALESCE(text${langSuffixUaEmpty[lang]}, text_en) AS text,
    cpu,
    view,
    logo 
  FROM ${TBL_ARTICLE} WHERE cpu = ?`;

  const res = await poolExecute<IArticleModel[]>(sql, [
    'napravlenie-antenny-po-karte',
  ]);

  return res instanceof Error
    ? {
        title: '',
        description: '',
        keywords: '',
        text: '',
        view: 0,
      }
    : res[0];
});
