import BaseButton from '@/components/ui/buttons/BaseButton/BaseButton';
import React from 'react';
// import styles from './CommentActionButton.module.scss';

interface ICommentActionButtonProps {
  handleClick: () => void;
  type: React.ReactNode;
  className: string;
}

const CommentActionButton = ({
  handleClick,
  type,
  className,
}: ICommentActionButtonProps) => (
  <BaseButton
    className={className}
    onClick={handleClick}
    data-testid="CommentActionButton"
    ariaLabel={`${type} коментар`}
  >
    {type}
  </BaseButton>
);

export default CommentActionButton;
