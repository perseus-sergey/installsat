// import useCommentNode from '@/libs/hooks/useCommentNode';
import styles from './CommentList.module.scss';
// import { useState } from 'react';
import Comment from '../Comment/Comment';
import FillingImg from '@/components/Images/FillingImage';
import { ICommentsModel } from '@/models/articles.model';
import { getFormattedDateStr } from '@/libs/utils';
import { EDBTableTitles } from '@/models/ui.model';

export interface IComments {
  id: number;
  name?: string;
  items: IComments[];
}

export const comments = {
  id: 1,
  items: [],
};

interface IProps {
  comments: ICommentsModel[];
  revalidateUrl: string;
  dbCommentTableName: EDBTableTitles;
  articleId: number;
  articleName: string;
  userIP: string;
  baseUrl: string;
  emailKey: string;
}

const CommentList = ({
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
    <section className={styles.CommentBlock} data-testid="CommentList">
      <h2 className={styles.commentBlockTitle}>Додати коментар:</h2>
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
        <h3>Заборонено:</h3>
        <ol type="1" style={{ listStyle: 'auto', paddingLeft: '2rem' }}>
          <li>Рекламувати інші ресурси</li>
          <li>Використовувати нецензурну лексику</li>
          <li>Образливо висловлюватися щодо інтересів інших користувачів</li>
        </ol>
        <p>
          Подібні коментарі будуть редагуватися або видалятися без попередження.
        </p>
        <p>Зловмисникам доступ до даного ресурсу буде заблоковано.</p>
      </div>

      {comments.length > 0 && (
        <>
          <h3 className={styles.commentsTitle}>
            <FillingImg
              width="60px"
              height="60px"
              alt="Секція коментарів"
              src="/Images/mail_post_to_5295.png"
            />
            Коментарі ({comments.length})
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

export default CommentList;

// function printComments ($tbl_comm, $id, $db, $SxGeo) {
//   $comment_query = mysql_query ("SELECT * FROM $tbl_comm WHERE post=$id ORDER BY `id` DESC",$db);
//   if (mysql_num_rows($comment_query) > 0){
//   $array_comment = mysql_fetch_array ($comment_query);
//   do{
//     if($array_comment["ip"]){
//       //$country=tabgeo_country_v4($array_comment["ip"]);
//       $country=$SxGeo->get($array_comment["ip"]);
//       $country=" ($country)";
//     }
//     else $country="";
//     $text=str_replace("\r","<br />",$array_comment["text"]);
//     echo "
//     <div class='comments'>
//     <span class='date'>($array_comment[date])  </span>
//     <span class = 'author'>$array_comment[author]$country</span>
//     <p class = 'post'>... $text</p>
//     </div>";
//   }
//   while ($array_comment = mysql_fetch_array ($comment_query));
//   }
//   else {echo "<p class = 'comments'>Если вас заинтересовала данная информация, напишите свой комментарий.<br />
//   Предупреждение: Все комментарии оскорбительного характера будут удалены!</p>";}
// } // function printComments
