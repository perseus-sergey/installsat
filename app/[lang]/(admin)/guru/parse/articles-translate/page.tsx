import { ResultSetHeader } from 'mysql2';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';

import { Title } from '@/components/ui/Titles/Title';
import { sendMail } from '@/libs/mail/sendMail';
import { poolExecute } from '@/libs/db/mysqldb';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { ELanguage } from '@/cron/libs/commons.mjs';
import { WRONG_CAT_IDS } from '@/models/articles/articleList.model';
import { EDBTableTitles, getDbTableLink } from '@/models/dbTblNames.model';
import { cutText } from '@/libs/utils/cutText';
import { sleep } from '@/libs/utils/sleep';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.BASE_URL;

const { ARTICLE } = EDBTableTitles;

// const SIMULTANEOUS_GENERATE_LIMIT = 1;

interface IDbArticleDataAbout {
  title_ru: string | null;
  text_ru: string | null;
  description_ru: string | null;
  keywords_ru: string | null;
}

interface IGeneratedJson {
  title_ru: string;
  text_ru: string;
  description_ru: string;
  keywords_ru: string;
}

interface IDbCurrentArticle {
  cpu: string;
  title_en: string;
  id: string;
  text_en: string;
}

const emptyArticleDescription: IDbArticleDataAbout = {
  title_ru: null,
  text_ru: null,
  description_ru: null,
  keywords_ru: null,
};

const getSatArticlesFromDB = async (quantity: string) => {
  const sql = `
  SELECT id, title_en, text_en, cpu
  FROM ${ARTICLE}
  WHERE text_ru = ''
  AND cat NOT IN ${WRONG_CAT_IDS}
  LIMIT ${quantity};
  `;
  const res = await poolExecute<IDbCurrentArticle[]>(sql);

  return res instanceof Error
    ? `ERROR: SELECT articles from table: "${ARTICLE}". Error message: ${res.message}`
    : res;
};

const updateGeneratedDataDB = async (
  { title_ru, text_ru, description_ru, keywords_ru }: IDbArticleDataAbout,
  articleId: string
) => {
  if (!title_ru) return new Error('ERROR: Cannot UPDATE DB. title_ru is NULL');

  const sql = `
      UPDATE ${ARTICLE}
      SET
        title_ru = ?, 
        text_ru = ?, 
        description_ru = ?, 
        keywords_ru = ?
      WHERE id = ? 
    `;
  const res = await poolExecute<ResultSetHeader>(sql, [
    title_ru,
    text_ru,
    description_ru,
    keywords_ru,
    articleId,
  ]);

  return res instanceof Error ? res : res.affectedRows;
};

const generateAiText = async (articleTitle: string, currentText: string) => {
  const generationConfig = {
    temperature: 0.5,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const prompt = `- Original article title: '${articleTitle}';\n - Original article content:'${currentText}'`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig,
      safetySettings,
      systemInstruction: `
    - Translate the article to Russian.
    - Make short description of the article about 150 - 200 characters length for the <meta name=description>.
    - Select relevant search keywords that will be used on the page in the <meta name=keywords>.

    - Articles must be written in Russian.

    - Also translate the text of the html-alt attribute

    - Use html format with relevant attributes (aria-, alt, title, etc.)
    - It is allowed to use only tags: <p>, <span>, <e>, <strong>, <b>, <a>, <ul>, <li>, <ol>, <img>, <figure>, <figcaption>, <h2>-<h4>. 
    - Do not add newline character (\n) into the text. 

    - Format the response as JSON in the following format:
      {
        "title_ru": [Title in English without html tags],
        "text_ru": [Text in English. Do not add newline character (\n)],
        "description_ru": [Description in English (150 - 200 characters maximum)],
        "keywords_ru": [Keywords in English (150 - 200 characters maximum)]
      }

    - Do not add newline character (\n) into the text.
    - Do not wrap the text in \`\`\`json \`\`\`
         `,
    });

    const result = await model.generateContent(prompt);

    const { response } = result;

    const startIndex = response.text().indexOf('{');
    const endIndex = response.text().lastIndexOf('}') + 1;
    const cleanResult = response.text().slice(startIndex, endIndex);

    return JSON.parse(cleanResult) as IGeneratedJson;
  } catch (error) {
    return error instanceof Error
      ? error
      : new Error('Wrong AI generation of JSON parsing');
  }
};

const cutBigText = (text: string) =>
  text.length < 231 ? text : cutText(text, 230);

const extractDataFromAiJson = (aiObject: IGeneratedJson) => {
  const getErrorStr = (errName: string, value = '') =>
    `ERROR: cannot extract article ${errName}${value ? `: (${value})` : ''} from AI generated descriptions`;

  const title_ru = aiObject['title_ru'].trim();
  if (!title_ru)
    return {
      aiDescription: emptyArticleDescription,
      error: getErrorStr('TITLE_RU'),
    };

  const description_ru = aiObject['description_ru'].trim();
  if (!description_ru || description_ru.length < 30)
    return {
      aiDescription: emptyArticleDescription,
      error: getErrorStr('RU_DESCRIPTION', description_ru),
    };

  const keywords_ru = cutBigText(aiObject['keywords_ru'].trim());
  if (!keywords_ru || keywords_ru.length < 30)
    return {
      aiDescription: emptyArticleDescription,
      error: getErrorStr('RU_KEYWORDS', keywords_ru),
    };

  const text_ru = aiObject['text_ru'].trim();
  if (!text_ru || text_ru.length < 100)
    return {
      aiDescription: emptyArticleDescription,
      error: getErrorStr('RU_CONTENT'),
    };

  return {
    aiDescription: {
      title_ru,
      text_ru,
      description_ru,
      keywords_ru,
    },
    error: null,
  };
};

const generateArticleAbout = async (
  articleTitle: string,
  currentText: string
) => {
  const aiText = await generateAiText(articleTitle, currentText);

  if (aiText instanceof Error) {
    return {
      aiDescription: emptyArticleDescription,
      error: `ERROR: AI cannot generate content. Article: ${articleTitle}. Error message: ${aiText.message}`,
    };
  }

  const extractedAiData = extractDataFromAiJson(aiText);

  return extractedAiData;
};

const getAiArticleAbout = async (dbArticleData: IDbCurrentArticle) => {
  const generatedDataRes = await generateArticleAbout(
    dbArticleData.title_en,
    dbArticleData.text_en
  );

  return {
    shouldUpdateData: generatedDataRes.aiDescription,
    shouldUpdateMessage:
      generatedDataRes.error ||
      `SUCCESS: Generated article descriptions for "${dbArticleData.title_en}" article`,
  };
};

const extractAndUpdateData = async (dbArticleData: IDbCurrentArticle) => {
  const messages = [];

  const { shouldUpdateData, shouldUpdateMessage } =
    await getAiArticleAbout(dbArticleData);

  if (shouldUpdateMessage) messages.push(shouldUpdateMessage);

  const updateAllChanWithSameTitleRes = await updateGeneratedDataDB(
    shouldUpdateData,
    dbArticleData.id
  );

  messages.push(
    updateAllChanWithSameTitleRes instanceof Error
      ? `ERROR: DB UPDATE data for articles with title "${dbArticleData.title_en}". Error message: ${updateAllChanWithSameTitleRes.message}`
      : `SUCCESS: Add ${updateAllChanWithSameTitleRes} article descriptions for "${dbArticleData.title_en}" article(s)`
  );

  return { extractAndUpdateMessages: messages };
};

const addDescriptionForArticles = async (quantity: string) => {
  const messages = [];

  const dbArticlesRes = await getSatArticlesFromDB(quantity);
  if (typeof dbArticlesRes === 'string') return [dbArticlesRes];

  for (const article of dbArticlesRes) {
    messages.push(`┌──────────────── "${article.cpu}" ────────────────┐`);
    const { extractAndUpdateMessages } = await extractAndUpdateData(article);
    messages.push(...extractAndUpdateMessages);
    messages.push(`└──────────────────────────┘`);

    await sleep(500);
  }

  return messages;
};

const sendReportMail = async (errorMessages: string[], quantity: string) => {
  const { renderAsync } = await import('@react-email/render');
  const { ParseTransNews } = await import(
    '@/components/EmailTemplates/parseTransNews.template'
  );

  await sendMail({
    subject: `Generate AI description for "${quantity}" articles`,
    body: await renderAsync(
      <ParseTransNews
        title={`Generate AI description for "${quantity}" articles`}
        pathToMainParsePage={`${BASE_URL}/${ELanguage.EN}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`}
        errorMessages={errorMessages}
        dbTableHref={getDbTableLink(EDBTableTitles.ARTICLE)}
        hrefSources=""
      />
    ),
  });
};

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const quantity = validSearchParam(EUrlSearchParam.INTERVAL, searchParams);

  const messages = await addDescriptionForArticles(quantity);

  await sendReportMail(messages, quantity);

  return (
    <>
      <Title>
        {`Generate description article data for ${quantity} articles`}
      </Title>

      <h2 className="font-bold text-blue-700 text-xl">Messages:</h2>
      <ul>
        {messages.map((message, i) => (
          <li key={i}>{message}</li>
        ))}
      </ul>
    </>
  );
}

// UPDATE fly_channels
//       SET
//         text_ua = null,
//         text_en = null,
//         description_en = null,
//         description_ua = null,
//         keywords_ua = null,
//         keywords_en = null,
//         official_site_url = null,
//         theme_id = null
//       WHERE title = 'Prime One'
//       WHERE title IN ('title1', 'title2', 'title3')

// Article title: 'Установка спутниковой антенны'
// Article content: '<p><strong>Установка антенны</strong> для приема каналов со спутников состоит из нескольких этапов:</p>
