import { GoogleGenerativeAI } from '@google/generative-ai';
import { EDBTableTitles } from './commons.mjs';
import { executePoolQuery } from './mysqldb.mjs';

const { FLY_CHANNELS } = EDBTableTitles;

const RELIABLE_THRESHOLD = 8;

const generateAiText = async ({ channelTitle, language, ifRadio }) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const tvRadio =
    ifRadio === undefined || ifRadio === null
      ? 'TV or radio'
      : ifRadio === 1
        ? 'radio'
        : 'TV';

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: `
What do you know about this ${tvRadio} channel?
The name of the channel is written as a transcription of the original name, so determine the country of origin of the channel yourself.

Ensure all generated text is presented in a neutral, descriptive tone suitable for an encyclopedia or informative website entry.
Always use the original channel's name without translation, without declination and enclose it in Unicode curly quotes (« »).
The content should be written in the third person, without direct appeals to the reader. 
Avoid promotional language or calls to action, and focus on providing factual and descriptive content about the channel, its programs, and its significance. The tone should be entirely neutral and informative.

RYRI - Rating of your reliable information about this channel (Number from 0 to 10).

Use this JSON schema:
{
  "type": "object",
  "properties": {
    "reliable-rate": {
      "type": "number"
    },
    "category-number": {
      "type": "number"
    },
    "description-en": {
      "type": "string"
    },
    "description-ua": {
      "type": "string"
    },
    "keywords-en": {
      "type": "string"
    },
    "keywords-ua": {
      "type": "string"
    },
    "text-en": {
      "type": "string"
    },
    "text-ua": {
      "type": "string"
    },
    "languages": {
      "type": "string"
    },
    "site-url": {
      "type": "string"
    }
  }
}

where:

- 'reliable-rate' - RYRI.

- 'description-en', 'description-ua' - If RYRI < ${RELIABLE_THRESHOLD}, insert "NULL", otherwise Provide a concise description (in English and Ukrainian) for this channel, suitable for a meta description tag for SEO, up to 200 characters in each language.

- 'keywords-en', 'keywords-ua' - If RYRI < ${RELIABLE_THRESHOLD}, insert "NULL", otherwise List relevant keywords (in English and Ukrainian) for this channel, separated by commas, suitable for a meta keywords tag for SEO, up to 200 characters in each language.

- 'text-en', 'text-ua' - If RYRI < ${RELIABLE_THRESHOLD}, insert "NULL", otherwise write up to 10 paragraphs (<p>) for each languages (English and Ukrainian) that provide a descriptive overview of the channel. 
  - e.g., '<p>[Paragraph 1]</p><p>[Paragraph 2]</p><p>[Paragraph N]</p>'
 - Do not add newline character (\n).
  - Wrap relevant and important keywords or phrases in <strong> tags to optimize for SEO, ensuring it enhances the readability and value of the content without appearing excessive or spammy.
  - The text must be unique and not plagiarized.
  - Do not insert any links into the content.
  - If the channel is Russian news, write about it in a skeptical style.

- 'languages' - Specify the main language of the channel (e.g., English, Persian). Up to 150 characters.

- 'site-url' - Include the URL of the official site for this channel. If you are not sure about the existence of such a site, leave the field blank ("").

- 'category-number' - Choose a category number that best describes the channel from the following list:
   - 1 - Public
   - 2 - News
   - 3 - Movies
   - 4 - Sport
   - 5 - Leisure, entertainment
   - 6 - For Kids
   - 7 - XXX, Adults
   - 8 - Music
   - 9 - Educational
   - 10 - Entertainment, Humor
   - 11 - Leisure, Sports, Entertainment
   - 12 - Religious, Spiritual
   - 13 - TV Sales
   - 14 - Fashion
   `,
  });

  const generationConfig = {
    temperature: 0.5,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 4000,
    responseMimeType: 'text/plain',
  };

  // Channel name: "Gamma Cinema 5", Probable broadcast language: العربية (Arabic)

  const prompt = `Channel name: "${channelTitle}"${language ? `, Probable broadcast or translate language: ${language}` : ''}`;

  console.log('🚀 ~ generateAiText ~ prompt:', prompt);
  const result = await model.generateContent(prompt, generationConfig);

  const { response } = result;
  const cleanResult = response.text().replace(/```json|```/g, '');

  try {
    const jsonParsed = JSON.parse(cleanResult);

    return jsonParsed;
  } catch (error) {
    return error instanceof Error ? error : new Error('Wrong JSON response');
  }
};

const extractDataFromAiJson = (aiObject) => {
  const getErrorStr = (errName) =>
    `ERROR: cannot extract channel ${errName} from AI channel: ${$.html()}`;

  const reliableRate = Number(aiObject['reliable-rate']);
  if (!reliableRate || reliableRate < RELIABLE_THRESHOLD)
    return `ERROR: Reliable AI Rate ${reliableRate} < allowed threshold (${RELIABLE_THRESHOLD})`;

  const enDescription = aiObject['description-en'].trim();
  if (!enDescription) return getErrorStr('EN_DESCRIPTION');

  const enKeywords = aiObject['keywords-en'].trim();
  if (!enKeywords) return getErrorStr('EN_KEYWORDS');

  const languages = aiObject['languages'].trim();
  // if (!languages) return getErrorStr('LANGUAGES');

  const siteUrl = aiObject['site-url'].trim();
  // if (!siteUrl) return getErrorStr('SITE_URL');

  const genreId = aiObject['category-number'];
  if (!genreId) return getErrorStr('GENRE_ID');

  const uaDescription = aiObject['description-ua'].trim();
  if (!uaDescription) return getErrorStr('UA_DESCRIPTION');

  const uaKeywords = aiObject['keywords-ua'].trim();
  if (!uaKeywords) return getErrorStr('UA_KEYWORDS');

  const enText = aiObject['text-en'].trim();
  if (!enText) return getErrorStr('EN_CONTENT');

  const uaText = aiObject['text-ua'].trim();
  if (!uaText) return getErrorStr('UA_CONTENT');

  return {
    uaText,
    languages,
    siteUrl,
    enText,
    enDescription,
    uaDescription,
    uaKeywords,
    enKeywords,
    genreId,
    reliableRate,
  };
};

// interface IChannelAbout {
//   uaText: string;
//   enText: string;
//   enDescription: string;
//   uaDescription: string;
//   uaKeywords: string;
//   enKeywords: string;
//   languages: string;
//   siteUrl: string;
//   genreId: number;
// }

export const updateGeneratedDataDB = async (
  {
    uaText,
    enText,
    enDescription,
    uaDescription,
    uaKeywords,
    enKeywords,
    languages,
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
        languages = ?, 
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
    languages,
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
    return `ERROR: AI cannot generate content. Channel: ${channelTitle}. Error message: ${aiText.message}`;
  }

  if (!aiText) {
    return `ERROR: AI cannot generate content. Channel: ${channelTitle}`;
  }

  const extractedAiData = extractDataFromAiJson(aiText);

  return typeof extractedAiData === 'string'
    ? `${extractedAiData}. Channel: ${channelTitle}`
    : extractedAiData;
};
