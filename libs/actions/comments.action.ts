'use server';

import { IFormState } from '@/controllers/toast.controller';
import { ECommentFormNames } from '@/models/ui/comments.model';
import { ELanguage } from '@/models/language.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';

const emptyFieldValues = {
  authorName: '',
  commentText: '',
  authorEmail: '',
};

const { AUTHOR, EMAIL, TEXT } = ECommentFormNames;

const getCommentSchema = async (lang: ELanguage) => {
  const { z } = await import('zod');
  const {
    COMMENTS_MODEL: {
      commentForm: { authorName, authorEmail, commentText },
    },
  } = await import('@/models/ui/comments.model');

  return z.object({
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
};

const forbiddenContent = (text: string) => {
  const htmlTagRegex = /<\/?[^>]+(>|$)/g;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const forbiddenWords = ['iframe'];

  return (
    htmlTagRegex.test(text) ||
    urlRegex.test(text) ||
    forbiddenWords.some((word) => text.includes(word))
  );
};

export const addCommentAction = async (
  lang: ELanguage,
  articleId: string | number,
  // userIp: string,
  // userCountryCode: string,
  revalidateUrl: string,
  dbTableName: EDBTableTitles,
  _formState: IFormState,
  formData: FormData
) => {
  const { insertComment } = await import('@/controllers/comments.controller');
  const { fromErrorToFormState, toFormState } = await import(
    '@/controllers/toast.controller'
  );
  const { fetchUserLocation } = await import('../utils/getUserIP');
  const userLocation = await fetchUserLocation();

  const userCountryCode =
    userLocation && userLocation.status === 'success'
      ? userLocation.countryCode
      : '';

  const userIp =
    userLocation && userLocation.status === 'success' ? userLocation.query : '';

  let fieldValues = emptyFieldValues;
  let res = 0;

  try {
    const validFormData = (await getCommentSchema(lang)).parse({
      [AUTHOR]: formData.get(AUTHOR),
      [EMAIL]: formData.get(EMAIL),
      [TEXT]: formData.get(TEXT),
    });

    if (forbiddenContent(validFormData[TEXT])) {
      const {
        COMMENTS_MODEL: {
          commentForm: { forbiddenCommentMsg },
        },
      } = await import('@/models/ui/comments.model');

      return toFormState('ERROR', forbiddenCommentMsg[lang]);
    }

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

  const { revalidatePath } = await import('next/cache');

  revalidatePath(revalidateUrl);

  return toFormState('SUCCESS', `${res} comment added`, fieldValues);
};

export const deleteCommentAction = async (
  commentID: string,
  dbTableName: EDBTableTitles,
  revalidateUrl: string
) => {
  const { fromErrorToFormState, toFormState } = await import(
    '@/controllers/toast.controller'
  );
  const { deleteComment } = await import('@/controllers/comments.controller');

  const delCommentResult = await deleteComment(dbTableName, commentID);

  if (delCommentResult instanceof Error)
    return fromErrorToFormState(delCommentResult.message);

  const { revalidatePath } = await import('next/cache');

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
  const { deleteSubscriptionEmail } = await import(
    '@/controllers/comments.controller'
  );
  const { fromErrorToFormState, toFormState } = await import(
    '@/controllers/toast.controller'
  );

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
  const { editCommentDB } = await import('@/controllers/comments.controller');
  const { fromErrorToFormState, toFormState } = await import(
    '@/controllers/toast.controller'
  );
  const {
    EEditCommentFieldNames: { COMMENT_TEXT },
  } = await import('@/models/admin.model');

  try {
    const { z } = await import('zod');

    const commentSchema = z.object({
      [COMMENT_TEXT]: z
        .string()
        .min(2, 'At least 2 characters')
        .max(450, '450 characters maximum'),
    });
    const validFormData = commentSchema.parse({
      [COMMENT_TEXT]: formData.get(COMMENT_TEXT),
    });

    const res = await editCommentDB(
      dbTableName,
      commentID,
      validFormData[COMMENT_TEXT]
    );

    const { revalidatePath } = await import('next/cache');

    revalidatePath(revalidateUrl);

    return toFormState('SUCCESS', `${res} comment changed`);
  } catch (error) {
    return fromErrorToFormState(error);
  }
};
