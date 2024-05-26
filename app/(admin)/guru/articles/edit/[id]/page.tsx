import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import FormEditArticle from '@/components/admin/FormEditArticle/FormEditArticle';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Titles/Title';
import { getArticleAndCatDb } from '@/controllers/admin.controller';
import { EUrlAdminParam, EUrlBaseParam } from '@/models/url.model';
import Link from 'next/link';
import * as React from 'react';

interface IParams {
  params: { id: string };
}
const Page = async ({ params: { id } }: IParams) => {
  const dbResult = await getArticleAndCatDb(id);

  return dbResult instanceof Error ? (
    <EmptyData description={dbResult.message} />
  ) : (
    <>
      <BreadCrumbServer
        breadCrumbList={[
          {
            title: 'Article list',
            href: `${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.ARTICLES_EDIT}/edit`,
          },
        ]}
      />
      <Title className="flex flex-col">
        Edit Article:
        <Link
          className="text-xl"
          target="_blank"
          href={`/${EUrlBaseParam.ARTICLE}/${dbResult[0][0].cpu}`}
        >
          {dbResult[0][0].title} 🔗
        </Link>
      </Title>
      <FormEditArticle
        initialData={dbResult}
        articleId={id}
        revalidateUrl={`/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.ARTICLES_EDIT}/edit/${id}`}
        editorApiKey={process.env.TINY_MCE_API_KEY || ''}
      />
    </>
  );
};

export default Page;
