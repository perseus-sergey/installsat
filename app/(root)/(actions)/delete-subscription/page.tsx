import DeleteCommentSubscription from '@/components/DeleteCommentSubscription/DeleteCommentSubscription';
import { Title } from '@/components/ui/Title/Title';
import { decrypt } from '@/libs/utils/decrypt';
import { getFormattedDateStr } from '@/libs/utils/utils';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { COMMENTS_MODEL } from '@/models/comments.model';
import {
  DEFAULT_META_DATA,
  EDBTableTitles,
  LANGUAGE,
  TSearchParams,
} from '@/models/ui.model';
import { EUrlBaseParam, EUrlSearchParam } from '@/models/url.model';
import { Metadata } from 'next';

const emailKey = process.env.MAIL_ENCRYPT_KEY || '';
const BASE_URL = process.env.BASE_URL || '';

const {
  deleteSubscriptionPage: {
    meta: { title, description, keywords },
    h1,
  },
} = COMMENTS_MODEL;
export interface IPageParams {
  searchParams?: TSearchParams;
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title,
  description,
  keywords,
  openGraph: {
    ...DEFAULT_META_DATA.openGraph,
    title,
    description,
    url: `${BASE_URL}/${EUrlBaseParam.DELETE_COMMENT_SUBSCRIPTION}`,
    publishedTime: getFormattedDateStr(new Date()),
  },
};

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

  return (
    <>
      <Title style={{ flexDirection: 'column' }}>
        {h1[LANGUAGE]}
        <br />
        <span style={{ color: '#d30084', fontSize: '0.7em' }}>{mail}</span>
      </Title>
      <DeleteCommentSubscription
        articleTitle={articleTitle}
        articleId={await decrypt(articleIdEncrypted, emailKey)}
        commentDbTable={
          (await decrypt(commentDbTableEncrypted, emailKey)) as EDBTableTitles
        }
        mail={mail}
      />
    </>
  );
}
