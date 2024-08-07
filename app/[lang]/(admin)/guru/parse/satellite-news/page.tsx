import { Title } from '@/components/ui/Titles/Title';
import { EUrlAdminParam } from '@/models/url.model';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as React from 'react';
import puppeteer, { Browser } from 'puppeteer';
import * as cheerio from 'cheerio';
import {
  getContentFromPuppeteerBrowser,
  killChromeProcesses,
} from '@/controllers/parse.controller';
import { poolExecute } from '@/libs/db/mysqldb';
import { EDBTableTitles, getDbTableLink } from '@/models/ui.model';
import { ResultSetHeader } from 'mysql2';
import { sendMail } from '@/libs/mail/sendMail';
import { renderAsync } from '@react-email/render';
import { ParseTransNews } from '@/components/EmailTemplates/parseTransNews.template';
import { DEFAULT_ARTICLE_LOGO_NAME } from '@/models/articles.model';
import {
  SOURCE_ARTICLE_PARAMS,
  extractAiArticleDataFromAiHTML,
  getChangedSatNews,
} from '@/ai-prompts/parseSatNews.prompt.mjs';

// =================================================================
// check logo in email
// add json-ld
// add description into article
// add data tag to article and list of articles
// add image generator
// =================================================================

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

const IS_LOGGED = true;
const BASE_URL = process.env.BASE_URL;
const isProductionMode = process.env.NODE_ENV === 'production';
const BASE_GURU_PATH = `${BASE_URL}/en/${EUrlAdminParam.BASE_PATH}`;
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

const getLastSlugsFromDB = async () => {
  const sql = `SELECT original_slug FROM ${ARTICLE_TBL} ORDER BY id DESC LIMIT 20`;
  const res = await poolExecute<{ original_slug: string }[]>(sql);

  if (res instanceof Error)
    throw new Error(`DB SELECT last SLUGs: ${res.message}`);

  return res;
};

const generateAiText = async (originalText: string) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = getChangedSatNews(originalText);

  const result = await model.generateContent(prompt);
  const response = result.response;

  return response.text();
};

const extractOriginalArticle = (
  $: cheerio.CheerioAPI,
  h1Selector: string,
  contentSelector: string
) => {
  const articleTitle = $(h1Selector).text();

  if (!articleTitle)
    return `ERROR: cannot extract article TITLE. Selector: '${h1Selector}'. $(${h1Selector}): ${$(h1Selector).html()}'`;

  const articleText: string[] = [];
  $(contentSelector).each((_, elem) => {
    articleText.push($(elem).text());
  });

  if (!articleText.length)
    return `ERROR: cannot extract article CONTENT. Selector: '${contentSelector}'.'`;
  const articleContent = articleText.join(' ');

  return { articleTitle, articleContent };
};

const sendReportMail = async (messages: string[]) => {
  await sendMail({
    subject: `Parse Satellite news`,
    body: await renderAsync(
      <ParseTransNews
        title="Parse Satellite News"
        pathToMainParsePage={`${BASE_GURU_PATH}/${EUrlAdminParam.PARSE}`}
        dbTableHref={getDbTableLink(ARTICLE_TBL)}
        errorMessages={messages}
        hrefSources={SOURCE_ARTICLE_PARAMS.map((s) => s.url)}
      />
    ),
  });
};

const getOriginalArticleSlug = (
  link: string,
  lastSlugsInDB: {
    original_slug: string;
  }[]
) => {
  const slug = link.split('/').filter(Boolean).pop();

  if (!slug) {
    addMessage(`Cannot extract main links from ${link}`);

    return null;
  } else if (lastSlugsInDB.some((item) => item.original_slug === slug)) {
    addMessage(
      `WARNING: Article with SLUG: ${slug} already exists in table ${ARTICLE_TBL}`
    );

    return null;
  }

  return slug;
};

export default async function Page() {
  let browser: Browser | null = null;
  let mainLinks: string[] | string = '';
  const newArticles: IArticle[] = [];

  try {
    const lastSlugsInDB = await getLastSlugsFromDB();

    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    for (const source of SOURCE_ARTICLE_PARAMS) {
      const mainPageHtml = await getContentFromPuppeteerBrowser(
        browser,
        source.url
      );
      const mainPage$ = cheerio.load(mainPageHtml);

      mainLinks = source.extractMainLinks(mainPage$);
      if (mainLinks.length === 0) {
        throw new Error('Cannot extract main links');
      } else if (typeof mainLinks === 'string') {
        throw new Error(mainLinks);
      }

      for (const link of mainLinks) {
        const articleSlug = getOriginalArticleSlug(link, lastSlugsInDB);
        if (!articleSlug) continue;

        const html = await getContentFromPuppeteerBrowser(browser, link);
        const $ = cheerio.load(html);
        const extractArticleResult = extractOriginalArticle(
          $,
          source.h1Selector,
          source.contentSelector
        );
        if (typeof extractArticleResult === 'string') {
          addMessage(`${extractArticleResult} Article: ${link}`);
          continue;
        }

        const aiArticleHtml = await generateAiText(
          extractArticleResult.articleContent
        );

        const extractedAiData = extractAiArticleDataFromAiHTML(
          cheerio.load(aiArticleHtml)
        );
        if (typeof extractedAiData === 'string') {
          addMessage(`${extractedAiData}. Article: ${link}`);
          continue;
        }

        const newArticle = {
          originalTitle: extractArticleResult.articleTitle,
          originalSlug: articleSlug,
          originalText: extractArticleResult.articleContent,
          originalSource: link,
          ...extractedAiData,
        };

        // newArticles.push({
        //   originalTitle: extractArticleResult.articleTitle,
        //   originalSlug: articleSlug,
        //   originalText: extractArticleResult.articleContent,
        //   originalSource: link,
        //   ...extractedAiData,
        // });

        const insertToDbRes = await insertDataToDB(newArticle);
        insertToDbRes instanceof Error
          ? addMessage('ERROR: DB INSERT', insertToDbRes)
          : addMessage(insertToDbRes);

        // await sleep(500);
        newArticles.push(newArticle);
      }
    }

    if (newArticles.length === 0)
      throw new Error('New Articles Array is empty');
  } catch (error) {
    addMessage(
      'ERROR: failed during processing',
      error instanceof Error ? error : new Error('Unknown error occurred')
    );
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        addMessage(
          'ERROR closing browser',
          closeError instanceof Error
            ? closeError
            : new Error('Error closing browser')
        );
      }
    }
    isProductionMode && killChromeProcesses();
  }

  await sendReportMail(messages);

  return (
    <>
      <Title>Welcome to NewsCast Page</Title>
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
      {/* {newArticles.length > 0 && (
        <>
          <h2 className="text-center text-green-600 text-xl">New Articles:</h2>
          {newArticles.map((article) => (
            <React.Fragment key={article.originalTitle}>
              <h3 className="text-center text-blue-700 text-xl border-b">
                {article.originalTitle}
              </h3>
              <p>
                <b>Original Slug: </b>
                {article.originalSlug}
              </p>
              <p>
                <b>Original HTML: </b>
                {article.originalText}
              </p>
              <p>
                <b>Date: </b>
                {article.date.toLocaleDateString('en-CA')}
              </p>
            </React.Fragment>
          ))}
        </>
      )} */}

      {/* {response} */}
      {/* <DangerHtml text={aiText} /> */}
      <pre>{JSON.stringify(newArticles, null, 2)}</pre>
    </>
  );
}

export const dynamic = 'force-dynamic';
