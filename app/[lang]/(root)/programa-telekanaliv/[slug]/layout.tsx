import { ReactNode } from 'react';
import { EUrlBaseParam } from '@/models/url/url.model';
import { getChannelsWithSchedule } from '@/controllers/siteMap.controller';

export async function generateStaticParams() {
  const res = await getChannelsWithSchedule();

  return res.map((item) => ({ [EUrlBaseParam.SLUG]: item.cpu }));
}

export const dynamicParams = true;

export default ({ children }: { children: ReactNode }) => children;
