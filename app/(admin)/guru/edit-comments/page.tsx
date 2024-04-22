import DeleteComment from '@/components/admin/DeleteComment/DeleteComment';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Title/Title';
import TooltipSimple from '@/components/ui/TooltipSimple/TooltipSimple';
import { getComments } from '@/controllers/comments.controller';
import { validSearchParam } from '@/libs/utils';
import { decrypt } from '@/libs/utilsServer';
import { TSearchParams } from '@/models/ui.model';
import { EUrlAdminParam, EUrlSearchParam } from '@/models/url.model';
import Link from 'next/link';

const emailKey = process.env.MAIL_ENCRYPT_KEY || '';

export interface IPageParams {
  searchParams?: TSearchParams;
}

export default async function Page({ searchParams }: IPageParams) {
  const articleIdEncrypted = validSearchParam(
    EUrlSearchParam.COMMENT_DEL_ARTICLE_ID,
    searchParams
  );
  const commentDbTableEncrypted = validSearchParam(
    EUrlSearchParam.COMMENT_DEL_DB_TABLE,
    searchParams
  );

  const articleId = await decrypt(articleIdEncrypted, emailKey);
  const commentDbTable = await decrypt(commentDbTableEncrypted, emailKey);

  const comments = await getComments(commentDbTable, +articleId);

  if (comments instanceof Error)
    return <EmptyData description={comments.message} />;

  // const onDeleteComment = async (_e: MouseEvent, commentID: number) => {
  //   await deleteComment(commentDbTable, `${commentID}`);

  //   // if (delCommentResult instanceof Error)
  //   //   return fromErrorToFormState(delCommentResult.message);

  //   revalidatePath(
  //     `/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.EDIT_COMMENT}`
  //   );
  // };

  return (
    <>
      <Title>Edit comments for page</Title>
      <table className="base-table">
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td>{comment.author}</td>
              <td>{comment.ip}</td>
              <td>{comment.text}</td>
              <td>
                <TooltipSimple tooltipText="Edit comment">
                  <Link
                    href={`&id=${comment.id}`}
                    style={{ fontSize: '1.5rem', color: 'green' }}
                  >
                    ✐
                  </Link>
                </TooltipSimple>
              </td>
              <td>
                <DeleteComment
                  commentID={`${comment.id}`}
                  dbTableName={commentDbTable}
                  revalidateUrl={`/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.EDIT_COMMENT}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
