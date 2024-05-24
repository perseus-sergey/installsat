'use server';

import { deleteItemFromDbTable } from '@/controllers/admin.controller';
import {
  fromErrorToFormState,
  toFormState,
} from '@/controllers/toast.controller';
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
