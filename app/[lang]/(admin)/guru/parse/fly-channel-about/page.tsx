import { Title } from '@/components/ui/Titles/Title';
import { TSearchParams } from '@/models/ui.model';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { EUrlSearchParam } from '@/models/url.model';
import React from 'react';
import {
  generateChannelAbout,
  updateGeneratedDataDB,
} from '@/cron/libs/flyChannelAbout.controller.mjs';
import { emptyChannelDescription } from '@cron/libs/generateChanAboutForOneSat.controller.mjs';
import { EDBTableTitles } from '@/cron/libs/commons.mjs';
import { poolExecute } from '@/libs/db/mysqldb';

export const dynamic = 'force-dynamic';

// =================================================================
// Generate AI description for extracted from urlSearchParams channel name and channel language (optional)
// If AI could not generate description, descriptions in db updates by empty fields,
//  but genre_id assigned 0.
// =================================================================

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

  const urlLanguage = validSearchParam(
    EUrlSearchParam.LANGUAGE_URL,
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

  const generatedData = await generateChannelAbout(
    urlChannelTitle,
    urlLanguage
  );

  const insertToDbRes = await updateGeneratedDataDB(
    typeof generatedData === 'string' ? emptyChannelDescription : generatedData,
    urlChannelTitle
  );

  if (insertToDbRes instanceof Error)
    return (
      <p className="text-xl text-red-500 font-bold">{`ERROR: DB INSERT for channel "${urlChannelTitle}". Error message: ${insertToDbRes}`}</p>
    );

  return (
    <>
      <Title>{`Add Description for channel "${urlChannelTitle}"`}</Title>

      <p className="text-xs">
        <b>Updated channels: </b>
        {insertToDbRes}
      </p>

      {typeof generatedData === 'string' ? (
        <p className="text-xl text-red-500 font-bold">{generatedData}</p>
      ) : null}

      {Object.entries(generatedData).map(([key, val]) => (
        <>
          <h2 className="text-center text-blue-700 text-xl" key={key}>
            {key}
          </h2>
          <div>{val}</div>
        </>
      ))}
    </>
  );
}
