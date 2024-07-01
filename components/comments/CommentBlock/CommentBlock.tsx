import styles from './CommentBlock.module.scss';
import CommentForm from '../CommentForm/CommentForm';
import { EDBTableTitles, ELanguage } from '@/models/ui.model';
import { COMMENTS_MODEL } from '@/models/comments.model';
import { EUrlSearchParam } from '@/models/url.model';
import { fetchUserLocation } from '@/libs/utils/getUserIP';
import PaginationComments from '@/components/comments/PaginationComments/PaginationComments';

const {
  commentForm,
  commentList: { commentsPerPage, paginationOffset },
} = COMMENTS_MODEL;

interface IProps {
  revalidateUrl: string;
  dbCommentTableName: EDBTableTitles;
  articleId: string;
  articleName: string;
  numberOfComments: number;
  lang: ELanguage;
}

const CommentBlock = async ({
  revalidateUrl,
  dbCommentTableName,
  articleId,
  articleName,
  numberOfComments,
  lang,
}: IProps) => {
  const userLocation = await fetchUserLocation();

  return (
    <section className={styles.CommentBlock} id={EUrlSearchParam.COMMENT_ID}>
      <h2 className={styles.commentBlockTitle}>{commentForm.title[lang]}</h2>
      <CommentForm
        lang={lang}
        revalidateUrl={revalidateUrl}
        dbCommentTableName={dbCommentTableName}
        articleId={articleId}
        articleName={articleName}
        userLocation={userLocation}
        baseUrl={process.env.BASE_URL || ''}
        emailKey={process.env.MAIL_ENCRYPT_KEY || ''}
      />
      <div className={styles.bansBlock}>
        <BansBlock lang={lang} />
      </div>
      <PaginationComments
        lang={lang}
        numberOfComments={numberOfComments}
        offsetNumber={paginationOffset}
        commentsPerPage={commentsPerPage}
        commentsDBTblName={dbCommentTableName}
        articleId={articleId}
      />
    </section>
  );
};

const BansBlock = ({ lang }: { lang: ELanguage }) => (
  <>
    <h3>{lang === ELanguage.UA ? 'Заборонено:' : 'Prohibited:'}</h3>
    <ol type="1" style={{ listStyle: 'auto', paddingLeft: '2rem' }}>
      <li>
        {lang === ELanguage.UA
          ? 'Рекламувати інші ресурси'
          : 'Promote other resources'}
      </li>
      <li>
        {lang === ELanguage.UA
          ? 'Використовувати нецензурну лексику'
          : 'Use obscene language'}
      </li>
      <li>
        {lang === ELanguage.UA
          ? 'Образливо висловлюватися щодо інтересів інших користувачів'
          : 'To speak offensively about the interests of other users'}
      </li>
    </ol>
    <p>
      {lang === ELanguage.UA
        ? 'Подібні коментарі будуть редагуватися або видалятися без попередження.'
        : 'Such comments will be edited or deleted without notice.'}
    </p>
    <p>
      {lang === ELanguage.UA
        ? 'Зловмисникам доступ до даного ресурсу буде заблоковано.'
        : 'Access to this resource will be blocked for intruders.'}
    </p>
  </>
);

export default CommentBlock;
