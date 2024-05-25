import FormEditArticle from '@/components/admin/FormEditArticle/FormEditArticle';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { Title } from '@/components/ui/Titles/Title';
import { getArticleAndCatDb } from '@/controllers/admin.controller';
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
      <Title>Welcome Edit Article: {id}</Title>
      <FormEditArticle initialData={dbResult} />
    </>
  );
};

export default Page;
