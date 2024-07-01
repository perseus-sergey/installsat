'use client';

import { useFormState } from 'react-dom';
import styles from './DeleteCommentSubscription.module.scss';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
import { delSubscriptionAction } from '@/libs/actions/comments.action';
import { EDBTableTitles, DEFAULT_LANG } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { COMMENTS_MODEL } from '@/models/comments.model';
import {
  CancelLinkButton,
  ConfirmSubmitButton,
} from '../ConfirmCancelButtons/ConfirmCancelButtons';

const {
  deleteSubscriptionPage: { askText, answerText, confirmButton, cancelButton },
} = COMMENTS_MODEL;

interface IDeleteCommentSubscriptionProps {
  articleTitle: string;
  articleId: string;
  commentDbTable: EDBTableTitles;
  mail: string;
}

const DeleteCommentSubscription = ({
  articleTitle,
  articleId,
  commentDbTable,
  mail,
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
          {answerText[DEFAULT_LANG]}
          <br />
          <em className={styles.articleName}>✧{articleTitle}✧</em>
        </p>
      ) : (
        <form id="remove-subscription-form" action={formAction}>
          <p className={styles.responseBlock}>
            {askText[DEFAULT_LANG]}
            <br />
            <em className={styles.articleName}>✧{articleTitle}✧</em>?
          </p>
          <div className={styles.buttonsWrapper}>
            <ConfirmSubmitButton
              ariaLabel={confirmButton.ariaLabel[DEFAULT_LANG]}
              pendingInnerHtml={confirmButton.pendingText[DEFAULT_LANG]}
              title={confirmButton.title[DEFAULT_LANG]}
            />
            <CancelLinkButton
              ariaLabel={cancelButton.ariaLabel[DEFAULT_LANG]}
              href={EUrlBaseParam.BASE_PATH}
              title={cancelButton.title[DEFAULT_LANG]}
            />
          </div>
          {noScriptFallback}
        </form>
      )}
    </>
  );
};

export default DeleteCommentSubscription;
