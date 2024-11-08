import * as cheerio from 'cheerio';
import { EDBTableTitles, sleep, WRONG_CAT_IDS } from './commons.mjs';
import { executePoolQuery } from './mysqldb.mjs';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';

const { ARTICLE } = EDBTableTitles;

const ELanguage = {
  // EN = 'en',
  // UA: 'ua',
  RU: 'ru',
  ES: 'es',
  AR: 'ar',
  DE: 'de',
  FR: 'fr',
  IT: 'it',
};

const {
  //  EN,
  // UA,
  RU,
  ES,
  AR,
  DE,
  FR,
  IT,
} = ELanguage;

const translationParams = {
  // [EN]: { suffix: '_en', translateTo: 'English' },
  // [UA]: { suffix: '', translateTo: 'Ukrainian' },
  [RU]: { suffix: '_ru', translateTo: 'Russian' },
  [ES]: { suffix: '_es', translateTo: 'Spanish' },
  [AR]: { suffix: '_ar', translateTo: 'Arabic' },
  [DE]: { suffix: '_de', translateTo: 'German' },
  [FR]: { suffix: '_fr', translateTo: 'French' },
  [IT]: { suffix: '_it', translateTo: 'Italian' },
};

// SELECT id, title_en, text_en, cpu
//   FROM tbl_useful
//   WHERE text_en IS NOT NULL AND text_en != '' AND text_fr IS NULL
//   AND cat NOT IN (2,0,11,12,13)
//   LIMIT 5

const getArticlesFromDB = async (quantity, lang) => {
  const sql = `
  SELECT id, title_en, text_en, cpu
  FROM ${ARTICLE}
  WHERE text_en IS NOT NULL AND text_en != '' AND text${translationParams[lang].suffix} IS NULL
  AND cat NOT IN ${WRONG_CAT_IDS}
  ORDER BY id DESC
  LIMIT ${quantity};
  `;
  const res = await executePoolQuery(sql);

  return res instanceof Error
    ? `ERROR: SELECT articles from table: "${ARTICLE}". Error message: ${res.message}`
    : res;
};

const updateGeneratedDataDB = async (
  { title, text, description, keywords },
  articleId,
  lang
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
  const res = await executePoolQuery(sql, [
    title,
    text,
    description,
    keywords,
    articleId,
  ]);

  return res instanceof Error ? res : res.affectedRows;
};

const generateAiText = async (articleTitle, currentText, translateTo) => {
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
- Translate the article to ${translateTo}.

- Make short description of the article in ${translateTo} about 150 - 200 characters length for the <meta name=description>.
- Select relevant search keywords in ${translateTo} that will be used on the page in the <meta name=keywords>.

- Also translate the text of the html-alt attribute

- Articles must be written in ${translateTo}. But write names, surnames, titles and abbreviations in the original language.
- Do not escape the html entity.
- Do not add newline character (\n) into the text.

- Use the HTML format like:
  <h1 id='title'>[Title in ${translateTo}]</h1>
  <h3 id='description'>[Description in ${translateTo} (150 - 230 characters maximum)]</h3>
  <h3 id='keywords'>[Keywords in ${translateTo} (150 - 200 characters maximum)]</h3>
  <article id='text'>
    <p>[Html formatted content in ${translateTo}.]</p>
    <p>[Preserve existing HTML tags from the original content and only translate the text inside these tags and alt attributes]</p>
    <p>[Paragraphs wrapped with the <p> tag, preserving other HTML tags like <strong>, <h2>, etc.]</p>
    <p>[**Markdown formatting is strictly prohibited.**]</p>
    <p>[Use <p> for each paragraph and other HTML tags for formatting.]</p>
  </article>
`;

  const prompt = `- Original article title: '${articleTitle}';\n - Original article content:'${currentText}'`;

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

    return response.text();
  } catch (error) {
    return error instanceof Error ? error : new Error('Wrong AI generating');
  }
};

const cutBigText = (text, cutLength = 230) => {
  if (!text) return '';

  let trimmedText = text.trim();

  if (trimmedText.length <= cutLength) return trimmedText;

  trimmedText = text.slice(0, cutLength);
  const lastSpaceIndex = trimmedText.lastIndexOf(' ');

  return lastSpaceIndex !== -1
    ? trimmedText.slice(0, lastSpaceIndex)
    : trimmedText;
};

const extractHtmlFromAi = ($) => {
  const getErrorStr = (errName, value = '') =>
    `ERROR: cannot extract article ${errName}${value ? `: (${value})` : ''} from AI article: ${$.html()}`;

  const title = $('#title').text().trim();
  if (!title) return getErrorStr(`TITLE`);

  const text = $('#text').html();
  if (!text) return getErrorStr(`TEXT`);

  const description = $('#description').text().trim();
  if (!description) return getErrorStr(`DESCRIPTION`);

  const keywords = cutBigText($('#keywords').text().trim());
  if (!keywords) return getErrorStr(`KEYWORDS`);

  return {
    title,
    text,
    description,
    keywords,
  };
};

const getArticleTranslation = async (articleTitle, currentText, lang) => {
  const aiText = await generateAiText(
    articleTitle,
    currentText,
    translationParams[lang].translateTo
  );

  if (aiText instanceof Error) {
    return `ERROR: AI cannot generate content. Article: ${articleTitle}. Error message: ${aiText.message}`;
  }

  const extractedAiData = extractHtmlFromAi(cheerio.load(aiText));

  return extractedAiData;
};

const extractAndUpdateData = async (dbArticleData, lang) => {
  const messages = [];

  const generatedDataRes = await getArticleTranslation(
    dbArticleData.title_en,
    dbArticleData.text_en,
    lang
  );

  if (typeof generatedDataRes === 'string') {
    messages.push(
      `ERROR: ${generatedDataRes}. Article: "${dbArticleData.title_en}"`
    );

    return messages;
  }

  messages.push(
    `SUCCESS: Translate into ${translationParams[lang].translateTo} "${dbArticleData.title_en}" article`
  );

  const updateArticle = await updateGeneratedDataDB(
    generatedDataRes,
    dbArticleData.id,
    lang
  );

  messages.push(
    updateArticle instanceof Error
      ? `ERROR: DB add ${translationParams[lang].translateTo} translation for articles "${dbArticleData.title_en}". Error message: ${updateArticle.message}`
      : `SUCCESS: Add ${updateArticle} article ${translationParams[lang].translateTo} translation for "${dbArticleData.title_en}" article`
  );

  return messages;
};

export const translateArticles = async (quantity) => {
  const messages = [];

  for (const lang of Object.keys(translationParams)) {
    const dbArticles = await getArticlesFromDB(quantity, lang);

    if (typeof dbArticles === 'string') {
      messages.push(dbArticles);
      continue;
    }

    for (const article of dbArticles) {
      messages.push(`┌─────── "${article.cpu}" ───────┐`);
      const extractAndUpdateMessages = await extractAndUpdateData(
        article,
        lang
      );
      messages.push(...extractAndUpdateMessages);
      messages.push(`└───────────── ${lang} ─────────────┘`);

      await sleep(500);
    }
  }

  return messages;
};
