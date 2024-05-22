import DeleteComment from '@/components/admin/DeleteComment/DeleteComment';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Titles/Title';
import TooltipSimple from '@/components/ui/tooltips/TooltipSimple/TooltipSimple';
import { getComments } from '@/controllers/comments.controller';
import { decrypt } from '@/libs/utils/decrypt';
import { makeUrlSearchParams } from '@/libs/utils/utils';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { EDBTableTitles, TSearchParams } from '@/models/ui.model';
import { EUrlAdminParam, EUrlSearchParam } from '@/models/url.model';
import Link from 'next/link';

const { BASE_PATH, EDIT_COMMENT } = EUrlAdminParam;

const emailKey = process.env.MAIL_ENCRYPT_KEY || '';

export interface IPageParams {
  searchParams?: TSearchParams;
}
// =================================================================
// Remove /guru | /delete-subscription | /login from robots.txt
// =================================================================
// =================================================================
// Change remote .env
// ADMIN_EMAIL
// AUTH_SECRET
// AUTH_GITHUB_ID
// AUTH_GITHUB_SECRET
// =================================================================
export default async function Page({ searchParams }: IPageParams) {
  if (!searchParams) return;

  const articleIdEncrypted = validSearchParam(
    EUrlSearchParam.COMMENT_DEL_ARTICLE_ID,
    searchParams
  );
  const commentDbTableEncrypted = validSearchParam(
    EUrlSearchParam.COMMENT_DEL_DB_TABLE,
    searchParams
  );

  const articleId = await decrypt(articleIdEncrypted, emailKey);
  const commentDbTable = (await decrypt(
    commentDbTableEncrypted,
    emailKey
  )) as EDBTableTitles;

  if (!articleId || !commentDbTable)
    return <EmptyData description="Wrong Url Search Params!" />;

  const comments = await getComments(commentDbTable, articleId);

  if (comments instanceof Error)
    return <EmptyData description={comments.message} />;

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
              <td className="text-center">
                <TooltipSimple tooltipText="Edit comment">
                  <Link
                    href={`${BASE_PATH}/${EDIT_COMMENT}/${comment.id}?${makeUrlSearchParams(searchParams).toString()}`}
                    style={{ fontSize: '1.5rem', color: 'green' }}
                  >
                    ✐
                  </Link>
                </TooltipSimple>
              </td>
              <td className="text-center">
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
