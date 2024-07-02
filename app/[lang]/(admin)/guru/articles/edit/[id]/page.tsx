import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import FormEditArticle from '@/components/admin/FormEditArticle/FormEditArticle';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import GrooveLine from '@/components/ui/GrooveLine';
import { Title } from '@/components/ui/Titles/Title';
import { getArticleAndCatDb } from '@/controllers/admin.controller';
import { getELangKey } from '@/libs/utils/validSearchParam';
import { EUrlAdminParam, EUrlBaseParam } from '@/models/url.model';
import Link from 'next/link';
import * as React from 'react';

interface IParams {
  params: { [key in EUrlAdminParam | EUrlBaseParam]: string };
}

const Page = async ({ params }: IParams) => {
  const id = params[EUrlAdminParam.ID];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const dbResult = await getArticleAndCatDb(id);
  if (dbResult instanceof Error)
    return <EmptyData lang={lang} description={dbResult.message} />;

  const articleHref = `/${lang}/${EUrlBaseParam.ARTICLE}/${dbResult[0][0].cpu}`;

  const Breadcrumbs = () => (
    <BreadCrumbServer
      lang={lang}
      hasHomeLink={false}
      breadCrumbList={[
        {
          title: 'Article list',
          href: `/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.ARTICLES_EDIT}/edit`,
        },
        {
          title: dbResult[0][0].title,
          href: articleHref,
        },
      ]}
    />
  );

  return (
    <>
      <Breadcrumbs />
      <Title className="flex flex-col">
        Edit Article:
        <Link className="text-xl" target="_blank" href={articleHref}>
          {dbResult[0][0].title} 🔗
        </Link>
      </Title>
      <FormEditArticle
        initialData={dbResult}
        articleId={id}
        revalidateUrl={`/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.ARTICLES_EDIT}/edit/${id}`}
        editorApiKey={process.env.TINY_MCE_API_KEY || ''}
      />
      <GrooveLine />
      <Breadcrumbs />
    </>
  );
};

export default Page;
