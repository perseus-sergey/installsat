import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import FormEditChannel from '@/components/admin/FormEditArticle/FormEditChannel';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import GrooveLine from '@/components/ui/GrooveLine';
import { Title } from '@/components/ui/Titles/Title';
import { getEditDbChannel } from '@/controllers/admin.controller';
import { EUrlAdminParam, EUrlBaseParam } from '@/models/url.model';
import Link from 'next/link';
import * as React from 'react';

interface IParams {
  params: { id: string };
}
const Page = async ({ params: { id } }: IParams) => {
  const dbResult = await getEditDbChannel(id);
  if (dbResult instanceof Error)
    return <EmptyData description={dbResult.message} />;

  const productionHref = `/${EUrlBaseParam.CHANNEL_PARAMS}/${dbResult[1][0].chan_slug}`;

  const Breadcrumbs = () => (
    <BreadCrumbServer
      hasHomeLink={false}
      breadCrumbList={[
        {
          title: 'Channel list',
          href: `${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.CHANNELS_EDIT}/edit`,
        },
        {
          title: dbResult[1][0].title,
          href: productionHref,
        },
      ]}
    />
  );

  return (
    <>
      <Breadcrumbs />
      <Title className="flex flex-col">
        Edit Channel:
        <Link className="text-xl" target="_blank" href={productionHref}>
          {dbResult[1][0].title} 🔗
        </Link>
      </Title>
      <FormEditChannel
        initialData={dbResult}
        channelId={id}
        revalidateUrl={[
          `/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.CHANNELS_EDIT}/edit/${id}`,
          `/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.CHANNELS_EDIT}/edit`,
        ]}
        editorApiKey={process.env.TINY_MCE_API_KEY || ''}
      />
      <GrooveLine />
      <Breadcrumbs />
    </>
  );
};

export default Page;
