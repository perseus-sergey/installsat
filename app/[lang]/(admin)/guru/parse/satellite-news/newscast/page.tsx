import { Title } from '@/components/ui/Titles/Title';
// import { EUrlAdminParam } from '@/models/url.model';
// import { GoogleGenerativeAI } from '@google/generative-ai';
import * as React from 'react';
import puppeteer, { Browser } from 'puppeteer';
import * as cheerio from 'cheerio';
import { getContentFromPuppeteerBrowser } from '@/controllers/parse.controller';
import { killChromeProcesses } from '@/cron/libs/commons.mjs';
// import { sleep } from '@/libs/utils/sleep';

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

const PARSE_URL = 'https://www.newscaststudio.com/';
// const NEWS_LENGTH_PER_SOURCE = 7;
// const BASE_URL = process.env.BASE_URL;
const isProductionMode = process.env.NODE_ENV === 'production';
const IS_LOGGED = !isProductionMode;
// const BASE_GURU_PATH = `${BASE_URL}/en/${EUrlAdminParam.BASE_PATH}`;

let messages: string[] = [];

const addMessage = (message: string, error?: Error) => {
  messages.push(`${message}${error ? `: ${error.message}` : ''}`);
  if (IS_LOGGED)
    console.log(`🚀 ~ ${message}${error ? ` ERROR: ${error}` : ''}`);
};

const extractMainLinks = ($: cheerio.CheerioAPI) => {
  const newsLengthPerSource = 2;
  const links: string[] = [];

  $('.news-container').each((_, element) => {
    $(element)
      .find('a')
      .slice(0, newsLengthPerSource)
      .each((_i, link) => {
        const href = $(link).attr('href');
        if (href) {
          links.push(href);
        }
      });
  });

  return links;
};

// const extractArticle = ($: cheerio.CheerioAPI) => {
//   const articleTitle = $('h1.entry-title').text().trim();

//   if (!articleTitle) return 'ERROR: cannot extract article TITLE';

//   const articleText: string[] = [];
//   $('.entry-content p').each((_, elem) => {
//     articleText.push($(elem).text());
//   });

//   if (!articleText.length) return 'ERROR: cannot extract article CONTENT';
//   const articleContent = articleText.join('\n');

//   return { articleTitle, articleContent };
// };

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

    // for (const link of mainLinks) {
    //   const articleSlug = link.split('/').filter(Boolean).pop();
    //   if (!articleSlug) {
    //     addMessage(`Cannot extract main links from ${link}`);
    //     continue;
    //   }

    //   const html = await getContentFromPuppeteerBrowser(browser, link);
    //   const $ = cheerio.load(html);
    //   const extractArticleResult = extractArticle($);
    //   if (typeof extractArticleResult === 'string') {
    //     addMessage(`${extractArticleResult} Article: ${link}`);
    //     continue;
    //   }

    //   newArticles.push({
    //     originalTitle: extractArticleResult.articleTitle,
    //     originalSlug: articleSlug,
    //     originalText: extractArticleResult.articleContent,
    //     date: new Date(),
    //     aiTitle: '',
    //     aiHtml: '',
    //     aiDescription: '',
    //     aiKeywords: '',
    //     slug: '',
    //   });

    //   await sleep(1000);
    // }
    // aiText = await generateAiText(parsedText);
  } catch (error) {
    addMessage(
      'ERROR: failed during processing',
      error instanceof Error ? error : new Error('Unknown error occurred')
    );
  } finally {
    if (browser) {
      try {
        const pages = await browser.pages();
        await Promise.all(pages.map((page) => page.close())); // Закрити всі відкриті сторінки
        await browser.close();
      } catch (closeError) {
        addMessage(
          'ERROR closing browser',
          closeError instanceof Error
            ? closeError
            : new Error('Error closing browser')
        );
      } finally {
        if (isProductionMode) {
          const killRes = killChromeProcesses(isProductionMode);
          messages = [...messages, ...killRes];
        }
      }
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
