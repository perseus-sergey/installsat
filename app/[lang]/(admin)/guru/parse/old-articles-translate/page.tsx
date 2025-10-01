import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';

import { Title } from '@/components/ui/Titles/Title';
import { sendMail } from '@/libs/mail/sendMail';
import { poolExecute } from '@/libs/db/mysqldb';
import { ResultSetHeader } from 'mysql2';
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
  title_en: string | null;
  title_ua: string | null;
  text_ua: string | null;
  text_en: string | null;
  description_en: string | null;
  description_ua: string | null;
  keywords_ua: string | null;
  keywords_en: string | null;
}

interface IGeneratedJson {
  title_en: string;
  title_ua: string;
  text_ua: string;
  text_en: string;
  description_en: string;
  description_ua: string;
  keywords_ua: string;
  keywords_en: string;
}

interface IDbCurrentArticle {
  cpu: string;
  title: string;
  id: string;
  text: string;
}

const emptyArticleDescription: IDbArticleDataAbout = {
  title_en: null,
  title_ua: null,
  text_ua: null,
  text_en: null,
  description_en: null,
  description_ua: null,
  keywords_ua: null,
  keywords_en: null,
};

const getSatArticlesFromDB = async (quantity: string) => {
  const sql = `
  SELECT id, title, text, cpu
  FROM ${ARTICLE}
  WHERE text_en = ''
  AND cat NOT IN ${WRONG_CAT_IDS}
  LIMIT ${quantity};
  `;
  const res = await poolExecute<IDbCurrentArticle[]>(sql);

  return res instanceof Error
    ? `ERROR: SELECT articles from table: "${ARTICLE}". Error message: ${res.message}`
    : res;
};

const updateGeneratedDataDB = async (
  {
    title_en,
    title_ua,
    text_ua,
    text_en,
    description_en,
    description_ua,
    keywords_ua,
    keywords_en,
  }: IDbArticleDataAbout,
  articleId: string
) => {
  if (!title_ua) return new Error('ERROR: Cannot UPDATE DB. title_ua is NULL');

  const sql = `
      UPDATE ${ARTICLE}
      SET
        title_en = ?, 
        title = ?, 
        text = ?, 
        text_en = ?, 
        description_en = ?, 
        description = ?, 
        keywords = ?, 
        keywords_en = ?
      WHERE id = ? 
    `;
  const res = await poolExecute<ResultSetHeader>(sql, [
    title_en,
    title_ua,
    text_ua,
    text_en,
    description_en,
    description_ua,
    keywords_ua,
    keywords_en,
    articleId,
  ]);

  return res instanceof Error ? res : res.affectedRows;
};

const generateAiText = async (articleTitle: string, currentText: string) => {
  const generationConfig = {
    temperature: 0.5,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    stopSequences: ['something for everyone'],
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
      model: 'gemini-2.0-flash',
      generationConfig,
      safetySettings,
      systemInstruction: `
    - Translate the article to Ukrainian and English.
    - Wrap important relevant to article title words in the article in a tag <strong>, but not more than 5% (for each language) from the content of the article.
    - Make short description of the article about 150 - 200 characters length for the <meta name=description>.
    - Select relevant search keywords that will be used on the page in the <meta name=keywords>.

    - Articles must be written in Ukrainian and English.

    - Also translate the text of the alt attribute

    - Use html format with relevant attributes (aria-, alt, title, etc.), but it is allowed to use only tags: <p>, <span>, <e>, <strong>, <b>, <a>, <ul>, <li>, <ol>, <img>, <figure>, <figcaption>, <h2>-<h4>. 
    - Remove all <br> tags. Do not add newline character (\n) into the text. 
    - If there are images next to descriptive text on the page, use the following format: for example (instead of:
    '<a style="float: right; margin: 0 15px 10px 10px;" href="pic_trulli_big.jpg"> <img src="pic_trulli.jpg" alt="Trulli" width="350" height="256"> </a>
    <p><br><br>Trulli, Puglia, Italy.</p>'
     use:
    '<figure style="display: flex; flex-direction: row; gap: 1rem; justify-content: center; align-items: center; flex-wrap : wrap;">
    <a href="pic_trulli_big.jpg">
     <img src="pic_trulli.jpg" alt="Trulli" style="width: 350px; height: 256px">
     </a>
     <figcaption>Trulli, Puglia, Italy.</figcaption>
    </figure>'
    )
    - if there are links with the [target="_blank"] attribute in the text, be sure to also add the [rel="noopener noreferrer"] attribute

    - Format the response as JSON in the following format:
      {
        "title_en": [Title in English without html tags],
        "title_ua": [Title in Ukrainian without html tags],
        "text_ua": [Text in Ukrainian. Do not add newline character (\n)],
        "text_en": [Text in English. Do not add newline character (\n)],
        "description_en": [Description in English (150 - 200 characters maximum)],
        "description_ua": [Description in Ukrainian (150 - 200 characters maximum)],
        "keywords_ua": [Keywords in Ukrainian (150 - 200 characters maximum)],
        "keywords_en": [Keywords in English (150 - 200 characters maximum)]
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

  const title_en = aiObject['title_en'].trim();
  if (!title_en)
    return {
      aiDescription: emptyArticleDescription,
      error: getErrorStr('TITLE_EN'),
    };

  const title_ua = aiObject['title_ua'].trim();
  if (!title_ua)
    return {
      aiDescription: emptyArticleDescription,
      error: getErrorStr('TITLE_UA'),
    };

  const description_en = cutBigText(aiObject['description_en'].trim());
  if (!description_en || description_en.length < 30)
    return {
      aiDescription: emptyArticleDescription,
      error: getErrorStr('EN_DESCRIPTION', description_en),
    };

  const keywords_en = cutBigText(aiObject['keywords_en'].trim());
  if (!keywords_en || keywords_en.length < 30)
    return {
      aiDescription: emptyArticleDescription,
      error: getErrorStr('EN_KEYWORDS', keywords_en),
    };

  const description_ua = cutBigText(aiObject['description_ua'].trim());
  if (!description_ua || description_ua.length < 30)
    return {
      aiDescription: emptyArticleDescription,
      error: getErrorStr('UA_DESCRIPTION', description_ua),
    };

  const keywords_ua = cutBigText(aiObject['keywords_ua'].trim());
  if (!keywords_ua || keywords_ua.length < 30)
    return {
      aiDescription: emptyArticleDescription,
      error: getErrorStr('UA_KEYWORDS', keywords_ua),
    };

  const text_en = aiObject['text_en'].trim();
  if (!text_en || text_en.length < 100)
    return {
      aiDescription: emptyArticleDescription,
      error: getErrorStr('EN_CONTENT'),
    };

  const text_ua = aiObject['text_ua'].trim();
  if (!text_ua || text_ua.length < 100)
    return {
      aiDescription: emptyArticleDescription,
      error: getErrorStr('UA_CONTENT'),
    };

  return {
    aiDescription: {
      title_en,
      title_ua,
      text_ua,
      text_en,
      description_en,
      description_ua,
      keywords_ua,
      keywords_en,
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
    dbArticleData.title,
    dbArticleData.text
  );

  return {
    shouldUpdateData: generatedDataRes.aiDescription,
    shouldUpdateMessage:
      generatedDataRes.error ||
      `SUCCESS: Generated article descriptions for "${dbArticleData.title}" article`,
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
      ? `ERROR: DB UPDATE data for articles with title "${dbArticleData.title}". Error message: ${updateAllChanWithSameTitleRes.message}`
      : `SUCCESS: Add ${updateAllChanWithSameTitleRes} article descriptions for "${dbArticleData.title}" article(s)`
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
