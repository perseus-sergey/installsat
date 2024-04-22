import { useRef, useEffect } from 'react';
import { sendMail } from '../mail/sendMail';
import { renderAsync } from '@react-email/render';
import {
  CommentToAdminEmail,
  CommentToUserEmail,
} from '@/components/EmailTemplate/EmailTemplate';
import { EDBTableTitles } from '@/models/ui.model';
import { getArticleSubscribers } from '@/controllers/comments.controller';
import { IFormState } from '@/controllers/toast.controller';

export const useFormCommentSendEmail = (
  formState: IFormState,
  articleName: string,
  articlePath: string,
  tblCommentName: EDBTableTitles,
  articleId: number,
  userIP: string,
  baseUrl: string,
  emailKey: string
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
        userIP,
        baseUrl,
        emailKey,
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
        };
        const body = await renderAsync(<CommentToUserEmail {...attributes} />);
        await sendMail({
          to: authorEmail,
          subject: `Новий коментар до сторінки: ${articleName}`,
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
