'use server';

import {
  fromErrorToFormState,
  insertComment,
  toFormState,
} from '@/controllers/comments.controller';
import {
  ECommentFormNames,
  IFormState,
  emptyFieldValues,
} from '@/models/comments.model';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { EDBTableTitles } from '@/models/ui.model';

// const { MAIN_EMAIL } = process.env;

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
  [TEXT]: z
    .string()
    .min(2, '⛔ Введіть щонайменш 2 символи')
    .max(450, '⛔ Не більше 450 символів'),
});

export const formCommentAction = async (
  articleId: number,
  userIp: string,
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
      userIp
    );

    fieldValues = {
      authorName: validFormData[AUTHOR],
      commentText: validFormData[TEXT],
      authorEmail: validFormData[EMAIL],
    };

    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Installsat <main@installsat.fun>',
    //   // to: validFormData[EMAIL],
    //   to: 'serubergey@gmail.com',
    //   subject: 'Form Submission',
    //   react: EmailTemplate({
    //     name: validFormData[AUTHOR],
    //     email: validFormData[EMAIL],
    //     message: validFormData[TEXT],
    //   }),
    //   // html: render(
    //   //   EmailTemplate({
    //   //     name: validFormData[AUTHOR],
    //   //     email: validFormData[EMAIL],
    //   //     message: validFormData[TEXT],
    //   //   })
    //   // ),
    // });
  } catch (error) {
    return fromErrorToFormState(error);
  }

  revalidatePath(revalidateUrl);

  return toFormState('SUCCESS', 'Comment created', fieldValues);
};
