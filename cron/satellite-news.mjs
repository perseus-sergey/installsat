import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';
import puppeteer from 'puppeteer';

import { sendMail } from './libs/sendMail.mjs';
import {
  EDBTableTitles,
  getDbTableLink,
  EUrlAdminParam,
  killChromeProcesses,
  getContentFromPuppeteerBrowser,
  DEFAULT_ARTICLE_LOGO_NAME,
} from './libs/commons.mjs';
import { executePoolQuery } from './libs/mysqldb.mjs';
import {
  SOURCE_ARTICLE_PARAMS,
  extractAiArticleDataFromAiHTML,
  getAiPrompt,
} from './libs/parseSatNews.controller.mjs';

// ----------------------------------------------------------------
// Parse last articles from specified sites then change them by AI
// ----------------------------------------------------------------

const IS_LOGGED = false;
const ALLOWED_CONTENT_LENGTH_MIN = 400;

const BASE_URL = process.env.BASE_URL;
const isProductionMode = process.env.NODE_ENV === 'production';
const BASE_GURU_PATH = `${BASE_URL}/en/${EUrlAdminParam.BASE_PATH}`;
const { ARTICLE: ARTICLE_TBL } = EDBTableTitles;

let messages = [];

const addMessage = (message, error = undefined) => {
  messages.push(`${message}${error ? `: ${error.message}` : ''}`);
  if (IS_LOGGED)
    console.log(`🚀 ~ ${message}${error ? ` ERROR: ${error}` : ''}`);
};

const insertDataToDB = async (v) => {
  const dateNow = new Date().toLocaleDateString('en-CA');

  const sql = `
      INSERT INTO ${ARTICLE_TBL} 
      (\`original_slug\`,\`source\`, \`title_en\`, \`title\`, \`text_en\`, \`text\`, \`description_en\`, \`description\`, \`keywords_en\`, \`keywords\`, \`cpu\`, \`cat\`, \`date\`, \`date_upd\`, \`logo\`)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;
  const res = await executePoolQuery(sql, [
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
  const res = await executePoolQuery(sql);

  if (res instanceof Error)
    throw new Error(`DB SELECT last SLUGs: ${res.message}`);

  return res;
};

const generateAiText = async (originalText) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = getAiPrompt(originalText);

  const result = await model.generateContent(prompt);
  const response = result.response;

  return response.text();
};

const extractOriginalArticle = ($, h1Selector, contentSelector) => {
  const articleTitle = $(h1Selector).text();

  if (!articleTitle) return 'ERROR: cannot extract article TITLE';

  const articleText = [];
  $(contentSelector).each((_, elem) => {
    articleText.push($(elem).text());
  });

  if (!articleText.length) return 'ERROR: cannot extract article CONTENT';
  const articleContent = articleText.join(' ');

  return { articleTitle, articleContent };
};

const sendReportMail = async (messages) => {
  await sendMail({
    title: 'Parse Satellite News Report',
    subject: `Parse Satellite News`,
    body: `
      ${
        messages.length
          ? `<p style="color: blue; font-size: 20px; padding: 10px 0">Messages:</p>
          <ul style="padding-bottom: 10px">${messages.map((msg) => `<li>${msg}</li>`).join('')}</ul>`
          : ''
      }
      <hr />
      <p>
      <a style="color: #267f00; font-size: 20px; padding: 10px 0" target="_blank" href="${BASE_GURU_PATH}/${EUrlAdminParam.PARSE}" >
      Main Parsing Page
      </a>
      </p>
      <p>
      Db Table 
      <a style="color: #267f00; font-size: 20px; padding: 10px 0" target="_blank" href="${getDbTableLink(ARTICLE_TBL)}" >
      ${ARTICLE_TBL}
      </a>
      </p>
      <hr />
      <p style="color: blue; font-size: 20px; padding: 10px 0">Sources:</p>
      <ul style="padding-bottom: 10px">${SOURCE_ARTICLE_PARAMS.map((s) => `<li><a href="${s.url}" target="_blank" >${s.url}</a></li>`).join('')}</ul>
    `,
  });
};

const getOriginalArticleSlug = (link, lastSlugsInDB) => {
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

const R_U_N = async () => {
  let browser = null;
  let mainLinks = '';
  const newArticles = [];

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

        if (
          extractArticleResult.articleContent.length <
          ALLOWED_CONTENT_LENGTH_MIN
        ) {
          addMessage(
            `ERROR: Extracted Article Content is too short < ${ALLOWED_CONTENT_LENGTH_MIN}`
          );
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
    if (isProductionMode) {
      const killRes = killChromeProcesses();
      messages = [...messages, ...killRes];
    }
  }

  await sendReportMail(messages);
};

R_U_N();
