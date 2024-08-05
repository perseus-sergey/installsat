import { Title } from '@/components/ui/Titles/Title';
// import { EUrlAdminParam } from '@/models/url.model';
// import { GoogleGenerativeAI } from '@google/generative-ai';
import * as React from 'react';
import puppeteer, { Browser } from 'puppeteer';
import * as cheerio from 'cheerio';
import {
  getContentFromPuppeteerBrowser,
  killChromeProcesses,
} from '@/controllers/parse.controller';
import { sleep } from '@/libs/utils/utils';

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
const PARSE_URL = 'https://www.broadbandtvnews.com/category/newsline/';
const NEWS_LENGTH_PER_SOURCE = 27;
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

const allowedWords = [
  'tech',
  'tv',
  'central & east europe',
  'satellite',
  'terrestrial',
  'finance',
  'top story',
  '2nd story',
];

const forbiddenWords = ['fast channels'];

const extractMainLinks = ($: cheerio.CheerioAPI) => {
  const links: string[] = [];

  $('article')
    .slice(0, NEWS_LENGTH_PER_SOURCE)
    .each((_, article) => {
      const categories = $(article)
        .find('.entry-categories a')
        .map((_i, el) => $(el).text().toLowerCase())
        .get();

      const containsAllowedWords = categories.some((cat) =>
        allowedWords.includes(cat)
      );

      const containsForbiddenWords = categories.some((cat) =>
        forbiddenWords.includes(cat)
      );

      if (containsAllowedWords && !containsForbiddenWords) {
        const href = $(article).find('header h2 a').attr('href');
        if (href) {
          links.push(href);
        }
      }
    });

  return links;
};

const extractArticle = ($: cheerio.CheerioAPI) => {
  const articleTitle = $('h1.entry-title').text().trim();

  if (!articleTitle) return 'ERROR: cannot extract article TITLE';

  const articleText: string[] = [];
  $('.entry-content p').each((_, elem) => {
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
      const articleSlug = link.split('/').filter(Boolean).pop();
      if (!articleSlug) {
        addMessage(`Cannot extract main links from ${link}`);
        continue;
      }

      const html = await getContentFromPuppeteerBrowser(browser, link);
      const $ = cheerio.load(html);
      const extractArticleResult = extractArticle($);
      if (typeof extractArticleResult === 'string') {
        addMessage(`${extractArticleResult} Article: ${link}`);
        continue;
      }

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
    isProductionMode && killChromeProcesses();
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
