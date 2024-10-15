import DeleteCommentSubscription from '@/components/DeleteCommentSubscription/DeleteCommentSubscription';
import { Title } from '@/components/ui/Titles/Title';
import { getFormattedDateStrYearFirst } from '@/libs/utils/dates';
import { decrypt } from '@/libs/utils/decrypt';
import { getELangKey } from '@/libs/utils/getLanguage';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { DELETE_SUBSCRIPTION_PAGE } from '@/models/ui/comments.model';
import { DEFAULT_META_DATA } from '@/models/defaultMeta.model';
import { Metadata } from 'next';
import { EUrlBaseParam, MAIN_URL } from '@/models/url/url.model';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';
import { EDBTableTitles } from '@/models/dbTblNames.model';

const emailKey = process.env.MAIL_ENCRYPT_KEY || '';
const BASE_URL = process.env.BASE_URL || MAIN_URL;

const {
  meta: { title, description, keywords },
  h1,
} = DELETE_SUBSCRIPTION_PAGE;
export interface IPageParams {
  params: { [key in EUrlBaseParam]: string };
  searchParams?: TSearchParams;
}

export const generateMetadata = ({ params }: IPageParams): Metadata => {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    keywords,
    openGraph: {
      ...DEFAULT_META_DATA.openGraph,
      title,
      description,
      url: `/${lang}/${EUrlBaseParam.DELETE_COMMENT_SUBSCRIPTION}`,
      publishedTime: getFormattedDateStrYearFirst(),
    },
  };
};

export default async function Page({ searchParams, params }: IPageParams) {
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

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
    <article className="article">
      <Title style={{ flexDirection: 'column' }}>
        {h1[lang]}
        <br />
        <span style={{ color: '#d30084', fontSize: '0.7em' }}>{mail}</span>
      </Title>
      <DeleteCommentSubscription
        lang={lang}
        articleTitle={articleTitle}
        articleId={await decrypt(articleIdEncrypted, emailKey)}
        commentDbTable={
          (await decrypt(commentDbTableEncrypted, emailKey)) as EDBTableTitles
        }
        mail={mail}
      />
    </article>
  );
}
