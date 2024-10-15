'use client';

import { useFormState } from 'react-dom';
import styles from './DeleteCommentSubscription.module.scss';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
import { delSubscriptionAction } from '@/libs/actions/comments.action';
import { EDBTableTitles } from '@/models/dbTblNames.model';
import { DELETE_SUBSCRIPTION_PAGE } from '@/models/ui/comments.model';
import {
  CancelLinkButton,
  ConfirmSubmitButton,
} from '../ConfirmCancelButtons/ConfirmCancelButtons';
import { ELanguage } from '@/models/language.model';

const { askText, answerText, confirmButton, cancelButton } =
  DELETE_SUBSCRIPTION_PAGE;

interface IDeleteCommentSubscriptionProps {
  articleTitle: string;
  articleId: string;
  commentDbTable: EDBTableTitles;
  mail: string;
  lang: ELanguage;
}

const DeleteCommentSubscription = ({
  articleTitle,
  articleId,
  commentDbTable,
  mail,
  lang,
}: IDeleteCommentSubscriptionProps) => {
  const deleteSubscriptionHandler = delSubscriptionAction.bind(
    null,
    articleId,
    commentDbTable,
    mail
  );

  const [formState, formAction] = useFormState(
    deleteSubscriptionHandler,
    EMPTY_FORM_STATE
  );

  const noScriptFallback = useToastMessage(formState);

  return (
    <>
      {formState.status === 'SUCCESS' ? (
        <p className={styles.responseBlock}>
          {answerText[lang]}
          <br />
          <em className={styles.articleName}>✧{articleTitle}✧</em>
        </p>
      ) : (
        <form id="remove-subscription-form" action={formAction}>
          <p className={styles.responseBlock}>
            {askText[lang]}
            <br />
            <em className={styles.articleName}>✧{articleTitle}✧</em>?
          </p>
          <div className={styles.buttonsWrapper}>
            <ConfirmSubmitButton
              ariaLabel={confirmButton.ariaLabel[lang]}
              pendingInnerHtml={confirmButton.pendingText[lang]}
              title={confirmButton.title[lang]}
            />
            <CancelLinkButton
              ariaLabel={cancelButton.ariaLabel[lang]}
              href={`/${lang}`}
              title={cancelButton.title[lang]}
            />
          </div>
          {noScriptFallback}
        </form>
      )}
    </>
  );
};

export default DeleteCommentSubscription;
