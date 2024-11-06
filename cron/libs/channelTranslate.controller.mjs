import * as cheerio from 'cheerio';
import { EDBTableTitles, sleep, cutBigText } from './commons.mjs';
import { executePoolQuery } from './mysqldb.mjs';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';

const { CHANNELS, FLY_CHANNELS } = EDBTableTitles;

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

const getChannelsFromDB = async (quantity, lang, isOldChannels) => {
  const tblName = isOldChannels ? CHANNELS : FLY_CHANNELS;

  const sql = `
  SELECT title, MAX(text_en) AS text_en
  FROM ${tblName}
  WHERE text${translationParams[lang].suffix} IS NULL
  GROUP BY title
  ORDER BY id DESC
  LIMIT ${quantity};
  `;
  const res = await executePoolQuery(sql);

  return res instanceof Error
    ? `ERROR: SELECT channels from table: "${tblName}". Error message: ${res.message}`
    : res;
};

const updateGeneratedDataDB = async (
  { title, text, description, keywords },
  lang,
  isOldChannels
) => {
  if (!text)
    throw new Error(
      `ERROR: Cannot UPDATE DB. text${translationParams[lang].suffix} is NULL`
    );

  const tblName = isOldChannels ? CHANNELS : FLY_CHANNELS;

  const sql = `
      UPDATE ${tblName}
      SET
        text${translationParams[lang].suffix} = ?,
        description${translationParams[lang].suffix} = ?,
        keywords${translationParams[lang].suffix} = ?
      WHERE title = ?
    `;
  const res = await executePoolQuery(sql, [text, description, keywords, title]);

  if (res instanceof Error)
    throw new Error(
      `ERROR: DB add ${translationParams[lang].translateTo} translation. Error message: ${res.message}`
    );

  return res.affectedRows;
};

const generateAiText = async (currentText, translateTo) => {
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 5000,
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

- Always use in the text and description the original channel's name without translation, without declination and enclose it in Unicode curly quotes (« »).
- The content should be written in the third person, without direct appeals to the reader. 
- Avoid promotional language or calls to action, and focus on providing factual and descriptive content about the channel, its programs, and its significance. The tone should be entirely neutral and informative.

- Make short description of the article in ${translateTo} about 150 - 200 characters length for the <meta name=description>.
- Select relevant search keywords in ${translateTo} that will be used on the page in the <meta name=keywords>.

- Also translate the text of the html-alt attribute

- Articles must be written in ${translateTo}. But write names, surnames, titles and abbreviations in the original language.
- Do not escape the html entity.
- Do not add newline character (\n) into the text.

- Use the HTML format like:
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

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig,
      safetySettings,
      systemInstruction,
    });

    const result = await model.generateContent(currentText);

    const { response } = result;

    return response.text();
  } catch (error) {
    throw new Error(
      `ERROR: AI cannot generate content. Error message: ${error.message}`
    );
  }
};

const extractHtmlFromAi = ($) => {
  const getError = (errName, value = '') =>
    new Error(
      `ERROR: cannot extract channel ${errName}${value ? `: (${value})` : ''} from AI content: ${$.html()}`
    );

  const text = $('#text').html();
  if (!text) throw getError(`TEXT`);

  const description = $('#description').text().trim();
  if (!description) throw getError(`DESCRIPTION`);

  const keywords = cutBigText($('#keywords').text().trim());
  if (!keywords) throw getError(`KEYWORDS`);

  return {
    text,
    description,
    keywords,
  };
};

const extractAndUpdateData = async (dbChannelData, lang, isOldChannels) => {
  const messages = [];

  try {
    const aiText = await generateAiText(
      dbChannelData.text_en,
      translationParams[lang].translateTo
    );

    const extractedAiData = extractHtmlFromAi(cheerio.load(aiText));

    messages.push(
      `SUCCESS: Translated into ${translationParams[lang].translateTo}`
    );

    const updateDbRes = await updateGeneratedDataDB(
      { title: dbChannelData.title, ...extractedAiData },
      lang,
      isOldChannels
    );

    messages.push(
      `SUCCESS: Add ${updateDbRes} channel ${translationParams[lang].translateTo} translation.`
    );

    return messages;
  } catch (error) {
    return [...messages, error.message];
  }
};

export const translateChannels = async (quantity, isOldChannels = false) => {
  const messages = [];

  for (const lang of Object.keys(translationParams)) {
    const dbChannelsRes = await getChannelsFromDB(
      quantity,
      lang,
      isOldChannels
    );

    if (typeof dbChannelsRes === 'string') {
      messages.push(dbChannelsRes);
      continue;
    }

    for (const channel of dbChannelsRes) {
      messages.push(`┌─────── "${channel.title}" ───────┐`);
      const extractAndUpdateMessages = await extractAndUpdateData(
        channel,
        lang,
        isOldChannels
      );
      messages.push(...extractAndUpdateMessages);
      messages.push(`└───────────── ${lang} ─────────────┘`);

      await sleep(500);
    }
  }

  return messages;
};
