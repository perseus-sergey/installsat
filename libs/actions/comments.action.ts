'use server';

import { EEditCommentFieldNames } from '@/app/(admin)/guru/edit-comments/[id]/page';
import {
  deleteComment,
  deleteSubscriptionEmail,
  editCommentDB,
} from '@/controllers/comments.controller';
import {
  IFormState,
  fromErrorToFormState,
  toFormState,
} from '@/controllers/toast.controller';
import { EDBTableTitles } from '@/models/ui.model';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export const deleteCommentAction = async (
  commentID: string,
  dbTableName: EDBTableTitles,
  revalidateUrl: string
) => {
  const delCommentResult = await deleteComment(dbTableName, commentID);

  if (delCommentResult instanceof Error)
    return fromErrorToFormState(delCommentResult.message);

  revalidatePath(revalidateUrl);

  return toFormState('SUCCESS', 'Comment deleted successfully');
};

export const delSubscriptionAction = async (
  articleId: string,
  commentDbTable: EDBTableTitles,
  mail: string
) => {
  const delResult = await deleteSubscriptionEmail(
    commentDbTable,
    articleId,
    mail
  );

  return delResult instanceof Error
    ? fromErrorToFormState(delResult.message)
    : toFormState('SUCCESS', 'Subscription deleted successfully');
};

export const editCommentAction = async (
  commentID: number,
  dbTableName: EDBTableTitles,
  revalidateUrl: string,
  _formState: IFormState,
  formData: FormData
) => {
  const { COMMENT_TEXT } = EEditCommentFieldNames;

  const commentSchema = z.object({
    [COMMENT_TEXT]: z
      .string()
      .min(2, '⛔ At least 2 characters')
      .max(450, '⛔ 450 characters maximum'),
  });

  try {
    const validFormData = commentSchema.parse({
      [COMMENT_TEXT]: formData.get(COMMENT_TEXT),
    });

    editCommentDB(dbTableName, commentID, validFormData[COMMENT_TEXT]);
  } catch (error) {
    return fromErrorToFormState(error);
  }

  revalidatePath(revalidateUrl);
  redirect(revalidateUrl);
};
