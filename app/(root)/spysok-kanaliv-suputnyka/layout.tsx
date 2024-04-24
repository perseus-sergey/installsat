import CommentBlock from '@/components/comments/CommentBlock/CommentBlock';
import { getCommentsNumber } from '@/controllers/comments.controller';
import { META_CHANNEL } from '@/models/channel.model';
import { EDBTableTitles, LANGUAGE } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';

const { CHANNEL_LIST_DB_ID, getTitle } = META_CHANNEL;

export interface IParams {
  children: React.ReactNode;
}

export default async function layout({ children }: IParams) {
  const numberOfComments = await getCommentsNumber(
    EDBTableTitles.COMMENTS_PACKAGES,
    CHANNEL_LIST_DB_ID
  );

  return (
    <>
      <article className="article">{children}</article>
      <CommentBlock
        numberOfComments={numberOfComments}
        revalidateUrl={`/${EUrlBaseParam.SAT_CHANNEL_LIST}`}
        dbCommentTableName={EDBTableTitles.COMMENTS_PACKAGES}
        articleId={CHANNEL_LIST_DB_ID}
        articleName={getTitle()[LANGUAGE]}
      />
    </>
  );
}
