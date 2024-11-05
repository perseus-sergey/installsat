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
import { WRONG_CAT_IDS } from '@/models/articles/articleList.model';
import { EDBTableTitles, getDbTableLink } from '@/models/dbTblNames.model';
import { cutText } from '@/libs/utils/cutText';
import { sleep } from '@/libs/utils/sleep';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';
// import { ELanguage } from '@/models/language.model';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.BASE_URL;

const { ARTICLE } = EDBTableTitles;

enum ELanguage {
  // UA = 'ua',
  // EN = 'en',
  RU = 'ru',
  ES = 'es',
  AR = 'ar',
  DE = 'de',
  FR = 'fr',
  IT = 'it',
}

const {
  // UA,
  //  EN,
  RU,
  ES,
  AR,
  DE,
  FR,
  IT,
} = ELanguage;

interface ILangParams {
  suffix: string;
  translateTo: string;
}

const translationParams: Record<ELanguage, ILangParams> = {
  // [UA]: { suffix: '', translateTo: 'Ukrainian' },
  // [EN]: { suffix: '_en', translateTo: 'English' },
  [RU]: { suffix: '_ru', translateTo: 'Russian' },
  [ES]: { suffix: '_es', translateTo: 'Spanish' },
  [AR]: { suffix: '_ar', translateTo: 'Arabic' },
  [DE]: { suffix: '_de', translateTo: 'German' },
  [FR]: { suffix: '_fr', translateTo: 'French' },
  [IT]: { suffix: '_it', translateTo: 'Italian' },
};

// const SIMULTANEOUS_GENERATE_LIMIT = 1;

interface IDbArticleDataAbout {
  title: string | null;
  text: string | null;
  description: string | null;
  keywords: string | null;
}

interface IGeneratedJson {
  title: string;
  text: string;
  description: string;
  keywords: string;
}

interface IDbCurrentArticle {
  cpu: string;
  title_en: string;
  id: string;
  text_en: string;
}

// SELECT id, title_en, text_en, cpu
//   FROM tbl_useful
//   WHERE text_en IS NOT NULL AND text_en != '' AND text_fr IS NULL
//   AND cat NOT IN (2,0,11,12,13)
//   LIMIT 5

const emptyArticleDescription: IDbArticleDataAbout = {
  title: null,
  text: null,
  description: null,
  keywords: null,
};

const getSatArticlesFromDB = async (quantity: string, lang: ELanguage) => {
  const sql = `
  SELECT id, title_en, text_en, cpu
  FROM ${ARTICLE}
  WHERE text_en IS NOT NULL AND text_en != '' AND text${translationParams[lang].suffix} IS NULL
  AND cat NOT IN ${WRONG_CAT_IDS}
  LIMIT ${quantity};
  `;
  const res = await poolExecute<IDbCurrentArticle[]>(sql);

  return res instanceof Error
    ? `ERROR: SELECT articles from table: "${ARTICLE}". Error message: ${res.message}`
    : res;
};

const updateGeneratedDataDB = async (
  { title, text, description, keywords }: IDbArticleDataAbout,
  articleId: string,
  lang: ELanguage
) => {
  if (!title)
    return new Error(
      `ERROR: Cannot UPDATE DB. title${translationParams[lang].suffix} is NULL`
    );

  const sql = `
      UPDATE ${ARTICLE}
      SET
        title${translationParams[lang].suffix} = ?, 
        text${translationParams[lang].suffix} = ?, 
        description${translationParams[lang].suffix} = ?, 
        keywords${translationParams[lang].suffix} = ?
      WHERE id = ? 
    `;
  const res = await poolExecute<ResultSetHeader>(sql, [
    title,
    text,
    description,
    keywords,
    articleId,
  ]);

  return res instanceof Error ? res : res.affectedRows;
};

const generateAiText = async (
  articleTitle: string,
  currentText: string,
  lang: ELanguage
) => {
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

  const systemInstruction = `
    - Translate the article to ${translationParams[lang].translateTo}.
    - Make short description of the article about 150 - 200 characters length for the <meta name=description>.
    - Select relevant search keywords that will be used on the page in the <meta name=keywords>.

    - Articles must be written in ${translationParams[lang].translateTo}.

    - Also translate the text of the html-alt attribute

    - Use html format with relevant attributes (aria-, alt, title, etc.)
    - It is allowed to use only tags: <p>, <span>, <e>, <strong>, <b>, <a>, <ul>, <li>, <ol>, <img>, <figure>, <figcaption>, <h2>-<h4>.
    - Do not add newline character (\n) into the text.

    - Format the response as JSON in the following format:
      {
        "title${translationParams[lang].suffix}": [Title in ${translationParams[lang].translateTo} without html tags],
        "text${translationParams[lang].suffix}": [Text in ${translationParams[lang].translateTo}. Do not add newline character (\n)],
        "description${translationParams[lang].suffix}": [Description in ${translationParams[lang].translateTo} (150 - 200 characters maximum)],
        "keywords${translationParams[lang].suffix}": [Keywords in ${translationParams[lang].translateTo} (150 - 200 characters maximum)]
      }

    - Do not add newline character (\n) into the text.
    - Do not wrap the text in \`\`\`json \`\`\`
         `;
  // console.log('🚀 ~ systemInstruction:', systemInstruction);

  const prompt = `- Original article title: '${articleTitle}';\n - Original article content:'${currentText}'`;

  console.log('🚀 ~ articleTitle:', articleTitle);
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig,
      safetySettings,
      systemInstruction,
    });

    const result = await model.generateContent(prompt);

    const { response } = result;
    console.log('🚀 ~ response:', response);

    const startIndex = response.text().indexOf('{');
    const endIndex = response.text().lastIndexOf('}') + 1;
    const cleanResult = response.text().slice(startIndex, endIndex);

    return JSON.parse(cleanResult) as IGeneratedJson;
  } catch (error) {
    return error instanceof Error
      ? error
      : new Error('Wrong AI generation of JSON parsing');
  }

  // return {
  //   title: 'title',
  //   text: 'text',
  //   description: 'description',
  //   keywords: 'keywords',
  // };
};

const cutBigText = (text: string) =>
  text.length < 231 ? text : cutText(text, 230);

const extractDataFromAiJson = (aiObject: IGeneratedJson, lang: ELanguage) => {
  const getErrorStr = (errName: string, value = '') =>
    `ERROR: cannot extract article ${errName}${value ? `: (${value})` : ''} from AI generated descriptions`;

  if (!aiObject['title'])
    return {
      aiDescription: emptyArticleDescription,
      error: getErrorStr(
        `TITLE${translationParams[lang].suffix}`,
        aiObject['title']
      ),
    };
  const title = aiObject['title'].trim();

  if (!aiObject['description'] || aiObject['description'].length < 30)
    return {
      aiDescription: emptyArticleDescription,
      error: getErrorStr(
        `DESCRIPTION${translationParams[lang].suffix}`,
        aiObject['description']
      ),
    };
  const description = aiObject['description'].trim();

  if (!aiObject['keywords'] || aiObject['keywords'].length < 30)
    return {
      aiDescription: emptyArticleDescription,
      error: getErrorStr(
        `KEYWORDS${translationParams[lang].suffix}`,
        aiObject['keywords']
      ),
    };
  const keywords = cutBigText(aiObject['keywords'].trim());

  if (!aiObject['text'] || aiObject['text'].length < 100)
    return {
      aiDescription: emptyArticleDescription,
      error: getErrorStr(`CONTENT${translationParams[lang].suffix}`),
    };
  const text = aiObject['text'].trim();

  return {
    aiDescription: {
      title,
      text,
      description,
      keywords,
    },
    error: null,
  };
};

const generateArticleAbout = async (
  articleTitle: string,
  currentText: string,
  lang: ELanguage
) => {
  const aiText = await generateAiText(articleTitle, currentText, lang);

  if (aiText instanceof Error) {
    return {
      aiDescription: emptyArticleDescription,
      error: `ERROR: AI cannot generate content. Article: ${articleTitle}. Error message: ${aiText.message}`,
    };
  }

  const extractedAiData = extractDataFromAiJson(aiText, lang);

  return extractedAiData;
};

const getAiArticleAbout = async (
  dbArticleData: IDbCurrentArticle,
  lang: ELanguage
) => {
  const generatedDataRes = await generateArticleAbout(
    dbArticleData.title_en,
    dbArticleData.text_en,
    lang
  );

  return {
    shouldUpdateData: generatedDataRes.aiDescription,
    shouldUpdateMessage:
      generatedDataRes.error ||
      `SUCCESS: Generated article descriptions for "${dbArticleData.title_en}" article`,
  };
};

const extractAndUpdateData = async (
  dbArticleData: IDbCurrentArticle,
  lang: ELanguage
) => {
  const messages = [];

  const { shouldUpdateData, shouldUpdateMessage } = await getAiArticleAbout(
    dbArticleData,
    lang
  );

  if (shouldUpdateMessage) messages.push(shouldUpdateMessage);

  const updateArticle = await updateGeneratedDataDB(
    shouldUpdateData,
    dbArticleData.id,
    lang
  );

  messages.push(
    updateArticle instanceof Error
      ? `ERROR: DB UPDATE data for articles with title "${dbArticleData.title_en}". Error message: ${updateArticle.message}`
      : `SUCCESS: Add ${updateArticle} article descriptions for "${dbArticleData.title_en}" article(s)`
  );

  return { extractAndUpdateMessages: messages };
};

const addDescriptionForArticles = async (quantity: string) => {
  const messages = [];

  for (const lang of Object.keys(translationParams)) {
    const dbArticlesRes = await getSatArticlesFromDB(
      quantity,
      lang as ELanguage
    );
    if (typeof dbArticlesRes === 'string') return [dbArticlesRes];

    for (const article of dbArticlesRes) {
      messages.push(`┌──────────────── "${article.cpu}" ────────────────┐`);
      const { extractAndUpdateMessages } = await extractAndUpdateData(
        article,
        lang as ELanguage
      );
      messages.push(...extractAndUpdateMessages);
      messages.push(`└──────────────────────────┘`);

      await sleep(500);
    }
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
        pathToMainParsePage={`${BASE_URL}/en/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`}
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
