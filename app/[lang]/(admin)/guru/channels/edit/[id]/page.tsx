import Link from 'next/link';
import * as React from 'react';

import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';
import FormEditChannel from '@/components/admin/FormEditArticle/FormEditChannel';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import GrooveLine from '@/components/ui/GrooveLine';
import { Title } from '@/components/ui/Titles/Title';
import { getEditDbChannel } from '@/controllers/admin.controller';
import { getELangKey } from '@/libs/utils/getLanguage';
import { EUrlBaseParam } from '@/models/url/url.model';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';
import { EUrlSearchParam } from '@/models/url/urlSearch.model';

interface IParams {
  params: { [key in EUrlAdminParam | EUrlBaseParam]: string };
}

const Page = async ({ params }: IParams) => {
  const id = params[EUrlAdminParam.ID];
  const lang = getELangKey(params[EUrlBaseParam.LANG]);

  const dbResult = await getEditDbChannel(id);
  if (dbResult instanceof Error)
    return <EmptyData lang={lang} description={dbResult.message} />;

  const productionHref = `/${lang}/${EUrlBaseParam.CHANNEL_PARAMS}/${dbResult[1][0].chan_slug}`;
  const editHref = `${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.CHANNELS_EDIT}/edit`;

  const Breadcrumbs = () => (
    <BreadCrumbServer
      lang={lang}
      hasHomeLink={false}
      breadCrumbList={[
        {
          title: 'Channel list',
          href: editHref,
        },
        {
          title: dbResult[1][0].title,
          href: `${editHref}?${EUrlSearchParam.ARTICLE}=${dbResult[1][0].title}`,
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
          `/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.CHANNELS_EDIT}/edit/${id}`,
          `/${lang}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.CHANNELS_EDIT}/edit`,
        ]}
        editorApiKey={process.env.TINY_MCE_API_KEY || ''}
      />
      <GrooveLine />
      <Breadcrumbs />
    </>
  );
};

export default Page;
