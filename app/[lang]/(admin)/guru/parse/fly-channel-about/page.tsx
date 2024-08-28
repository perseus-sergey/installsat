import { Title } from '@/components/ui/Titles/Title';
import { TSearchParams } from '@/models/ui.model';
// import { EDBTableTitles, TSearchParams } from '@/models/ui.model';
import Link from 'next/link';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { EUrlSearchParam } from '@/models/url.model';
import React from 'react';
import { PARSE_URL_BASE } from '@/cron/libs/parseFlySat.controller.mjs';

export const dynamic = 'force-dynamic';

// =================================================================
//
// Change lang_id to languages in all flyChannels queries
// Localize all request which includes Channel THEME
// Try to get info about channel and it genre from gpt
// Add ads.txt
// Remove Ezoic & add google consent mode
// Remove console logging from production parsers (mjs & tsx)
// Change all Link to SeoLink
// Make mjs fly sat & channels parser
// Add cluster choice
// add valid description to StartArticleSections
// change all reactSelects
// add color description to channel filters
// improve similar channels & similar articles blocks
// add comment block to fly channels with separate db tbl (fly_comments_channel))
// Parse biss from lugasat (Or satsat.info) by sat grade & frequency & title
// refresh email in production
// add json-ld
// add image generator
// =================================================================

const isProductionMode = process.env.NODE_ENV === 'production';

const IS_LOGGED = !isProductionMode;
// const { FLY_CHANNELS } = EDBTableTitles;

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
  const urlChannelTitle = validSearchParam(
    EUrlSearchParam.CHANNEL,
    searchParams
  );

  if (!urlChannelTitle) {
    addMessage(
      `ERROR: searchParams"${EUrlSearchParam.CHANNEL}" = "${searchParams?.[EUrlSearchParam.CHANNEL]}"`
    );

    return null;
  }

  const sourceUrl = `${PARSE_URL_BASE}${urlChannelTitle}`;

  // const report = await parseFlyChannels({ urlChannelTitle });

  // const {
  //   parseChannelMessages,
  //   updateResCount,
  //   currTblShouldUpdChannels,
  //   shouldUpdChannels,
  //   removeResCount,
  //   shouldDeleteChannels,
  //   parsedNewChannels,
  //   insertCount,
  // } = report;

  // messages.push(...parseChannelMessages);

  return (
    <>
      <Title>
        <Link href={sourceUrl}>Add Description to Fly Channel</Link>
      </Title>

      <MessageBlock messages={messages} />

      <ul>
        {/* <li>
          <h3 className="font-bold text-blue-700 text-xl">Genre</h3>
          <div>{genre}</div>
        </li>
        <li>
          <h3 className="font-bold text-blue-700 text-xl">Language(s)</h3>
          <div>{language}</div>
        </li>
        <li>
          <h3 className="font-bold text-blue-700 text-xl">Official Site</h3>
          <div>{offSite}</div>
        </li>
        <li>
          <h3 className="font-bold text-blue-700 text-xl">Description EN</h3>
          <div>{descriptionEn}</div>
        </li>
        <li>
          <h3 className="font-bold text-blue-700 text-xl">Description UA</h3>
          <div>{descriptionUa}</div>
        </li>
        <li>
          <h3 className="font-bold text-blue-700 text-xl">Text UA</h3>
          <div>{textUa}</div>
        </li>
        <li>
          <h3 className="font-bold text-blue-700 text-xl">Text EN</h3>
          <div>{textEn}</div>
        </li> */}
      </ul>
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
