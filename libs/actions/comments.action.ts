'use server';

import {
  deleteComment,
  deleteSubscriptionEmail,
} from '@/controllers/comments.controller';
import {
  fromErrorToFormState,
  toFormState,
} from '@/controllers/toast.controller';
import { EDBTableTitles } from '@/models/ui.model';
import { revalidatePath } from 'next/cache';

export const deleteCommentAction = async (
  commentID: string,
  dbTableName: EDBTableTitles,
  revalidateUrl: string
) => {
  const delCommentResult = await deleteComment(dbTableName, commentID);

  if (delCommentResult instanceof Error)
    return fromErrorToFormState(delCommentResult.message);

  revalidatePath(revalidateUrl);

  const fState = toFormState('SUCCESS', 'Comment deleted successfully');

  return fState;
};

export const delSubscriptionAction = async (
  articleId: string,
  commentDbTable: EDBTableTitles,
  mail: string
  // revalidateUrl: string
) => {
  const delResult = await deleteSubscriptionEmail(
    commentDbTable,
    articleId,
    mail
  );

  if (delResult instanceof Error)
    return fromErrorToFormState(delResult.message);

  // revalidatePath(revalidateUrl);

  const fState = toFormState('SUCCESS', 'Subscription deleted successfully');

  return fState;
};
