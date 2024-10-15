import Link from 'next/link';
import * as React from 'react';

import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import FormEditArticle from '@/components/admin/FormEditArticle/FormEditArticle';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import GrooveLine from '@/components/ui/GrooveLine';
import { Title } from '@/components/ui/Titles/Title';
import { getArticleAndCatDb } from '@/controllers/admin.controller';
import { getELangKey } from '@/libs/utils/getLanguage';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';
import { EUrlBaseParam } from '@/models/url/url.model';
import { EUrlSearchParam } from '@/models/url/urlSearch.model';

interface IParams {
  params: { [key in EUrlAdminParam | EUrlBaseParam]: string };
}

const Page = async ({ params }: IParams) => {
  const id = params[EUrlAdminParam.ID];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const dbResult = await getArticleAndCatDb(id);
  if (dbResult instanceof Error)
    return <EmptyData lang={lang} description={dbResult.message} />;

  const productionHref = `/${lang}/${EUrlBaseParam.ARTICLE}/${dbResult[0][0].cpu}`;
  const editHref = `${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.ARTICLES_EDIT}/edit`;

  const Breadcrumbs = () => (
    <BreadCrumbServer
      lang={lang}
      hasHomeLink={false}
      breadCrumbList={[
        {
          title: 'Article list',
          href: editHref,
        },
        {
          title: dbResult[0][0].title,
          href: `${editHref}?${EUrlSearchParam.ARTICLE}=${dbResult[0][0].title}`,
        },
      ]}
    />
  );

  return (
    <>
      <Breadcrumbs />
      <Title className="flex flex-col">
        Edit Article:
        <Link className="text-xl" target="_blank" href={productionHref}>
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
