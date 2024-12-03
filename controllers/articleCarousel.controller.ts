'use server';

import { poolExecute } from '@/libs/db/mysqldb';
import { ELanguage, langSuffixUaEmpty } from '@/models/language.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { IArticleCarousel } from '@/models/articles/articleCarousel.model';
import { isFileExists } from '@/libs/utils/imagePathValidate';
import { ARTICLE_CARD_IMAGES } from '@/models/articles/article.model';

interface IChankOfNews {
  quantity: number;
  lang: ELanguage;
}

export const getArticlesForCarousel = async ({
  quantity,
  lang,
}: IChankOfNews) => {
  const sql = `
  SELECT 
  id,
  COALESCE(title${langSuffixUaEmpty[lang]}, title_en) AS title,
  COALESCE(description${langSuffixUaEmpty[lang]}, description_en) AS description,
  cpu,
  date
FROM ${EDBTableTitles.ARTICLE}
ORDER BY 
  date DESC, id DESC
LIMIT ${quantity}
`;
  const res = await poolExecute<IArticleCarousel[]>(sql);

  if (res instanceof Error) return [];

  const existImages = res.filter((article) =>
    isFileExists(
      `${ARTICLE_CARD_IMAGES.articleBigImg.params.path}${article.cpu}.jpg`
    )
  );

  return existImages;
};
