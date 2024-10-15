import { poolExecute } from '@/libs/db/mysqldb';
import { IArticleModel } from '@/models/articles/article.model';
import {
  IGroupedSatelliteOption,
  ISatelliteOption,
} from '@/models/tblSat.model';
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

export const makeSelectedOptions = (
  satGradeList: string[],
  groupedSats: Error | IGroupedSatelliteOption[]
): ISatelliteOption[] => {
  if (groupedSats instanceof Error || !groupedSats.length) return [];

  const flatArray = groupedSats.reduce(
    (acc: ISatelliteOption[], curr) => [...acc, ...curr.options],
    []
  );

  return satGradeList.map((satGrade) => {
    const satOption = flatArray.find((option) => option.value === satGrade);

    return satOption
      ? {
          value: satOption.value,
          label: satOption.label,
        }
      : {
          value: satGrade,
          label: satGrade,
        };
  });
};

export const makeOptions = (
  urlParamList: string[],
  itemList: Error | IGroupedSatelliteOption[]
): ISatelliteOption[] => {
  if (itemList instanceof Error || !itemList.length) return [];

  const flatArray = itemList.reduce(
    (acc: ISatelliteOption[], curr) => [...acc, ...curr.options],
    []
  );
  const options = urlParamList.map((urlParam) => {
    const opt = flatArray.find((option) => option.value === urlParam);

    return opt
      ? {
          value: opt.value,
          label: opt.label,
        }
      : {
          value: urlParam,
          label: urlParam,
        };
  });

  return options;
};

export const makeSimpleOptions = (
  urlParamList: string[],
  itemList: Error | ISatelliteOption[]
): ISatelliteOption[] => {
  if (itemList instanceof Error || !itemList.length) return [];

  const options = urlParamList.map((urlParam) => {
    const opt = itemList.find((option) => option.value === urlParam);

    return opt
      ? {
          value: opt.value,
          label: opt.label,
        }
      : {
          value: urlParam,
          label: urlParam,
        };
  });

  return options;
};
