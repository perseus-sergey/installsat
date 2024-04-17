'use server';

import {
  fromErrorToFormState,
  insertComment,
  toFormState,
} from '@/controllers/comments.controller';
import { ECommentFormNames, IFormState } from '@/models/comments.model';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const { AUTHOR, EMAIL, TEXT } = ECommentFormNames;

const commentSchema = z.object({
  [AUTHOR]: z
    .string()
    .min(1, '⛔ Введіть щонайменш 1 символ')
    .max(30, '⛔ Не більше 30 символів'),
  [EMAIL]: z.union([
    z.literal(''),
    z.string().email('⛔ Не коректний формат електронної пошти!'),
  ]),
  // [EMAIL]: z.string().email('⛔ Не коректний формат електронної пошти!'),
  [TEXT]: z
    .string()
    .min(2, '⛔ Введіть щонайменш 2 символи')
    .max(450, '⛔ Не більше 450 символів'),
});

export const formCommentAction = async (
  articleId: number,
  userIp: string,
  revalidateUrl: string,
  dbTableName: string,
  _formState: IFormState,
  formData: FormData
) => {
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
      userIp
    );
  } catch (error) {
    return fromErrorToFormState(error);
  }

  revalidatePath(revalidateUrl);

  return toFormState('SUCCESS', 'Comment created');
};

// 'use server';

// import { LAST_NEWS_INTERVAL, rawSatDigest } from '@/models/satDigest.model';
// import { revalidatePath } from 'next/cache';
// import { getSatDigestNews } from '@/controllers/satDigest.controller';

// const digestIntervalAction = async (
//   _prevState: {
//     message: string;
//   },
//   formData: FormData
// ) => {
//   const selectSats = formData.getAll('selectSats') as string[] | undefined;
//   const timeInterval = formData.get('timeInterval') || LAST_NEWS_INTERVAL;
//   const submitBtn = formData.get('submitBtn');

//   if (submitBtn !== 'Submit')
//     return {
//       message: `The submit button was not clicked!`,
//       newsIntervalResult: [rawSatDigest],
//     };

//   const newsIntervalResult = await getSatDigestNews(
//     selectSats,
//     Number(timeInterval)
//   );

//   if (newsIntervalResult instanceof Error)
//     return {
//       message: `Failed to fetch data. Error: ${newsIntervalResult.message}`,
//       newsIntervalResult: [rawSatDigest],
//     };

//   revalidatePath('/');

//   return { message: '', newsIntervalResult };
// };

// export default digestIntervalAction;
