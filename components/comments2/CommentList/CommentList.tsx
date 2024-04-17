'use client';

import useCommentNode from '@/libs/hooks/useCommentNode';
import styles from './CommentList.module.scss';
import { useState } from 'react';
import Comment from '../Comment/Comment';

export interface IComments {
  id: number;
  name?: string;
  items: IComments[];
}

export const comments = {
  id: 1,
  items: [],
};

const CommentList = () => {
  const [commentsData, setCommentsData] = useState<IComments>(comments);

  const { insertNode, editNode, deleteNode } = useCommentNode();

  const handleInsertNode = (folderId: number, item: string) => {
    const finalStructure = insertNode(commentsData, folderId, item);
    setCommentsData(finalStructure);
  };

  const handleEditNode = (folderId: number, value: string | undefined) => {
    const finalStructure = editNode(commentsData, folderId, value || '');
    setCommentsData(finalStructure);
  };

  const handleDeleteNode = (folderId: number) => {
    const finalStructure = deleteNode(commentsData, folderId);
    const temp = { ...finalStructure };
    setCommentsData(temp);
  };

  return (
    <section className={styles.CommentList} data-testid="CommentList">
      <h2 className={styles.commentTitle}>Додати коментар:</h2>
      <Comment
        handleInsertNode={handleInsertNode}
        handleEditNode={handleEditNode}
        handleDeleteNode={handleDeleteNode}
        comment={commentsData}
      />
    </section>
  );
};

export default CommentList;
