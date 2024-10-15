import { z } from 'zod';

export enum EArticleEditFields {
  logo = 'logo',
  source = 'source',
  title = 'title',
  cpu = 'cpu',
  description = 'description',
  text = 'text',
  author = 'author',
  date = 'date',
  cat = 'cat',
  folder = 'folder',
  title_en = 'title_en',
  original_slug = 'original_slug',
  description_en = 'description_en',
  keywords = 'keywords',
  keywords_en = 'keywords_en',
  text_en = 'text_en',
}

const optionalOrMinString = (minNum: number) =>
  z
    .string()
    .trim()
    .max(0, `String must contains 0 OR > ${minNum - 1} characters`)
    .or(z.string().trim().min(minNum))
    .optional();

export const editArticleSchema = z.object({
  [EArticleEditFields.logo]: optionalOrMinString(2),
  [EArticleEditFields.source]: optionalOrMinString(2),
  [EArticleEditFields.title]: z.string().min(2).trim(),
  [EArticleEditFields.cpu]: z.string().min(2).trim(),
  [EArticleEditFields.description]: z.string().min(5).trim(),
  [EArticleEditFields.text]: z.string().min(15).trim(),
  [EArticleEditFields.author]: optionalOrMinString(2),
  [EArticleEditFields.date]: z.coerce.date(),
  [EArticleEditFields.cat]: z.coerce.number(),
  [EArticleEditFields.folder]: optionalOrMinString(2),
  [EArticleEditFields.title_en]: optionalOrMinString(2),
  [EArticleEditFields.original_slug]: z.string().trim().optional(),
  [EArticleEditFields.description_en]: optionalOrMinString(5),
  [EArticleEditFields.keywords]: optionalOrMinString(5),
  [EArticleEditFields.keywords_en]: optionalOrMinString(5),
  [EArticleEditFields.text_en]: optionalOrMinString(15),
});
export type TArticleTableModel = z.input<typeof editArticleSchema>;

export interface IArticleCategory {
  id: number;
  title: string;
}
