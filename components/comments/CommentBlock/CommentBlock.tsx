import styles from './CommentBlock.module.scss';
import Comment from '../CommentForm/CommentForm';
import FillingImg from '@/components/Images/FillingImage';
import { ICommentsModel } from '@/models/articles.model';
import { getFormattedDateStr } from '@/libs/utils';
import { EDBTableTitles, ELanguage, LANGUAGE } from '@/models/ui.model';
import { COMMENTS_MODEL } from '@/models/comments.model';

const { commentForm, commentList } = COMMENTS_MODEL;

interface IProps {
  comments: ICommentsModel[];
  revalidateUrl: string;
  dbCommentTableName: EDBTableTitles;
  articleId: string;
  articleName: string;
  userIP: string;
  baseUrl: string;
  emailKey: string;
}

const CommentBlock = ({
  comments,
  revalidateUrl,
  dbCommentTableName,
  articleId,
  articleName,
  userIP,
  baseUrl,
  emailKey,
}: IProps) => {
  return (
    <section className={styles.CommentBlock}>
      <h2 className={styles.commentBlockTitle}>
        {commentForm.title[LANGUAGE]}
      </h2>
      <Comment
        revalidateUrl={revalidateUrl}
        dbCommentTableName={dbCommentTableName}
        articleId={articleId}
        articleName={articleName}
        userIP={userIP}
        baseUrl={baseUrl}
        emailKey={emailKey}
      />

      <div className={styles.bansBlock}>
        <BansBlock lang={LANGUAGE} />
      </div>

      {comments.length > 0 && (
        <>
          <h3 className={styles.commentsTitle}>
            <FillingImg
              {...commentList.image}
              alt={commentList.image.alt[LANGUAGE]}
            />
            {commentList.title[LANGUAGE]} ({comments.length})
          </h3>
          <ul className={styles.CommentList}>
            {comments.map((comment) => {
              const country = comment.country ? `(${comment.country})` : '';

              return (
                <li key={comment.id} className={styles.commentContainer}>
                  <span
                    className={styles.commentDate}
                  >{`(${getFormattedDateStr(comment.date)})  `}</span>
                  <span
                    className={styles.commentAuthor}
                  >{`${comment.author} ${country}`}</span>
                  <p className={styles.commentText}>... {comment.text}</p>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
};

const BansBlock = ({ lang }: { lang: ELanguage }) => (
  <>
    <h3>{lang === 'ua' ? 'Заборонено:' : 'Prohibited:'}</h3>
    <ol type="1" style={{ listStyle: 'auto', paddingLeft: '2rem' }}>
      <li>
        {lang === 'ua' ? 'Рекламувати інші ресурси' : 'Promote other resources'}
      </li>
      <li>
        {lang === 'ua'
          ? 'Використовувати нецензурну лексику'
          : 'Use obscene language'}
      </li>
      <li>
        {lang === 'ua'
          ? 'Образливо висловлюватися щодо інтересів інших користувачів'
          : 'To speak offensively about the interests of other users'}
      </li>
    </ol>
    <p>
      {lang === 'ua'
        ? 'Подібні коментарі будуть редагуватися або видалятися без попередження.'
        : 'Such comments will be edited or deleted without notice.'}
    </p>
    <p>
      {lang === 'ua'
        ? 'Зловмисникам доступ до даного ресурсу буде заблоковано.'
        : 'Access to this resource will be blocked for intruders.'}
    </p>
  </>
);

export default CommentBlock;
