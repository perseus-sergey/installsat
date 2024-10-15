import { poolExecute } from '@/libs/db/mysqldb';
import { IArticleModel } from '@/models/articles/article.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { cache } from 'react';
import { ELanguage } from '@/models/language.model';

const { ARTICLE: TBL_ARTICLE } = EDBTableTitles;

export const getSatFinderArticle = cache(async (lang: ELanguage) => {
  const sql = `
  SELECT 
    id,
    ${lang === ELanguage.UA ? 'title' : 'title_en'} AS title,
    ${lang === ELanguage.UA ? 'description' : 'description_en'} AS description,
    ${lang === ELanguage.UA ? 'keywords' : 'keywords_en'} AS keywords,
    ${lang === ELanguage.UA ? 'text' : 'text_en'} AS text,
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
