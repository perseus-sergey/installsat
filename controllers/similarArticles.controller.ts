import { poolExecute } from '@/libs/db/mysqldb';
import { WRONG_CAT_IDS } from '@/models/articles/articleList.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { ELanguage, langSuffixUaEmpty } from '@/models/language.model';

interface ISimilarArticleModel {
  id: number;
  title: string;
  cpu: string;
  date: Date;
}

export const getSimilarArticles = async (
  logo: string,
  id = -1,
  lang: ELanguage
) => {
  const removeId = id > -1 ? `AND id != ${id}` : '';

  const sql = `
    SELECT 
      id, 
      COALESCE(title${langSuffixUaEmpty[lang]}, title_en) AS title,
      cpu,
      date
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
