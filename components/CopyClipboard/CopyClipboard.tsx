import { useToastMessage } from '@/libs/hooks/useToastMessage';
import BaseButton from '../ui/buttons/BaseButton/BaseButton';
import { ClipboardIcon } from '../ui/icons-svg/ClipboardIcon';
import { EMPTY_FORM_STATE, toFormState } from '@/controllers/toast.controller';
import { useState } from 'react';

interface IProps {
  value: string;
  classIconWrapper?: string;
}

const CopyClipboard = ({ value, classIconWrapper = '' }: IProps) => {
  const [copyMessage, setCopyMessage] = useState(EMPTY_FORM_STATE);
  const handleCopy = (value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopyMessage(toFormState('SUCCESS', 'Text copied to clipboard!'));
      })
      .catch((err) => {
        setCopyMessage(
          toFormState('ERROR', `Failed to copy text: ${err.message}`)
        );
      });
  };

  useToastMessage(copyMessage);

  return (
    <BaseButton
      data-testid="CopyClipboard"
      className={classIconWrapper}
      ariaLabel="Click to copy"
      onClick={() => handleCopy(value)}
    >
      <ClipboardIcon />
    </BaseButton>
  );
};

export default CopyClipboard;
