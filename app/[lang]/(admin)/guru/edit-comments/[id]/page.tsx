import EditComment from '@/components/admin/EditComment/EditComment';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Titles/Title';
import { getCommentFromDB } from '@/controllers/comments.controller';
import { decrypt } from '@/libs/utils/decrypt';
import { getELangKey } from '@/libs/utils/getLanguage';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { EUrlBaseParam } from '@/models/url/url.model';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';
import { makeUrlSearchParams } from '@/libs/utils/urlMaker';
import { EDBTableTitles } from '@/models/dbTblNames.model';

const emailKey = process.env.MAIL_ENCRYPT_KEY || '';

const { BASE_PATH, EDIT_COMMENT } = EUrlAdminParam;

interface IPageParams {
  params: { [_key in EUrlAdminParam | EUrlBaseParam]: string };
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
