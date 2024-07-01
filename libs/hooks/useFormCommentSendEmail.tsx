import { useRef, useEffect } from 'react';
import { sendMail } from '../mail/sendMail';
import { renderAsync } from '@react-email/render';
import {
  CommentToAdminEmail,
  CommentToUserEmail,
} from '@/components/EmailTemplates/CommentEmail.template';
import { EDBTableTitles, ELanguage } from '@/models/ui.model';
import { getArticleSubscribers } from '@/controllers/comments.controller';
import { IFormState } from '@/controllers/toast.controller';
import { COMMENTS_MODEL } from '@/models/comments.model';
import { IUserLocation } from '@/models/userLocation.model';

export const useFormCommentSendEmail = (
  formState: IFormState,
  articleName: string,
  articlePath: string,
  tblCommentName: EDBTableTitles,
  articleId: string,
  userLocation: IUserLocation | null,
  baseUrl: string,
  emailKey: string,
  lang: ELanguage
) => {
  const prevTimestamp = useRef(formState.timestamp);
  const { authorName, authorEmail, commentText } = formState.fieldValues;

  useEffect(() => {
    const sendEmails = async () => {
      const subscribersResult = await getArticleSubscribers(
        tblCommentName,
        `${articleId}`
      );
      const subscribers =
        subscribersResult instanceof Error || !subscribersResult.length
          ? []
          : subscribersResult;

      const attributes = {
        authorName,
        authorEmail,
        commentText,
        articleId,
        articleName,
        articlePath,
        tblCommentName,
        subscribers,
        userLocation,
        baseUrl,
        emailKey,
        lang,
      };
      await sendMail({
        subject: `New comment for page: ${articleName}`,
        body: await renderAsync(<CommentToAdminEmail {...attributes} />),
      });

      subscribers.forEach(async ({ mail }) => {
        const attributes = {
          articleId,
          authorName: authorName || '',
          authorEmail: mail,
          commentText: commentText || '',
          articleName,
          articlePath,
          tblCommentName,
          baseUrl,
          emailKey,
          lang,
        };
        const body = await renderAsync(<CommentToUserEmail {...attributes} />);
        await sendMail({
          to: mail,
          subject: `${COMMENTS_MODEL.email.subjectPreTitle[lang]} ${articleName}`,
          body,
        });
      });
    };

    if (
      formState.status === 'SUCCESS' &&
      formState.timestamp !== prevTimestamp.current
    ) {
      sendEmails();

      prevTimestamp.current = formState.timestamp;
    }
  }, [formState.status, formState.timestamp]);
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
