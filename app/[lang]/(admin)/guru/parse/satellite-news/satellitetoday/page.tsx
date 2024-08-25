import { Title } from '@/components/ui/Titles/Title';
// import { GoogleGenerativeAI } from '@google/generative-ai';
import * as React from 'react';
import puppeteer, { Browser } from 'puppeteer';
import * as cheerio from 'cheerio';
import { getContentFromPuppeteerBrowser } from '@/controllers/parse.controller';
import { sleep } from '@/libs/utils/utils';
import { killChromeProcesses } from '@/cron/libs/commons.mjs';

interface IArticle {
  originalTitle: string;
  originalSlug: string;
  originalText: string;
  date: Date;
  aiTitle: string;
  aiHtml: string;
  aiDescription: string;
  aiKeywords: string;
  slug: string;
}

const IS_LOGGED = true;
const PARSE_URL = 'https://www.satellitetoday.com/category/launch/';
// const NEWS_LENGTH_PER_SOURCE = 3;
// const BASE_URL = process.env.BASE_URL;
const isProductionMode = process.env.NODE_ENV === 'production';
// const BASE_GURU_PATH = `${BASE_URL}/en/${EUrlAdminParam.BASE_PATH}`;

let messages: string[] = [];

const addMessage = (message: string, error?: Error) => {
  messages.push(`${message}${error ? `: ${error.message}` : ''}`);
  if (IS_LOGGED)
    console.log(`🚀 ~ ${message}${error ? ` ERROR: ${error}` : ''}`);
};

// const generateAiText = async (originalText: string) => {
//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

//   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

//   const prompt = `
//   Write a new article based on the original article so that it is not considered a copy of the original article by search engines.
//   From the given text, use only the text inside the tags.
//   Remove links and embedded scripts from the text.
//   Do not change the quotes.
//   In ukrainian and english. But write names, surnames, titles and abbreviations in the original language.
//   Use the HTML format like:
//   <h2 id='title-en'>Title</h2>
//   <div id='text-en'>
//   <p>Paragraph 1</p>
//   <p>Paragraph 2</p>
//   <p>Paragraph N</p>
//   </div>
//   <h2 id='title-ua'>Назва</h2>
//   <div id='text-ua'>
//   <p>Параграф 1</p>
//   <p>Параграф 2</p>
//   <p>Параграф N</p>
//   </div>
//   Do not wrap the text in \`\`\`html \`\`\`
//   Text of original article:
//   ${originalText}
// `;

//   const result = await model.generateContent(prompt);
//   const response = result.response;

//   return response.text();
// };

const extractMainLinks = ($: cheerio.CheerioAPI) => {
  const links: string[] = [];

  $('.j-sidebar h2 a')
    .slice(0, 3)
    .each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        links.push(href);
      }
    });

  return links;
};

const extractArticle = ($: cheerio.CheerioAPI) => {
  const articleTitle = $('.single-content h1').text().trim();

  if (!articleTitle) return 'ERROR: cannot extract article TITLE';

  const articleText: string[] = [];
  $('.inner-content > p').each((_, elem) => {
    articleText.push($(elem).text());
  });

  if (!articleText.length) return 'ERROR: cannot extract article CONTENT';
  const articleContent = articleText.join('\n');

  return { articleTitle, articleContent };
};

export default async function Page() {
  let browser: Browser | null = null;
  // let aiText = '';
  // let parsedText = '';
  let mainLinks: string[] | string = '';
  const newArticles: IArticle[] = [];

  try {
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    const mainPageHtml = await getContentFromPuppeteerBrowser(
      browser,
      PARSE_URL
    );
    const mainPage$ = cheerio.load(mainPageHtml);

    mainLinks = extractMainLinks(mainPage$);
    if (mainLinks.length === 0) {
      throw new Error('Cannot extract main links');
    } else if (typeof mainLinks === 'string') {
      throw new Error(mainLinks);
    }

    for (const link of mainLinks) {
      const html = await getContentFromPuppeteerBrowser(browser, link);
      const $ = cheerio.load(html);
      const extractArticleResult = extractArticle($);
      if (typeof extractArticleResult === 'string') {
        addMessage(`${extractArticleResult} Article: ${link}`);
        continue;
      }
      const articleSlug = link.split('/').filter(Boolean).pop();
      if (!articleSlug)
        throw new Error(`Cannot extract main links from ${link}`);

      newArticles.push({
        originalTitle: extractArticleResult.articleTitle,
        originalSlug: articleSlug,
        originalText: extractArticleResult.articleContent,
        date: new Date(),
        aiTitle: '',
        aiHtml: '',
        aiDescription: '',
        aiKeywords: '',
        slug: '',
      });

      await sleep(1000);
    }
    // aiText = await generateAiText(parsedText);
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
    if (isProductionMode) {
      const killRes = killChromeProcesses();
      messages = [...messages, ...killRes];
    }
  }

  return (
    <>
      <Title>Welcome to NewsCast Page</Title>
      <h2>Links:</h2>
      {Array.isArray(mainLinks) && mainLinks.length > 0 && (
        <ul>
          {mainLinks.map((link, i) => (
            <li key={i}>{link}</li>
          ))}
        </ul>
      )}
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
      {newArticles.length > 0 && (
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
      )}

      {/* {response} */}
      {/* <DangerHtml text={aiText} /> */}
    </>
  );
  // return null;
}
