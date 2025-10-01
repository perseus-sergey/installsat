// import { Title } from '@/components/ui/Titles/Title';
// import { EUrlAdminParam } from '@/models/url.model';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import * as React from 'react';
import puppeteer, { Browser } from 'puppeteer';
import * as cheerio from 'cheerio';
import { getContentFromPuppeteerBrowser } from '@/controllers/parse.controller';
import { killChromeProcesses } from '@/cron/libs/commons.mjs';
// import { sleep } from '@/libs/utils/sleep';

// interface IArticle {
//   originalTitle: string;
//   originalSlug: string;
//   originalText: string;
//   date: Date;
//   aiTitle: string;
//   aiHtml: string;
//   aiDescription: string;
//   aiKeywords: string;
//   slug: string;
// }

const isProductionMode = process.env.NODE_ENV === 'production';
const IS_LOGGED = !isProductionMode;

const PARSE_URL = 'https://news.satnews.com/';
// const NEWS_LENGTH_PER_SOURCE = 3;
// const BASE_URL = process.env.BASE_URL;
// const BASE_GURU_PATH = `${BASE_URL}/en/${EUrlAdminParam.BASE_PATH}`;

let messages: string[] = [];

const addMessage = (message: string, error?: Error) => {
  messages.push(`${message}${error ? `: ${error.message}` : ''}`);
  if (IS_LOGGED)
    console.log(`🚀 ~ ${message}${error ? ` ERROR: ${error}` : ''}`);
};

// const generateAiText = async (originalText: string) => {
//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

//   const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

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

  const container = $('h3:contains("Today On Satnews")')
    .nextAll('.pt-cv-wrapper')
    .first();

  if (container.length === 0) return 'Links container not found';

  const contentItems = container.find('.pt-cv-content-item');
  if (container.length === 0)
    return 'Elements with class .pt-cv-content-item not found in container';

  contentItems.slice(0, 3).each((_, element) => {
    const link = $(element).find('.pt-cv-title a').attr('href');
    if (link) {
      links.push(link);
    }
  });

  return links;
};

// const extractArticle = ($: cheerio.CheerioAPI) => {
//   const articleTitle = $('.head-post h1').text();

//   if (!articleTitle) return 'ERROR: cannot extract article TITLE';

//   const articleText: string[] = [];
//   $('.holder > p').each((_, elem) => {
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
  let mainLinks: string[] | string;
  // const newArticles: IArticle[] = [];

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
    //   const html = await getContentFromPuppeteerBrowser(browser, link);
    //   const $ = cheerio.load(html);
    //   const extractArticleResult = extractArticle($);
    //   if (typeof extractArticleResult === 'string') {
    //     addMessage(`${extractArticleResult} Article: ${link}`);
    //     continue;
    //   }
    //   const articleSlug = link.split('/').filter(Boolean).pop();
    //   if (!articleSlug)
    //     throw new Error(`Cannot extract main links from ${link}`);

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

  // return (
  //   <>
  //     <Title>Welcome to NewsCast Page</Title>
  //     <h2>Links:</h2>
  //     <ul>
  //       {mainLinks.map((link, i) => (
  //         <li key={i}>{link}</li>
  //       ))}
  //     </ul>
  //     {messages.length > 0 && (
  //       <>
  //         <h2>Messages:</h2>
  //         <ul>
  //           {messages.map((message, i) => (
  //             <li key={i}>{message}</li>
  //           ))}
  //         </ul>
  //       </>
  //     )}
  //     {newArticles.length > 0 && (
  //       <>
  //         <h2 className="text-center text-green-600 text-xl">New Articles:</h2>
  //         {newArticles.map((article) => (
  //           <React.Fragment key={article.originalTitle}>
  //             <h3 className="text-center text-blue-700 text-xl border-b">
  //               {article.originalTitle}
  //             </h3>
  //             <p>
  //               <b>Original Slug: </b>
  //               {article.originalSlug}
  //             </p>
  //             <p>
  //               <b>Original HTML: </b>
  //               {article.originalText}
  //             </p>
  //             <p>
  //               <b>Date: </b>
  //               {article.date.toLocaleDateString('en-CA')}
  //             </p>
  //           </React.Fragment>
  //         ))}
  //       </>
  //     )}

  //     {/* {response} */}
  //     {/* <DangerHtml text={aiText} /> */}
  //   </>
  // );
  return null;
}
