import { Title } from '@/components/ui/Titles/Title';
import * as React from 'react';
import { poolExecute } from '@/libs/db/mysqldb';
import { EDBTableTitles } from '@/models/ui.model';
import { ResultSetHeader } from 'mysql2';
import { DEFAULT_ARTICLE_LOGO_NAME } from '@/models/articles.model';

interface IArticle {
  originalTitle: string;
  originalSource: string;
  originalSlug: string;
  originalText: string;
  enAiTitle: string;
  uaAiTitle: string;
  enAiContent: string;
  uaAiContent: string;
  enAiDescription: string;
  uaAiDescription: string;
  enAiKeywords: string;
  uaAiKeywords: string;
  aiSlug: string;
  category: string;
}

const isProductionMode = process.env.NODE_ENV === 'production';
const IS_LOGGED = !isProductionMode;

const { ARTICLE: ARTICLE_TBL } = EDBTableTitles;

let messages: string[] = [];

const addMessage = (message: string, error?: Error) => {
  messages.push(`${message}${error ? `: ${error.message}` : ''}`);
  if (IS_LOGGED)
    console.log(`🚀 ~ ${message}${error ? ` ERROR: ${error}` : ''}`);
};

const insertDataToDB = async (v: IArticle) => {
  const dateNow = new Date().toLocaleDateString('en-CA');

  const sql = `
      INSERT INTO ${ARTICLE_TBL} 
      (\`original_slug\`,\`source\`, \`title_en\`, \`title\`, \`text_en\`, \`text\`, \`description_en\`, \`description\`, \`keywords_en\`, \`keywords\`, \`cpu\`, \`cat\`, \`date\`, \`date_upd\`, \`logo\`)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
  const res = await poolExecute<ResultSetHeader>(sql, [
    v.originalSlug,
    v.originalSource,
    v.enAiTitle,
    v.uaAiTitle,
    v.enAiContent,
    v.uaAiContent,
    v.enAiDescription,
    v.uaAiDescription,
    v.enAiKeywords,
    v.uaAiKeywords,
    v.aiSlug,
    v.category,
    dateNow,
    dateNow,
    DEFAULT_ARTICLE_LOGO_NAME,
  ]);

  return res instanceof Error
    ? res
    : `DB SUCCESS! inserted article: ${v.originalSource}`;
};
export default async function Page() {
  const newArticles = {
    originalSource: 'originalSource',
    originalSlug: 'originalSlug',
    originalTitle: 'originalTitle',
    originalText: 'originalText',
    enAiTitle: 'enAiTitle',
    uaAiTitle: 'uaAiTitle',
    enAiContent: 'enAiContent',
    uaAiContent: 'uaAiContent',
    enAiDescription: 'enAiDescription',
    uaAiDescription: 'uaAiDescription',
    enAiKeywords: 'enAiKeywords',
    uaAiKeywords: 'uaAiKeywords',
    aiSlug: 'aiSlug',
    category: '5',
  };

  try {
    const insertToDbRes = await insertDataToDB(newArticles);
    insertToDbRes instanceof Error
      ? addMessage('ERROR: DB INSERT', insertToDbRes)
      : addMessage(insertToDbRes);
  } catch (error) {
    addMessage(
      'ERROR: failed during processing',
      error instanceof Error ? error : new Error('Unknown error occurred')
    );
  }

  return (
    <>
      <Title>TRY Page</Title>
      {messages.length > 0 && (
        <>
          <h2>Messages:</h2>
          <ul>
            {messages.map((message, i) => (
              <li key={i}>{message}</li>
            ))}
          </ul>
        </>
      )}
      <pre>{JSON.stringify(newArticles, null, 2)}</pre>
    </>
  );
}

export const dynamic = 'force-dynamic';
