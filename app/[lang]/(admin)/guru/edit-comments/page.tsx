import DeleteItemButton from '@/components/admin/DeleteItemButton/DeleteItemButton';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Titles/Title';
import TooltipSimple from '@/components/ui/tooltips/TooltipSimple/TooltipSimple';
import { getComments } from '@/controllers/comments.controller';
import { decrypt } from '@/libs/utils/decrypt';
import { makeUrlSearchParams } from '@/libs/utils/utils';
import { getELangKey, validSearchParam } from '@/libs/utils/validSearchParam';
import { EDBTableTitles, TSearchParams } from '@/models/ui.model';
import {
  EUrlAdminParam,
  EUrlBaseParam,
  EUrlSearchParam,
} from '@/models/url.model';
import Link from 'next/link';

const { BASE_PATH, EDIT_COMMENT } = EUrlAdminParam;

const emailKey = process.env.MAIL_ENCRYPT_KEY || '';

export interface IPageParams {
  params: { [key in EUrlAdminParam | EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

export default async function Page({ searchParams, params }: IPageParams) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);
  if (!searchParams)
    return <EmptyData lang={lang} description="Wrong Url Search Params!" />;

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
    return <EmptyData lang={lang} description="Wrong Url Search Params!" />;

  const comments = await getComments(commentDbTable, articleId);

  if (comments instanceof Error)
    return <EmptyData lang={lang} description={comments.message} />;

  return (
    <>
      <Title>Edit comments for page</Title>
      <table>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td className="border border-slate-400 py-px px-2">
                {comment.author}
              </td>
              <td className="border border-slate-400 py-px px-2">
                {comment.ip}
              </td>
              <td className="border border-slate-400 py-px px-2">
                {comment.text}
              </td>
              <td className="text-center border border-slate-400 py-px px-2">
                <TooltipSimple tooltipText="Edit comment">
                  <Link
                    href={`/${lang}/${BASE_PATH}/${EDIT_COMMENT}/${comment.id}?${makeUrlSearchParams(searchParams).toString()}`}
                    style={{ fontSize: '1.5rem', color: 'green' }}
                  >
                    ✐
                  </Link>
                </TooltipSimple>
              </td>
              <td className="text-center border border-slate-400 py-px px-2">
                <DeleteItemButton
                  itemID={`${comment.id}`}
                  dbTableName={commentDbTable}
                  revalidateUrl={`/${lang}/${BASE_PATH}/${EDIT_COMMENT}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
