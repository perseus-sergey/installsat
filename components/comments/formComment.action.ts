'use server';

import { insertComment } from '@/controllers/comments.controller';
import { COMMENTS_MODEL, ECommentFormNames } from '@/models/comments.model';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { EDBTableTitles, LANGUAGE } from '@/models/ui.model';
import {
  IFormState,
  fromErrorToFormState,
  toFormState,
} from '@/controllers/toast.controller';

const { authorName, authorEmail, commentText } = COMMENTS_MODEL.commentForm;

const emptyFieldValues = {
  authorName: '',
  commentText: '',
  authorEmail: '',
};

const { AUTHOR, EMAIL, TEXT } = ECommentFormNames;

const commentSchema = z.object({
  [AUTHOR]: z
    .string()
    .min(authorName.minSize.value, authorName.minSize.warningText[LANGUAGE])
    .max(authorName.maxSize.value, authorName.maxSize.warningText[LANGUAGE]),
  [EMAIL]: z.union([
    z.literal(''),
    z.string().email(authorEmail.warningText[LANGUAGE]),
  ]),
  [TEXT]: z
    .string()
    .min(commentText.minSize.value, commentText.minSize.warningText[LANGUAGE])
    .max(commentText.maxSize.value, commentText.maxSize.warningText[LANGUAGE]),
});

export const formCommentAction = async (
  articleId: string,
  userCountryCode: string,
  revalidateUrl: string,
  dbTableName: EDBTableTitles,
  _formState: IFormState,
  formData: FormData
) => {
  let fieldValues = emptyFieldValues;

  try {
    const validFormData = commentSchema.parse({
      [AUTHOR]: formData.get(AUTHOR),
      [EMAIL]: formData.get(EMAIL),
      [TEXT]: formData.get(TEXT),
    });

    insertComment(
      dbTableName,
      articleId,
      validFormData[AUTHOR],
      validFormData[EMAIL],
      validFormData[TEXT],
      userCountryCode
    );

    fieldValues = {
      authorName: validFormData[AUTHOR],
      commentText: validFormData[TEXT],
      authorEmail: validFormData[EMAIL],
    };
  } catch (error) {
    return fromErrorToFormState(error);
  }

  revalidatePath(revalidateUrl);

  return toFormState('SUCCESS', 'Comment created', fieldValues);
};
