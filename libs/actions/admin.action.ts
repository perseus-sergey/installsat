'use server';

import {
  deleteItemFromDbTable,
  editArticleDB,
  editChannelDB,
  getDbRelativeChannelCats,
  getDbRelativeFrequencies,
} from '@/controllers/admin.controller';
import {
  IFormState,
  fromErrorToFormState,
  toFormState,
} from '@/controllers/toast.controller';
import { EArticleEditFields, editArticleSchema } from '@/models/articles.model';
import { EChannelEditFields, editChannelSchema } from '@/models/channel.model';
import { EDBTableTitles } from '@/models/ui.model';
import { ResultSetHeader } from 'mysql2';
import { revalidatePath } from 'next/cache';
// import { redirect } from 'next/navigation';
// import { z } from 'zod';

// export const deleteArticleAction = async (
//   itemID: string,
//   revalidateUrl: string
// ) => {
//   const delCommentResult = await deleteArticle(itemID);

//   if (delCommentResult instanceof Error)
//     return fromErrorToFormState(delCommentResult.message);

//   revalidatePath(revalidateUrl);

//   return toFormState('SUCCESS', 'Article deleted successfully');
// };

export const getRelativeCatsAction = async (parentID: string | number) =>
  await getDbRelativeChannelCats(parentID);

export const getRelativeFrequenciesAction = async (satId: string | number) =>
  await getDbRelativeFrequencies(satId);

export const deleteItemAction = async (
  itemID: string,
  dbTableName: EDBTableTitles,
  revalidateUrl: string
) => {
  const delCommentResult = await deleteItemFromDbTable(dbTableName, itemID);

  if (delCommentResult instanceof Error)
    return fromErrorToFormState(delCommentResult.message);

  revalidatePath(revalidateUrl);

  return toFormState('SUCCESS', 'Item successfully removed from database');
};

export const editArticleAction = async (
  articleID: string,
  articleText: string,
  articleTextEn: string,
  revalidateUrl: string,
  _formState: IFormState,
  formData: FormData
): Promise<IFormState> => {
  const {
    logo,
    title,
    cpu,
    description,
    author,
    date,
    cat,
    folder,
    title_en,
    description_en,
    keywords,
    keywords_en,
  } = EArticleEditFields;

  let res: Error | ResultSetHeader | string = '';

  try {
    const validFormData = editArticleSchema.parse({
      logo: formData.get(logo),
      title: formData.get(title),
      cpu: formData.get(cpu),
      description: formData.get(description),
      text: articleText,
      text_en: articleTextEn,
      author: formData.get(author),
      date: formData.get(date),
      cat: formData.get(cat),
      folder: formData.get(folder),
      title_en: formData.get(title_en),
      description_en: formData.get(description_en),
      keywords: formData.get(keywords),
      keywords_en: formData.get(keywords_en),
    });
    res = await editArticleDB(articleID, validFormData);
    if (res instanceof Error) throw new Error(res.message);
  } catch (error) {
    return fromErrorToFormState(error);
  }

  revalidatePath(revalidateUrl);

  return toFormState(
    'SUCCESS',
    `Article updated successfully. Affected Rows: ${res.affectedRows}`
  );
  // redirect(revalidateUrl);
};

export const editChannelAction = async (
  channelID: string,
  channelText: string,
  catId: string,
  satBeamFreq: string,
  revalidateUrl: string[],
  _formState: IFormState,
  formData: FormData
): Promise<IFormState> => {
  const {
    title,
    text,
    logo,
    chan_slug,
    description,
    canonical,
    sat_id,
    cat_id,
    frequency_id,
    beam_id,
    genre_id,
    lang_id,
    compress_id,
    country_id,
    url,
    biss,
    ip_deny,
    no_googlads,
    encryption_id,
    vsetv,
    vipiko,
    potok,
    pars_uppod,
    pattern,
    tvforsite_net,
    other_stream,
    mark,
  } = EChannelEditFields;
  const [sat, beam, frequency] = satBeamFreq.split('|');
  // console.log('🚀 ~ formData:', formData);
  let res: Error | ResultSetHeader | string = '0';

  try {
    const validFormData = editChannelSchema.parse({
      [text]: channelText,
      [logo]: formData.get(logo),
      [title]: formData.get(title),
      [chan_slug]: formData.get(chan_slug),
      [description]: formData.get(description),
      [cat_id]: catId,
      [canonical]: formData.get(canonical),
      [sat_id]: +sat,
      [frequency_id]: +frequency,
      [beam_id]: +beam,
      [genre_id]: formData.get(genre_id),
      [lang_id]: formData.get(lang_id),
      [compress_id]: formData.get(compress_id),
      [country_id]: formData.get(country_id),
      [url]: formData.get(url),
      [biss]: formData.get(biss),
      [ip_deny]: formData.get(ip_deny),
      [no_googlads]: formData.get(no_googlads),
      [encryption_id]: formData.get(encryption_id),
      [vsetv]: formData.get(vsetv),
      [vipiko]: formData.get(vipiko),
      [potok]: formData.get(potok),
      [pars_uppod]: formData.get(pars_uppod),
      [pattern]: formData.get(pattern),
      [tvforsite_net]: formData.get(tvforsite_net),
      [other_stream]: formData.get(other_stream),
      [mark]: formData.get(mark),
    });
    res = await editChannelDB(channelID, validFormData);
    if (res instanceof Error) throw new Error(res.message);
  } catch (error) {
    return fromErrorToFormState(error);
  }

  revalidateUrl.forEach((url) => revalidatePath(url));
  // redirect(revalidateUrl);

  return toFormState(
    'SUCCESS',
    `Channel updated successfully. Affected rows: ${res.affectedRows}`
  );
};
