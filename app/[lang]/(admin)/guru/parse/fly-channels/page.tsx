import { Title } from '@/components/ui/Titles/Title';
import { EDBTableTitles, TSearchParams } from '@/models/ui.model';
import Link from 'next/link';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { EUrlSearchParam } from '@/models/url.model';
import React from 'react';
import {
  PARSE_URL_BASE,
  parseFlyChannels,
} from '@/cron/libs/parseFlySat.controller.mjs';

export const dynamic = 'force-dynamic';

const isProductionMode = process.env.PRODUCTION_MODE === 'true';

const IS_LOGGED = !isProductionMode;
const { FLY_CHANNELS } = EDBTableTitles;

let messages: string[] = [];

const addMessage = (message: string, error?: Error) => {
  messages.push(`${message}${error ? `: ${error.message}` : ''}`);
  if (IS_LOGGED)
    console.log(`🚀 ~ ${message}${error ? ` ERROR: ${error}` : ''}`);
};

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const currentSatSlug = validSearchParam(EUrlSearchParam.SAT, searchParams);

  if (!currentSatSlug) {
    addMessage(
      `ERROR: searchParams"${EUrlSearchParam.SAT}" = "${searchParams?.[EUrlSearchParam.SAT]}"`
    );

    return null;
  }

  const sourceUrl = `${PARSE_URL_BASE}${currentSatSlug}`;

  const report = await parseFlyChannels({ currentSatSlug });

  const {
    parseChannelMessages,
    updateResCount,
    currTblShouldUpdChannels,
    shouldUpdChannels,
    removeResCount,
    shouldDeleteChannels,
    parsedNewChannels,
    insertCount,
  } = report;

  messages.push(...parseChannelMessages);

  const shows = [
    {
      id: 'upd-tbl-list',
      text: `Should Update Channels in table ${FLY_CHANNELS}. (${updateResCount} updated)`,
      array: currTblShouldUpdChannels,
    },
    {
      id: 'upd-all-list',
      text: `Should Update Channels ALL table ${FLY_CHANNELS}. (${updateResCount} updated)`,
      array: shouldUpdChannels,
    },
    {
      id: 'disable-list',
      text: `Should Disable Channels in table ${FLY_CHANNELS}. (${removeResCount} disabled)`,
      array: shouldDeleteChannels,
    },
    {
      id: 'new-list',
      text: `New Channels Found. (${insertCount} inserted)`,
      array: parsedNewChannels,
    },
  ];

  return (
    <>
      <Title>
        <Link href={sourceUrl}>Parse FlySat Channels Table</Link>
      </Title>

      <ul>
        {shows.map((show) => (
          <li key={show.id}>{show.text}</li>
        ))}
      </ul>

      <MessageBlock messages={messages} />

      {shows.map((item) => (
        <React.Fragment key={item.id}>
          <h2 className="text-2xl text-red-700 bg-blue-300" id={item.id}>
            {item.text}
          </h2>
          <pre>{JSON.stringify(item.array, null, 2)}</pre>
          <hr />
        </React.Fragment>
      ))}
    </>
  );
}

const MessageBlock = ({ messages }: { messages: string[] }) =>
  messages.length > 0 && (
    <>
      <h2 className="font-bold text-blue-700 text-xl">Messages:</h2>
      <ul>
        {messages.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    </>
  );
