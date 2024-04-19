import { IFormState } from '@/models/comments.model';
import { useRef, useEffect } from 'react';
import { sendMail } from '../mail/sendMail';
import { renderAsync } from '@react-email/render';
import {
  CommentToAdminEmail,
  CommentToUserEmail,
} from '@/components/EmailTemplate/EmailTemplate';
import { EDBTableTitles } from '@/models/ui.model';

const useFormCommentSendEmail = (
  formState: IFormState,
  articleName: string,
  articlePath: string,
  tblCommentName: EDBTableTitles,
  articleId: number
) => {
  const prevTimestamp = useRef(formState.timestamp);
  const { authorName, authorEmail, commentText } = formState.fieldValues;

  useEffect(() => {
    const sendEmails = async () => {
      const attributes = {
        authorName,
        authorEmail,
        commentText,
      };
      await sendMail({
        subject: `Новий коментар до сторінки: ${articleName}`,
        body: await renderAsync(<CommentToAdminEmail {...attributes} />),
      });

      if (authorEmail) {
        const attributes = {
          articleId,
          authorName,
          authorEmail,
          commentText,
          articleName,
          articlePath,
          tblCommentName,
        };
        const body = await renderAsync(<CommentToUserEmail {...attributes} />);
        await sendMail({
          to: authorEmail,
          subject: `Новий коментар до сторінки: ${articleName}`,
          body,
        });
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

export { useFormCommentSendEmail };
