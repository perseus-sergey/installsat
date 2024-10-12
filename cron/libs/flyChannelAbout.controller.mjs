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
    temperature: 0.5,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 4000,
    stopSequences: ['something for everyone'],
    responseMimeType: 'text/plain',
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  // Channel name: "Gamma Cinema 5", Probable broadcast language: العربية (Arabic)

  const prompt = `Channel name: "${channelTitle}"${language ? `, Probable broadcast or translate language: ${language}` : ''}`;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig,
      safetySettings,
      systemInstruction: `
  What do you know about this ${tvRadio} channel?
  The name of the channel is written as a transcription of the original name, so determine the country of origin of the channel yourself.
  
  Ensure all generated text is presented in a neutral, descriptive tone suitable for an encyclopedia or informative website entry.
  Always use the original channel's name without translation, without declination and enclose it in Unicode curly quotes (« »).
  The content should be written in the third person, without direct appeals to the reader. 
  Avoid promotional language or calls to action, and focus on providing factual and descriptive content about the channel, its programs, and its significance. The tone should be entirely neutral and informative.
  
  RYRI - Rating of your reliable information about this channel (Number from 0 to 10).
  
  Format the response as JSON in the following format:
  {
    "reliable-rate": [number],
    "category-number": [number],
    "text-ua": [string],
    "text-en": [string],
    "description-en": [string],
    "description-ua": [string],
    "keywords-ua": [string],
    "keywords-en": [string]
    "site-url": [string]
  }
  
  where:
  
  - 'reliable-rate' - RYRI.
  
  - 'description-en', 'description-ua' - If RYRI < ${RELIABLE_THRESHOLD}, insert "NULL", otherwise Provide a concise description (in English and Ukrainian) for this channel, suitable for a meta description tag for SEO, from 50 to 200 characters in each language.
  
  - 'keywords-en', 'keywords-ua' - If RYRI < ${RELIABLE_THRESHOLD}, insert "NULL", otherwise List relevant keywords (in English and Ukrainian) for this channel, separated by commas, suitable for a meta keywords tag for SEO, from 50 to 200 characters in each language.
  
  - 'text-en', 'text-ua' - If RYRI < ${RELIABLE_THRESHOLD}, insert "NULL", otherwise write up to 10 paragraphs (<p>) for each languages (English and Ukrainian) that provide a descriptive overview of the channel. 
    - e.g., '<p>[Paragraph 1]</p><p>[Paragraph 2]</p><p>[Paragraph N]</p>'
   - Do not add newline character (\n).
    - Wrap relevant and important keywords or phrases in <strong> tags to optimize for SEO, ensuring it enhances the readability and value of the content without appearing excessive or spammy.
    - The text must be unique and not plagiarized.
    - Do not insert any links into the content.
    - If the channel is Russian or Belarusian news, write about it in a skeptical style.
  
  - 'site-url' - Include the URL of the official site for this channel. If you are not sure about the existence of such a site, leave the field blank ("").
  
  - 'category-number' - Choose a category number that best describes the channel from the following list:
     - 1 - Public channels broadcasting popular shows, programs, movies and news
     - 2 - News and business channels
     - 3 - Movies
     - 4 - Sport
     - 5 - Leisure, entertainment, popular talk shows, movies, music
     - 6 - For Kids
     - 7 - XXX, Adults
     - 8 - Music
     - 9 - Educational content, science, nature, history 
     - 10 - Entertainment, Humor
     - 11 - Leisure, Sports, Entertainment. About hobbies, non-traditional sports
     - 12 - Religious and spiritual channels offering content related to various beliefs and spiritual practices
     - 13 - TV Sales, shopping channels and infomercial networks 
     - 14 - Fashion
     `,
    });

    const result = await model.generateContent(prompt);

    const { response } = result;

    const startIndex = response.text().indexOf('{');
    const endIndex = response.text().lastIndexOf('}') + 1;

    const cleanResult = response.text().slice(startIndex, endIndex);

    return JSON.parse(cleanResult);
  } catch (error) {
    return error instanceof Error
      ? error
      : new Error('Wrong AI generation of JSON parsing');
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
    enDescription,
    uaDescription,
    uaKeywords,
    enKeywords,
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
        description_en = ?, 
        description_ua = ?, 
        keywords_ua = ?, 
        keywords_en = ?, 
        official_site_url = ?, 
        theme_id = ?
      WHERE title = ? 
      ${isForceUpdate ? '' : 'AND (description_en IS NULL OR description_en = "")'}
    `;
  const res = await executePoolQuery(sql, [
    uaText,
    enText,
    enDescription,
    uaDescription,
    uaKeywords,
    enKeywords,
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
