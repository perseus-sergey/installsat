import { poolExecute } from '@/libs/db/mysqldb';
import { WRONG_CAT_IDS } from '@/models/articles/articleList.model';
import { ISimilarArticleModel } from '@/models/ui/similarArticle.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';

export const getSimilarArticles = async (logo: string, id = -1) => {
  const removeId = id > -1 ? `AND id != ${id}` : '';

  const sql = `
    SELECT id, title, title_en, cpu, date
    FROM ${EDBTableTitles.ARTICLE}
    WHERE logo = ?
    ${removeId}
    AND cat NOT IN ${WRONG_CAT_IDS}
    ORDER BY date DESC, id DESC
    LIMIT 7
`;

  const res = await poolExecute<ISimilarArticleModel[]>(sql, [logo]);

  return res instanceof Error ? [] : res;
};
