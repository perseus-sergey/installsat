import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Title/Title';
import { deleteSubscriptionEmail } from '@/controllers/comments.controller';
import { validSearchParam } from '@/libs/utils';
import { decrypt } from '@/libs/utilsServer';
import { TSearchParams } from '@/models/ui.model';
import { EUrlSearchParam } from '@/models/url.model';

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
  const mail = validSearchParam(
    EUrlSearchParam.COMMENT_DEL_AUTHOR_EMAIL,
    searchParams
  );
  const articleTitle = validSearchParam(
    EUrlSearchParam.COMMENT_DEL_ARTICLE_NAME,
    searchParams
  );

  const articleId = await decrypt(articleIdEncrypted, emailKey);
  const commentDbTable = await decrypt(commentDbTableEncrypted, emailKey);

  const delResult = await deleteSubscriptionEmail(
    commentDbTable,
    articleId,
    mail
  );

  if (delResult instanceof Error)
    return <EmptyData description={delResult.message} />;

  return (
    <>
      <Title>Видалення підписки</Title>
      <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
        Вашу E-Mail адресу <span style={{ color: '#d30084' }}>{mail}</span> було
        вдало видалено із розсилки оновлень коментарів до сторінки
        <br />✧{articleTitle}✧
      </p>
    </>
  );
}
