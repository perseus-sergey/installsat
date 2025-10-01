import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { EDBTableTitles } from './commons.mjs';
import { executePoolQuery } from './mysqldb.mjs';

const { FLY_CHANNELS } = EDBTableTitles;

const RELIABLE_THRESHOLD = 8;

export const emptyChannelDescription = {
  uaText: null,
  enText: null,
  enDescription: null,
  uaDescription: null,
  uaKeywords: null,
  enKeywords: null,
  siteUrl: null,
  genreId: 0,
};

const fullEmptyDescription = { ...emptyChannelDescription, genreId: null };

// interface IChannelAbout {
//   uaText: string;
//   enText: string;
//   enDescription: string;
//   uaDescription: string;
//   uaKeywords: string;
//   enKeywords: string;
//   siteUrl: string;
//   genreId: number;
// }

const generateAiText = async ({ channelTitle, language, ifRadio }) => {
  const tvRadio =
    ifRadio === undefined || ifRadio === null
      ? 'TV or radio'
      : ifRadio === 1
        ? 'radio'
        : 'TV';

  const generationConfig = {
    temperature: 0.2, // Строгіше та менш креативно
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 4000,
    responseMimeType: 'text/plain',
    stopSequences: ['something for everyone'],
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

  const prompt = `Channel name: "${channelTitle}"${language ? `, Probable broadcast or translate language: ${language}` : ''}`;

  const systemInstruction = `
You are an expert data annotator and TV metadata researcher.

If you do not have sufficient, reliable, or verifiable data about the channel "${channelTitle}", DO NOT generate content. 
If such data is unavailable, return "NULL" for all fields, and set "reliable-rate" to a number between 0 and 3.

Strictly avoid any speculative, assumptive, or vague language. Do NOT use phrases like "probably", "might", "it is assumed", "perhaps", or "could be". Only generate factual content when confident.

Do not hallucinate or invent any information about this ${tvRadio} channel's country, content, audience, programs, or format.

Do NOT guess based on the name alone. Do NOT fabricate a plausible-sounding description. Do NOT fill required fields if uncertain.

Do not provide any links unless you are certain they point to the official site. Leave the field empty otherwise.

Always use the original channel name as-is (without translation or declension), surrounded by Unicode curly quotes (« »).

All content must be neutral, informative, and written in third person — suitable for an encyclopedia.

If reliable information **is available**, return structured JSON in the following format:

{
  "reliable-rate": [number from 0 to 10],
  "category-number": [number 1–14],
  "text-ua": [string or "NULL"],
  "text-en": [string or "NULL"],
  "description-en": [string or "NULL"],
  "description-ua": [string or "NULL"],
  "keywords-ua": [string or "NULL"],
  "keywords-en": [string or "NULL"],
  "site-url": [string or ""]
}

Field explanations:
- "reliable-rate": your confidence level (RYRI score).
- "description-*": If RYRI < ${RELIABLE_THRESHOLD}, set to "NULL". Else, generate concise meta descriptions (50–200 characters).
- "keywords-*": If RYRI < ${RELIABLE_THRESHOLD}, set to "NULL". Else, comma-separated SEO keywords (50–200 characters).
- "text-*": If RYRI < ${RELIABLE_THRESHOLD}, set to "NULL". Else, write up to 10 <p> paragraphs with important <strong> tags, no newlines.
- "site-url": If unsure about an official website, set to "".
- "category-number": Choose from:
  1. Public channels broadcasting shows/news
  2. News/business
  3. Movies
  4. Sports
  5. Entertainment/music
  6. For kids
  7. Adults/XXX
  8. Music
  9. Education/science/history
  10. Humor/entertainment
  11. Leisure/sports/hobbies
  12. Religious/spiritual
  13. TV sales/shopping
  14. Fashion
`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig,
      safetySettings,
      systemInstruction,
    });

    const result = await model.generateContent(prompt);
    const { response } = result;

    const rawText = response.text();
    const startIndex = rawText.indexOf('{');
    const endIndex = rawText.lastIndexOf('}') + 1;
    const cleanResult = rawText.slice(startIndex, endIndex);

    return JSON.parse(cleanResult);
  } catch (error) {
    return error instanceof Error
      ? error
      : new Error('AI JSON response failed to parse');
  }
};

const extractDataFromAiJson = (aiObject) => {
  const getErrorStr = (errName) =>
    `ERROR: cannot extract channel ${errName} from AI generated descriptions`;

  const reliableRate = parseInt(aiObject['reliable-rate'], 10);
  if (isNaN(reliableRate))
    return {
      aiDescription: fullEmptyDescription,
      error: getErrorStr('RELIABLE-RATE'),
    };
  if (reliableRate < RELIABLE_THRESHOLD)
    return {
      aiDescription: emptyChannelDescription,
      error: `${reliableRate} < allowed threshold (${RELIABLE_THRESHOLD})`,
    };

  const enDescription = aiObject['description-en'].trim();
  if (!enDescription || enDescription.length < 50 || enDescription.length > 230)
    return {
      aiDescription: fullEmptyDescription,
      error: getErrorStr('EN_DESCRIPTION'),
    };

  const enKeywords = aiObject['keywords-en'].trim();
  if (!enKeywords || enKeywords.length < 50 || enKeywords.length > 230)
    return {
      aiDescription: fullEmptyDescription,
      error: getErrorStr('EN_KEYWORDS'),
    };

  const siteUrl = aiObject['site-url'].trim();
  if (siteUrl.length > 150)
    return {
      aiDescription: fullEmptyDescription,
      error: `ERROR: Extracting Site URL from AI generated. Length: ${siteUrl.length} characters > 150 allowed`,
    };

  const genreId = parseInt(aiObject['category-number'], 10);
  if (!genreId)
    return {
      aiDescription: fullEmptyDescription,
      error: getErrorStr('GENRE_ID'),
    };

  const uaDescription = aiObject['description-ua'].trim();
  if (!uaDescription || uaDescription.length < 50 || uaDescription.length > 230)
    return {
      aiDescription: fullEmptyDescription,
      error: getErrorStr('UA_DESCRIPTION'),
    };

  const uaKeywords = aiObject['keywords-ua'].trim();
  if (!uaKeywords || uaKeywords.length < 50 || uaKeywords.length > 230)
    return {
      aiDescription: fullEmptyDescription,
      error: getErrorStr('UA_KEYWORDS'),
    };

  const enText = aiObject['text-en'].trim();
  if (!enText || enText.length < 100)
    return {
      aiDescription: fullEmptyDescription,
      error: getErrorStr('EN_CONTENT'),
    };

  const uaText = aiObject['text-ua'].trim();
  if (!uaText || uaText.length < 100)
    return {
      aiDescription: fullEmptyDescription,
      error: getErrorStr('UA_CONTENT'),
    };

  return {
    aiDescription: {
      uaText,
      siteUrl,
      enText,
      enDescription,
      uaDescription,
      uaKeywords,
      enKeywords,
      genreId,
      reliableRate,
    },
    error: null,
  };
};

export const updateGeneratedDataDB = async (
  {
    uaText,
    enText,
    ruText,
    esText,
    arText,
    deText,
    frText,
    itText,

    uaDescription,
    enDescription,
    ruDescription,
    esDescription,
    arDescription,
    deDescription,
    frDescription,
    itDescription,

    uaKeywords,
    enKeywords,
    ruKeywords,
    esKeywords,
    arKeywords,
    deKeywords,
    frKeywords,
    itKeywords,

    logo,
    siteUrl,
    genreId,
  },
  channelName,
  isForceUpdate = false
) => {
  const sql = `
      UPDATE ${FLY_CHANNELS}
      SET 
        text_ua = ?,
        text_en = ?,
        text_ru = ?,
        text_es = ?,
        text_ar = ?,
        text_de = ?,
        text_fr = ?,
        text_it = ?,
        description_ua = ?,
        description_en = ?,
        description_ru = ?,
        description_es = ?,
        description_ar = ?,
        description_de = ?,
        description_fr = ?,
        description_it = ?,
        keywords_ua = ?,
        keywords_en = ?,
        keywords_ru = ?,
        keywords_es = ?,
        keywords_ar = ?,
        keywords_de = ?,
        keywords_fr = ?,
        keywords_it = ?,
        logo = ?, 
        official_site_url = ?, 
        theme_id = ?
      WHERE title = ? 
      ${isForceUpdate ? '' : 'AND (description_en IS NULL OR description_en = "")'}
    `;
  const res = await executePoolQuery(sql, [
    uaText,
    enText,
    ruText,
    esText,
    arText,
    deText,
    frText,
    itText,

    uaDescription,
    enDescription,
    ruDescription,
    esDescription,
    arDescription,
    deDescription,
    frDescription,
    itDescription,

    uaKeywords,
    enKeywords,
    ruKeywords,
    esKeywords,
    arKeywords,
    deKeywords,
    frKeywords,
    itKeywords,

    logo,
    siteUrl,
    genreId,
    channelName,
  ]);

  return res instanceof Error ? res : res.affectedRows;
};

export const generateChannelAbout = async ({
  channelTitle,
  language,
  ifRadio,
}) => {
  const aiText = await generateAiText({ channelTitle, language, ifRadio });

  if (aiText instanceof Error) {
    return {
      aiDescription: fullEmptyDescription,
      error: `ERROR: AI cannot generate content. Channel: ${channelTitle}. Error message: ${aiText.message}`,
    };
  }

  if (!aiText) {
    return {
      aiDescription: fullEmptyDescription,
      error: `ERROR: AI cannot generate content. Channel: ${channelTitle}`,
    };
  }

  const extractedAiData = extractDataFromAiJson(aiText);

  return extractedAiData;
};
