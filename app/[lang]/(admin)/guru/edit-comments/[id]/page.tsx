import EditComment from '@/components/admin/EditComment/EditComment';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Titles/Title';
import { getCommentFromDB } from '@/controllers/comments.controller';
import { decrypt } from '@/libs/utils/decrypt';
import { makeUrlSearchParams } from '@/libs/utils/utils';
import { getELangKey, validSearchParam } from '@/libs/utils/validSearchParam';
import { EDBTableTitles, TSearchParams } from '@/models/ui.model';
import {
  EUrlAdminParam,
  EUrlBaseParam,
  EUrlSearchParam,
} from '@/models/url.model';

const emailKey = process.env.MAIL_ENCRYPT_KEY || '';

const { BASE_PATH, EDIT_COMMENT } = EUrlAdminParam;

interface IPageParams {
  params: { [key in EUrlAdminParam | EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

export default async function Page({ searchParams, params }: IPageParams) {
  if (!searchParams) return;
  const id = params[EUrlAdminParam.ID];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

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
    return <EmptyData lang={lang} description={comment.message} />;

  return (
    <>
      <Title>Edit comment</Title>
      <EditComment
        text={comment}
        commentID={id}
        dbTableName={commentDbTable}
        revalidateUrl={`/${lang}/${BASE_PATH}/${EDIT_COMMENT}?${searchParamsUrl.toString()}`}
      />
    </>
  );
}
