'use server';

import {
  deleteComment,
  deleteSubscriptionEmail,
  editCommentDB,
  insertComment,
} from '@/controllers/comments.controller';
import {
  IFormState,
  fromErrorToFormState,
  toFormState,
} from '@/controllers/toast.controller';
import { EEditCommentFieldNames } from '@/models/admin.model';
import { COMMENTS_MODEL, ECommentFormNames } from '@/models/comments.model';
import { EDBTableTitles, ELanguage } from '@/models/ui.model';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const { authorName, authorEmail, commentText } = COMMENTS_MODEL.commentForm;

const emptyFieldValues = {
  authorName: '',
  commentText: '',
  authorEmail: '',
};

const { AUTHOR, EMAIL, TEXT } = ECommentFormNames;

const getCommentSchema = (lang: ELanguage) =>
  z.object({
    [AUTHOR]: z
      .string()
      .min(authorName.minSize.value, authorName.minSize.warningText[lang])
      .max(authorName.maxSize.value, authorName.maxSize.warningText[lang]),
    [EMAIL]: z.union([
      z.literal(''),
      z.string().email(authorEmail.warningText[lang]),
    ]),
    [TEXT]: z
      .string()
      .min(commentText.minSize.value, commentText.minSize.warningText[lang])
      .max(commentText.maxSize.value, commentText.maxSize.warningText[lang]),
  });

export const addCommentAction = async (
  lang: ELanguage,
  articleId: string | number,
  userIp: string,
  userCountryCode: string,
  revalidateUrl: string,
  dbTableName: EDBTableTitles,
  _formState: IFormState,
  formData: FormData
) => {
  let fieldValues = emptyFieldValues;
  let res = 0;

  try {
    const validFormData = getCommentSchema(lang).parse({
      [AUTHOR]: formData.get(AUTHOR),
      [EMAIL]: formData.get(EMAIL),
      [TEXT]: formData.get(TEXT),
    });

    res = await insertComment(
      dbTableName,
      articleId,
      validFormData[AUTHOR],
      validFormData[EMAIL],
      validFormData[TEXT],
      userIp,
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

  return toFormState('SUCCESS', `${res} comment added`, fieldValues);
};

export const deleteCommentAction = async (
  commentID: string,
  dbTableName: EDBTableTitles,
  revalidateUrl: string
) => {
  const delCommentResult = await deleteComment(dbTableName, commentID);

  if (delCommentResult instanceof Error)
    return fromErrorToFormState(delCommentResult.message);

  revalidatePath(revalidateUrl);

  // if SUCCESS, the component is removed.
  // Since the toast is displayed at the level of this component, it will be deleted along with the component
  // and we will not be able to see this tost

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
      .min(2, 'At least 2 characters')
      .max(450, '450 characters maximum'),
  });

  try {
    const validFormData = commentSchema.parse({
      [COMMENT_TEXT]: formData.get(COMMENT_TEXT),
    });

    const res = await editCommentDB(
      dbTableName,
      commentID,
      validFormData[COMMENT_TEXT]
    );

    revalidatePath(revalidateUrl);
    // redirect(revalidateUrl);

    return toFormState('SUCCESS', `${res} comment changed`);
  } catch (error) {
    return fromErrorToFormState(error);
  }
};
