'use client';

import { useFormState } from 'react-dom';
import styles from './DeleteCommentSubscription.module.scss';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
import { delSubscriptionAction } from '@/libs/actions/comments.action';
import { EDBTableTitles, LANGUAGE } from '@/models/ui.model';
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
          {answerText[LANGUAGE]}
          <br />
          <em className={styles.articleName}>✧{articleTitle}✧</em>
        </p>
      ) : (
        <form id="remove-subscription-form" action={formAction}>
          <p className={styles.responseBlock}>
            {askText[LANGUAGE]}
            <br />
            <em className={styles.articleName}>✧{articleTitle}✧</em>?
          </p>
          <div className={styles.buttonsWrapper}>
            <ConfirmSubmitButton
              ariaLabel={confirmButton.ariaLabel[LANGUAGE]}
              pendingInnerHtml={confirmButton.pendingText[LANGUAGE]}
              title={confirmButton.title[LANGUAGE]}
            />
            <CancelLinkButton
              ariaLabel={cancelButton.ariaLabel[LANGUAGE]}
              href={EUrlBaseParam.BASE_PATH}
              title={cancelButton.title[LANGUAGE]}
            />
          </div>
          {noScriptFallback}
        </form>
      )}
    </>
  );
};

export default DeleteCommentSubscription;
