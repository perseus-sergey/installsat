import EditComment from '@/components/admin/EditComment/EditComment';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Titles/Title';
import { getCommentFromDB } from '@/controllers/comments.controller';
import { decrypt } from '@/libs/utils/decrypt';
import { makeUrlSearchParams } from '@/libs/utils/utils';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { EDBTableTitles, TSearchParams } from '@/models/ui.model';
import { EUrlAdminParam, EUrlSearchParam } from '@/models/url.model';

const emailKey = process.env.MAIL_ENCRYPT_KEY || '';

const { BASE_PATH, EDIT_COMMENT } = EUrlAdminParam;

interface IPageParams {
  params: { id: string };
  searchParams?: TSearchParams;
}

export default async function Page({
  searchParams,
  params: { id },
}: IPageParams) {
  if (!searchParams) return;

  const searchParamsUrl = makeUrlSearchParams(searchParams);

  const commentDbTableEncrypted = validSearchParam(
    EUrlSearchParam.COMMENT_DEL_DB_TABLE,
    searchParams
  );

  const commentDbTable = (await decrypt(
    commentDbTableEncrypted,
    emailKey
  )) as EDBTableTitles;

  const comment = await getCommentFromDB(commentDbTable, id);

  if (comment instanceof Error)
    return <EmptyData description={comment.message} />;

  return (
    <>
      <Title>Edit comment</Title>
      <EditComment
        text={comment[0].text}
        commentID={id}
        dbTableName={commentDbTable}
        revalidateUrl={`/${BASE_PATH}/${EDIT_COMMENT}?${searchParamsUrl.toString()}`}
      />
    </>
  );
}
