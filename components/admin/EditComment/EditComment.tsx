'use client';

import { useFormState } from 'react-dom';
import { useToastMessage } from '@/libs/hooks/useToastMessage';
import { EMPTY_FORM_STATE } from '@/controllers/toast.controller';
import { editCommentAction } from '@/libs/actions/comments.action';
import { EDBTableTitles } from '@/models/ui.model';
import {
  CancelLinkButton,
  ConfirmSubmitButton,
} from '@/components/ConfirmCancelButtons/ConfirmCancelButtons';
import { EEditCommentFieldNames } from '@/models/admin.model';

const { COMMENT_TEXT } = EEditCommentFieldNames;

interface IEditCommentProps {
  text: string;
  commentID: string;
  dbTableName: EDBTableTitles;
  revalidateUrl: string;
}

const EditComment = ({
  text,
  commentID,
  dbTableName,
  revalidateUrl,
}: IEditCommentProps) => {
  const editCommentHandler = editCommentAction.bind(
    null,
    +commentID,
    dbTableName,
    revalidateUrl
  );

  const [formState, formAction] = useFormState(
    editCommentHandler,
    EMPTY_FORM_STATE
  );
  const noScriptFallback = useToastMessage(formState);

  return (
    <form action={formAction} id={commentID} style={{ margin: '1rem auto' }}>
      <textarea
        minLength={2}
        maxLength={450}
        name={COMMENT_TEXT}
        id={COMMENT_TEXT}
        cols={60}
        rows={10}
        defaultValue={text}
        style={{ padding: '0.5rem' }}
      />
      <div
        style={{
          display: 'flex',
          padding: '2rem',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
        }}
      >
        <ConfirmSubmitButton
          ariaLabel="Save changes"
          title="Save"
          pendingInnerHtml="Saving..."
        />

        <CancelLinkButton
          ariaLabel="Don't save changes"
          title="Back"
          href={revalidateUrl}
        />
      </div>
      {noScriptFallback}
    </form>
  );
};

export default EditComment;
