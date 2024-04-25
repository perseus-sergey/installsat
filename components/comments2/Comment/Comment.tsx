import { useEffect, useRef, useState } from 'react';
import styles from './Comment.module.scss';
// import '../styles.css';
import CommentActionButton from '../CommentActionButton/CommentActionButton';
import { IComments } from '../CommentList/CommentList';

interface ICommentProps {
  handleInsertNode: (folderId: number, item: string) => void;
  handleEditNode: (folderId: number, value: string | undefined) => void;
  handleDeleteNode: (folderId: number) => void;
  comment: IComments;
}

const Comment = ({
  handleInsertNode,
  handleEditNode,
  handleDeleteNode,
  comment,
}: ICommentProps) => {
  const [inputValue, setInputValue] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [expand, setExpand] = useState(false);
  const inputRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inputRef) return;

    inputRef.current?.focus();
  }, [editMode]);

  const handleNewComment = () => {
    setExpand(!expand);
    setShowInput(true);
  };

  const onAddComment = () => {
    if (!inputRef) return;

    if (editMode) {
      handleEditNode(comment.id, inputRef.current?.innerText);
    } else {
      setExpand(true);
      handleInsertNode(comment.id, inputValue);
      setShowInput(false);
      setInputValue('');
    }

    if (editMode) setEditMode(false);
  };

  const handleDelete = () => {
    handleDeleteNode(comment.id);
  };

  return (
    <form className={styles.Comment} data-testid="Comment">
      <div
        className={
          comment.id === 1 ? styles.inputContainer : styles.commentContainer
        }
      >
        {comment.id === 1 ? (
          <>
            <input
              id="parentCommentName"
              name="parentCommentName"
              className={`${styles.inputContainer__input} ${styles.first_input}`}
              autoFocus
              // value={inputValue}
              // onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ім'я..."
              aria-label="Введіть своє Ім'я"
            />
            <input
              id="parentCommentMail"
              name="parentCommentMail"
              className={`${styles.inputContainer__input} ${styles.first_input}`}
              autoFocus
              // value={inputValue}
              // onChange={(e) => setInputValue(e.target.value)}
              placeholder="your@email.com"
              aria-label="Введіть свою електронну пошту"
            />
            {/* <StyledInputField
              idName="parentCommentMail"
              cancelClick={() => setInputValue('')}
              cancelBtnAriaLabel="Очистити поле введення"
              className={`${styles.inputContainer__input} ${styles.first_input}`}
              autoFocus
              value={inputValue}
              handleOnChange={setInputValue}
              placeholder="your@email.com"
              hiddenLabelTitle="Введіть свою електронну пошту"
            /> */}
            <textarea
              id="parentComment"
              name="parentComment"
              className={`${styles.inputContainer__input} ${styles.first_input}`}
              autoFocus
              placeholder="Введіть коментар..."
              aria-label="Введіть коментар"
              rows={4}
            />
            {/* <StyledTextArea
              idName="parentComment"
              cancelClick={() => setInputValue('')}
              cancelBtnAriaLabel="Очистити поле введення"
              className={`${styles.inputContainer__input} ${styles.first_input}`}
              autoFocus
              value={inputValue}
              handleOnChange={setInputValue}
              placeholder="Введіть коментар..."
              hiddenLabelTitle="Введіть коментар"
              rows={4}
            /> */}

            {/* <CommentActionButton
              className={`${styles.reply} ${styles.comment}`}
              type="COMMENT"
              handleClick={onAddComment}
            /> */}
            <button type="submit">Submit</button>
          </>
        ) : (
          <>
            <span
              contentEditable={editMode}
              suppressContentEditableWarning={editMode}
              ref={inputRef}
              style={{ wordWrap: 'break-word' }}
            >
              {comment.name}
            </span>

            <div style={{ display: 'flex', marginTop: '5px' }}>
              {editMode ? (
                <>
                  <CommentActionButton
                    className={styles.reply}
                    type="SAVE"
                    handleClick={onAddComment}
                  />
                  <CommentActionButton
                    className={styles.reply}
                    type="CANCEL"
                    handleClick={() => {
                      if (inputRef.current)
                        inputRef.current.innerText = comment.name || '';
                      setEditMode(false);
                    }}
                  />
                </>
              ) : (
                <>
                  <CommentActionButton
                    className={styles.reply}
                    type={
                      <>
                        {expand ? (
                          <span className={styles.arrowUp} />
                        ) : (
                          <span className={styles.arrowDown} />
                        )}{' '}
                        REPLY
                      </>
                    }
                    handleClick={handleNewComment}
                  />
                  <CommentActionButton
                    className={styles.reply}
                    type="EDIT"
                    handleClick={() => {
                      setEditMode(true);
                    }}
                  />
                  <CommentActionButton
                    className={styles.reply}
                    type="DELETE"
                    handleClick={handleDelete}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div style={{ display: expand ? 'block' : 'none', paddingLeft: 25 }}>
        {showInput && (
          <div className={styles.inputContainer}>
            <input
              type="text"
              className={styles.inputContainer__input}
              autoFocus
              onChange={(e) => setInputValue(e.target.value)}
            />
            <CommentActionButton
              className={styles.reply}
              type="REPLY"
              handleClick={onAddComment}
            />
            <CommentActionButton
              className={styles.reply}
              type="CANCEL"
              handleClick={() => {
                setShowInput(false);
                if (!comment?.items?.length) setExpand(false);
              }}
            />
          </div>
        )}

        {comment?.items?.map((cmnt) => {
          return (
            <Comment
              key={cmnt.id}
              handleInsertNode={handleInsertNode}
              handleEditNode={handleEditNode}
              handleDeleteNode={handleDeleteNode}
              comment={cmnt}
            />
          );
        })}
      </div>
    </form>
  );
};

export default Comment;
