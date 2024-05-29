'use server';

import {
  deleteItemFromDbTable,
  editArticleDB,
  editChannelDB,
} from '@/controllers/admin.controller';
import {
  IFormState,
  fromErrorToFormState,
  toFormState,
} from '@/controllers/toast.controller';
import { EArticleEditFields, editArticleSchema } from '@/models/articles.model';
import { EChannelEditFields, editChannelSchema } from '@/models/channel.model';
import { EDBTableTitles } from '@/models/ui.model';
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
  revalidateUrl: string,
  _formState: IFormState,
  formData: FormData
): Promise<IFormState> => {
  const { logo, title, cpu, description, author, date, cat, folder } =
    EArticleEditFields;

  try {
    const validFormData = editArticleSchema.parse({
      logo: formData.get(logo),
      title: formData.get(title),
      cpu: formData.get(cpu),
      description: formData.get(description),
      text: articleText,
      author: formData.get(author),
      date: formData.get(date),
      cat: formData.get(cat),
      folder: formData.get(folder),
    });
    const res = editArticleDB(articleID, validFormData);
    if (res instanceof Error) throw new Error(res.message);
  } catch (error) {
    return fromErrorToFormState(error);
  }

  revalidatePath(revalidateUrl);

  return toFormState('SUCCESS', 'Article updated successfully');
  // redirect(revalidateUrl);
};

export const editChannelAction = async (
  channelID: string,
  channelText: string,
  catId: number,
  revalidateUrl: string[],
  _formState: IFormState,
  formData: FormData
): Promise<IFormState> => {
  // console.log('🚀 ~ formData:', formData);
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

  try {
    const validFormData = editChannelSchema.parse({
      [text]: channelText,
      [logo]: formData.get(logo),
      [title]: formData.get(title),
      [chan_slug]: formData.get(chan_slug),
      [description]: formData.get(description),
      [cat_id]: catId,
      [canonical]: formData.get(canonical),
      [sat_id]: formData.get(sat_id),
      [frequency_id]: formData.get(frequency_id),
      [beam_id]: formData.get(beam_id),
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
    const res = editChannelDB(channelID, validFormData);
    if (res instanceof Error) throw new Error(res.message);
  } catch (error) {
    return fromErrorToFormState(error);
  }

  revalidateUrl.forEach((url) => revalidatePath(url));
  // redirect(revalidateUrl);

  return toFormState('SUCCESS', 'Channel updated successfully');
};

// export const editCommentAction = async (
//   itemID: number,
//   dbTableName: EDBTableTitles,
//   revalidateUrl: string,
//   _formState: IFormState,
//   formData: FormData
// ) => {
//   const { COMMENT_TEXT } = EEditCommentFieldNames;

//   const commentSchema = z.object({
//     [COMMENT_TEXT]: z
//       .string()
//       .min(2, 'At least 2 characters')
//       .max(450, '450 characters maximum'),
//   });

//   try {
//     const validFormData = commentSchema.parse({
//       [COMMENT_TEXT]: formData.get(COMMENT_TEXT),
//     });

//     editCommentDB(dbTableName, itemID, validFormData[COMMENT_TEXT]);
//   } catch (error) {
//     return fromErrorToFormState(error);
//   }

//   revalidatePath(revalidateUrl);
//   redirect(revalidateUrl);
// };

// const { AUTHOR, EMAIL, TEXT } = ECommentFormNames;

// const commentSchema = z.object({
//   [AUTHOR]: z
//     .string()
//     .min(authorName.minSize.value, authorName.minSize.warningText[LANGUAGE])
//     .max(authorName.maxSize.value, authorName.maxSize.warningText[LANGUAGE]),
//   [EMAIL]: z.union([
//     z.literal(''),
//     z.string().email(authorEmail.warningText[LANGUAGE]),
//   ]),
//   [TEXT]: z
//     .string()
//     .min(commentText.minSize.value, commentText.minSize.warningText[LANGUAGE])
//     .max(commentText.maxSize.value, commentText.maxSize.warningText[LANGUAGE]),
// });

// export const formCommentAction = async (
//   articleId: string,
//   userIp: string,
//   userCountryCode: string,
//   revalidateUrl: string,
//   dbTableName: EDBTableTitles,
//   _formState: IFormState,
//   formData: FormData
// ) => {
//   let fieldValues = emptyFieldValues;

//   try {
//     const validFormData = commentSchema.parse({
//       [AUTHOR]: formData.get(AUTHOR),
//       [EMAIL]: formData.get(EMAIL),
//       [TEXT]: formData.get(TEXT),
//     });

//     insertComment(
//       dbTableName,
//       articleId,
//       validFormData[AUTHOR],
//       validFormData[EMAIL],
//       validFormData[TEXT],
//       userIp,
//       userCountryCode
//     );

//     fieldValues = {
//       authorName: validFormData[AUTHOR],
//       commentText: validFormData[TEXT],
//       authorEmail: validFormData[EMAIL],
//     };
//   } catch (error) {
//     return fromErrorToFormState(error);
//   }

//   revalidatePath(revalidateUrl);

//   return toFormState('SUCCESS', 'Comment created', fieldValues);
// };
