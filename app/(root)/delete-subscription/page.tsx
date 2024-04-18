import { Title } from '@/components/ui/Title/Title';
import { decrypt } from '@/libs/utilsServer';
import { TSearchParams } from '@/models/ui.model';
import { EUrlSearchParam } from '@/models/url.model';

const emailKey = process.env.MAIL_ENCRYPT_KEY || '';

export interface IPageParams {
  searchParams: TSearchParams;
}

const validSearchParam = (
  paramName: EUrlSearchParam,
  searchParams: TSearchParams
) =>
  searchParams &&
  searchParams[paramName] &&
  typeof searchParams[paramName] === 'string'
    ? (searchParams[paramName] as string)
    : '';

export default function Page({ searchParams }: IPageParams) {
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

  const articleId = decrypt(articleIdEncrypted, emailKey);
  const commentDbTable = decrypt(commentDbTableEncrypted, emailKey);

  return (
    <>
      <article className="article">
        <Title>Видалення підписки</Title>
        <p style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Вашу E-Mail адресу ${mail} було вдало видалено із розсилки оновлень
          коментарів до сторінки
          <br />✧{articleTitle}✧
        </p>
        <p>ID: {articleId}</p>
        <p>TBL: {commentDbTable}</p>
      </article>
    </>
  );
}
