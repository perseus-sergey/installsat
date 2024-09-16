import { useRef, useEffect } from 'react';
import { EDBTableTitles, ELanguage } from '@/models/ui.model';
import { IFormState } from '@/controllers/toast.controller';
import { COMMENTS_MODEL } from '@/models/comments.model';
// import { IUserLocation } from '@/models/userLocation.model';

export const useFormCommentSendEmail = (
  formState: IFormState,
  articleName: string,
  articlePath: string,
  tblCommentName: EDBTableTitles,
  articleId: string | number,
  // userLocation: IUserLocation | null,
  baseUrl: string,
  emailKey: string,
  lang: ELanguage
) => {
  const prevTimestamp = useRef(formState.timestamp);
  const { authorName, authorEmail, commentText } = formState.fieldValues;

  useEffect(() => {
    const sendEmails = async () => {
      try {
        const { renderAsync } = await import('@react-email/render');
        const { getArticleSubscribers } = await import(
          '@/controllers/comments.controller'
        );
        const { CommentToAdminEmail, CommentToUserEmail } = await import(
          '@/components/EmailTemplates/CommentEmail.template'
        );
        const { sendMail } = await import('../mail/sendMail');

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
          // userLocation,
          baseUrl,
          emailKey,
          lang,
        };

        const adminEmailBody = await renderAsync(
          <CommentToAdminEmail {...attributes} />
        );
        await sendMail({
          subject: `New comment for page: ${articleName}`,
          body: adminEmailBody,
        });

        for (const { mail } of subscribers) {
          const userAttributes = {
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

          const userEmailBody = await renderAsync(
            <CommentToUserEmail {...userAttributes} />
          );

          await sendMail({
            to: mail,
            subject: `${COMMENTS_MODEL.email.subjectPreTitle[lang]} ${articleName}`,
            body: userEmailBody,
          });
        }
      } catch (error) {
        console.error('Error sending emails:', error);
      }
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
