import { Title } from '@/components/ui/Titles/Title';
import { TSearchParams } from '@/models/ui.model';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { EUrlSearchParam } from '@/models/url.model';
import React from 'react';
import {
  generateChannelAbout,
  updateGeneratedDataDB,
} from '@/cron/libs/flyChannelAbout.controller.mjs';
import { EDBTableTitles } from '@/cron/libs/commons.mjs';
import { poolExecute } from '@/libs/db/mysqldb';

export const dynamic = 'force-dynamic';

const { FLY_CHANNELS } = EDBTableTitles;

const findChannelInDb = async (channelTitle: string) => {
  const sql = `
      SELECT id FROM ${FLY_CHANNELS} WHERE title = ? LIMIT 1
    `;
  const res = await poolExecute<{ id: number }[]>(sql, [channelTitle]);

  return res instanceof Error
    ? res
    : res.length === 0
      ? new Error(`ERROR: Channel "${channelTitle}" not found in database`)
      : res;
};

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const urlChannelTitle = validSearchParam(
    EUrlSearchParam.CHANNEL,
    searchParams
  ).trim();

  if (!urlChannelTitle) {
    return (
      <p className="text-xl text-red-500 font-bold">
        ERROR: searchParams {EUrlSearchParam.CHANNEL} ={' '}
        {searchParams?.[EUrlSearchParam.CHANNEL]}
      </p>
    );
  }

  const checkChanInDb = await findChannelInDb(urlChannelTitle);
  if (checkChanInDb instanceof Error)
    return (
      <p className="text-xl text-red-500 font-bold">{checkChanInDb.message}</p>
    );

  const generatedData = await generateChannelAbout(urlChannelTitle);

  if (typeof generatedData === 'string')
    return <p className="text-xl text-red-500 font-bold">{generatedData}</p>;

  const insertToDbRes = await updateGeneratedDataDB(
    generatedData,
    urlChannelTitle
  );

  if (insertToDbRes instanceof Error)
    return (
      <p className="text-xl text-red-500 font-bold">{`ERROR: DB INSERT for channel "${urlChannelTitle}". Error message: ${insertToDbRes}`}</p>
    );

  return (
    <>
      <Title>Add Description to Fly Channel</Title>

      <p className="text-xs">
        <b>Updated channels: </b>
        {insertToDbRes}
      </p>

      <pre>{JSON.stringify(generatedData, null, 2)}</pre>
    </>
  );
}
