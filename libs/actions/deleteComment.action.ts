'use server';

import { deleteComment } from '@/controllers/comments.controller';
import {
  fromErrorToFormState,
  toFormState,
} from '@/controllers/toast.controller';
import { revalidatePath } from 'next/cache';

export const deleteCommentAction = async (
  commentID: string,
  dbTableName: string,
  revalidateUrl: string
) => {
  const delCommentResult = await deleteComment(dbTableName, commentID);

  if (delCommentResult instanceof Error)
    return fromErrorToFormState(delCommentResult.message);

  revalidatePath(revalidateUrl);

  const fState = toFormState('SUCCESS', 'Comment deleted successfully');

  return fState;
};
