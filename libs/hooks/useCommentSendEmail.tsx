import { useRef, useEffect } from 'react';

import { EDBTableTitles } from '@/models/dbTblNames.model';
import { IFormState } from '@/controllers/toast.controller';
import { EMAIL_DATA } from '@/models/ui/comments.model';
import { ELanguage } from '@/models/language.model';
import { getArticleSubscribers } from '@/controllers/comments.controller';
import {
  getCommentToAdminEmail,
  getCommentToUserEmail,
} from '@/components/EmailTemplates/CommentEmailSimple.template';
import { sendMail } from '../mail/sendMail';

export const useCommentSendEmail = (
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

        const adminEmailBody = await getCommentToAdminEmail(attributes);
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

          const userEmailBody = await getCommentToUserEmail(userAttributes);

          await sendMail({
            to: mail,
            subject: `${EMAIL_DATA.subjectPreTitle[lang]} ${articleName}`,
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
