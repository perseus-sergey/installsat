import { Title } from '@/components/ui/Titles/Title';
import { EUrlAdminParam, EUrlSearchParam } from '@/models/url.model';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as React from 'react';
import puppeteer, { Browser } from 'puppeteer';
import * as cheerio from 'cheerio';
import {
  getContentFromPuppeteerBrowser,
  killChromeProcesses,
} from '@/controllers/parse.controller';
import { poolExecute } from '@/libs/db/mysqldb';
import {
  EDBTableTitles,
  TSearchParams,
  getDbTableLink,
} from '@/models/ui.model';
import { ResultSetHeader } from 'mysql2';
import { sendMail } from '@/libs/mail/sendMail';
import { renderAsync } from '@react-email/render';
import { ParseSatNewsTemplate } from '@/components/EmailTemplates/parseTransNews.template';
import { DEFAULT_ARTICLE_LOGO_NAME } from '@/models/articles.model';
import { validSearchParam } from '@/libs/utils/validSearchParam';

// =================================================================
// try remote mjs
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

const SOURCE_ARTICLE_PARAMS = [
  {
    url: 'https://www.newscaststudio.com/',
    linksSelector: '.news-feed-link',
    h1Selector: '.head-post h1',
    contentSelector: '.holder > p',
  },
  {
    url: 'https://spacenews.com/section/news-archive/',
    linksSelector: 'article figure a',
    h1Selector: 'h1.entry-title',
    contentSelector: '.entry-content > p',
  },
  {
    url: 'https://www.satellitetoday.com/category/launch/',
    linksSelector: '.j-sidebar h2 a',
    h1Selector: '.single-content h1',
    contentSelector: '.inner-content > p',
  },
];

const IS_LOGGED = true;
const NEWS_LENGTH_PER_SOURCE = 2;
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
      (\`original_slug\`,\`source\`, \`title_en\`, \`title\`, \`text_en\`, \`text\`, \`description_en\`, \`description\`, \`keywords_en\`, \`keywords\`, \`cpu\`, \`cat\`, \`date\`, \`date_upd\, \`logo\)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
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

  const prompt = `
  Write a new article based on the original article so that it is not considered a copy of the original article by search engines.
  Don't change people's quotes.
  Wrap important relevant to article title words in the article in a tag <strong>, but not more than 5% from the content of the article.
  Make short description of the article about 150 - 200 characters length for the <meta name=description>.
  Select relevant search keywords that will be used on the page in the <meta name=keywords>.
  Make SLUG for this article based on the english title.
  Choose a number from one of the categories: 
  1 - News of satellite channels,
  4 - Equipment overview,
  5 - Equipment settings,
  7 - Pay TV news,
  10 - Television news.
  14 - Satellite news.
  Articles must be written in Ukrainian and English. But write names, surnames, titles and abbreviations in the original language.
  Use the HTML format like:
  <h2 id='title-en'>Title</h2>
  <h3 id='description-en'>Description</h3>
  <h4 id='keywords-en'>Keywords</h4>
  <h5 id='slug'>slug-for-article</h5>
  <h6 id='category-number'>10</h6>
  <div id='text-en'>
  <p>Paragraph 1</p> 
  <p>Paragraph 2</p> 
  <p>Paragraph N</p> 
  </div>
  <h2 id='title-ua'>Назва</h2>
  <h3 id='description-ua'>Опис</h3>
  <h4 id='keywords-ua'>Ключові слова</h4>
  <div id='text-ua'>
  <p>Параграф 1</p> 
  <p>Параграф 2</p> 
  <p>Параграф N</p> 
  </div>
  Do not wrap the text in \`\`\`html \`\`\`
  Do not add newline character (\n).
  Text of original article: 
  ${originalText}
`;

  const result = await model.generateContent(prompt);
  const response = result.response;

  return response.text();
};

const extractMainLinks = (
  $: cheerio.CheerioAPI,
  selector: string,
  newsLengthPerSource: number
) => {
  const links: string[] = [];

  $(selector)
    .slice(0, newsLengthPerSource)
    .each((_, element) => {
      const link = $(element).attr('href');
      if (link) {
        links.push(link);
      }
    });

  return links;
};

const extractOriginalArticle = (
  $: cheerio.CheerioAPI,
  h1Selector: string,
  contentSelector: string
) => {
  const articleTitle = $(h1Selector).text();

  if (!articleTitle) return 'ERROR: cannot extract article TITLE';

  const articleText: string[] = [];
  $(contentSelector).each((_, elem) => {
    articleText.push($(elem).text());
  });

  if (!articleText.length) return 'ERROR: cannot extract article CONTENT';
  const articleContent = articleText.join(' ');

  return { articleTitle, articleContent };
};

const extractAiArticleData = ($: cheerio.CheerioAPI) => {
  const enAiTitle = $('#title-en').text().trim();
  if (!enAiTitle)
    return `ERROR: cannot extract article EN_TITLE from AI article: ${$.html()}`;

  const uaAiTitle = $('#title-ua').text().trim();
  if (!uaAiTitle)
    return `ERROR: cannot extract article UA_TITLE from AI article: ${$.html()}`;

  const enAiContent = $('#text-en').html();
  if (!enAiContent)
    return `ERROR: cannot extract article EN_CONTENT from AI article: ${$.html()}`;

  const uaAiContent = $('#text-ua').html();
  if (!uaAiContent)
    return `ERROR: cannot extract article UA_CONTENT from AI article: ${$.html()}`;

  const enAiDescription = $('#description-en').text().trim();
  if (!enAiDescription)
    return `ERROR: cannot extract article EN_DESCRIPTION from AI article: ${$.html()}`;

  const uaAiDescription = $('#description-ua').text().trim();
  if (!uaAiDescription)
    return `ERROR: cannot extract article UA_DESCRIPTION from AI article: ${$.html()}`;

  const uaAiKeywords = $('#keywords-ua').text().trim();
  if (!uaAiKeywords)
    return `ERROR: cannot extract article UA_KEYWORDS from AI article: ${$.html()}`;

  const enAiKeywords = $('#keywords-en').text().trim();
  if (!enAiKeywords)
    return `ERROR: cannot extract article EN_KEYWORDS from AI article: ${$.html()}`;

  const aiSlug = $('#slug').text().trim();
  if (!aiSlug)
    return `ERROR: cannot extract article SLUG from AI article: ${$.html()}`;

  const category = $('#category-number').text().trim();
  if (!category)
    return `ERROR: cannot extract article CATEGORY from AI article: ${$.html()}`;

  return {
    enAiTitle,
    uaAiTitle,
    uaAiContent,
    enAiContent,
    enAiDescription,
    uaAiDescription,
    uaAiKeywords,
    enAiKeywords,
    aiSlug,
    category,
  };
};

const sendReportMail = async (messages: string[]) => {
  await sendMail({
    subject: `Parse Satellite news`,
    body: await renderAsync(
      <ParseSatNewsTemplate
        pathToMainParsePage={`${BASE_GURU_PATH}/${EUrlAdminParam.PARSE}`}
        dbTableHref={getDbTableLink(ARTICLE_TBL)}
        errorMessages={messages}
        hrefSources={SOURCE_ARTICLE_PARAMS.map((s) => s.url)}
      />
    ),
  });
};
export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const newsLengthPerSource =
    parseInt(validSearchParam(EUrlSearchParam.INTERVAL, searchParams), 10) ||
    NEWS_LENGTH_PER_SOURCE;

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

      mainLinks = extractMainLinks(
        mainPage$,
        source.linksSelector,
        newsLengthPerSource
      );
      if (mainLinks.length === 0) {
        throw new Error('Cannot extract main links');
      } else if (typeof mainLinks === 'string') {
        throw new Error(mainLinks);
      }

      for (const link of mainLinks) {
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
        const articleSlug = link.split('/').filter(Boolean).pop();
        if (!articleSlug) {
          addMessage(`Cannot extract main links from ${link}`);
          continue;
        } else if (
          lastSlugsInDB.some((item) => item.original_slug === articleSlug)
        ) {
          addMessage(
            `WARNING: Article with SLUG: ${articleSlug} already exists in table ${ARTICLE_TBL}`
          );
          continue;
        }

        const aiArticleHtml = await generateAiText(
          extractArticleResult.articleContent
        );

        const extractedAiData = extractAiArticleData(
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
