import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';
import { EDBTableTitles } from './commons.mjs';
import { executePoolQuery } from './mysqldb.mjs';

const { FLY_CHANNELS } = EDBTableTitles;

const RELIABLE_THRESHOLD = 8;

const generateAiText = async ({ channelTitle, language, ifRadio }) => {
  const tvRadio =
    ifRadio === undefined || ifRadio === null
      ? 'TV or radio'
      : ifRadio === 1
        ? 'radio'
        : 'TV';

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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
  What do you know about this ${tvRadio} channel?
  The name of the channel is written as a transcription of the original name, so determine the country of origin of the channel yourself.
  
  Ensure all generated text is presented in a neutral, descriptive tone suitable for an encyclopedia or informative website entry.
  Always use the original channel's name without translation, without declination and enclose it in Unicode curly quotes (« »).
  The content should be written in the third person, without direct appeals to the reader. 
  Avoid promotional language or calls to action, and focus on providing factual and descriptive content about the channel, its programs, and its significance. The tone should be entirely neutral and informative.
  
  RYRI - Rating of your reliable information about this channel (Number from 0 to 10).
 
  Write the answer in HTML format with the following structure:
  
  1. <div id='reliable-rate'>[RYRI]</div>
  
  2. <div id='description-en'>[RYRI < ${RELIABLE_THRESHOLD} ? 'NULL' : Description in English]</div><div id='description-ua'>[RYRI < ${RELIABLE_THRESHOLD} ? 'NULL' : Description in Ukrainian]</div>: If RYRI < ${RELIABLE_THRESHOLD}, insert "NULL", otherwise Provide a concise description (in English and Ukrainian) for this channel, suitable for a meta description tag for SEO, up to 200 characters in each language.
  
  3. <div id='keywords-en'>[RYRI < ${RELIABLE_THRESHOLD} ? 'NULL' : Keywords in English]</div><div id='keywords-ua'>[RYRI < ${RELIABLE_THRESHOLD} ? 'NULL' : Keywords in Ukrainian]</div>: If RYRI < ${RELIABLE_THRESHOLD}, insert "NULL", otherwise List relevant keywords (in English and Ukrainian) for this channel, separated by commas, suitable for a meta keywords tag for SEO, up to 200 characters in each language.
  
  4. <div id='site-url'>[Url of official site]</div>: Include the URL of the official site for this channel. if not available, leave the tag blank.
  
  5. <div id='category-number'>[number]</div>: Choose a category number that best describes the channel from the following list:
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
  
  6. <div id='text-en'><p>[Paragraph 1]</p><p>[Paragraph 2]</p><p>[Paragraph N]</p></div>
  <div id='text-ua'><p>[Параграф 1]</p><p>[Параграф 2]</p><p>[Параграф N]</p></div>
  : If RYRI < ${RELIABLE_THRESHOLD}, insert "NULL", otherwise write up to 10 paragraphs (<p>) for each languages (English and Ukrainian) that provide a descriptive overview of the channel.
    - Wrap relevant and important keywords or phrases in <strong> tags to optimize for SEO, ensuring it enhances the readability and value of the content without appearing excessive or spammy.
    - The text must be unique and not plagiarized.
    - Do not insert any links into the content.
    - If the channel is Russian or Belarusian news, write about it in a skeptical style.
  
  Use existing data, don't invent it.
  Ensure all generated text is presented in a neutral, descriptive tone suitable for an encyclopedia or informative website entry.
  Always use the original channel's name without translation and enclose it in Unicode curly quotes (« »).
  The content should be written in the third person.
  Avoid promotional language or calls to action, and focus on providing factual and descriptive content about the channel, its programs, and its significance. The tone should be entirely neutral and informative.
  `;

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    generationConfig,
    safetySettings,
    systemInstruction,
  });

  // Channel name: "Gamma Cinema 5", Probable broadcast language: العربية (Arabic)

  const prompt = `Channel name: "${channelTitle}"${language ? `, Probable broadcast language: ${language}` : ''}`;

  const result = await model.generateContent(prompt, generationConfig);

  const { response } = result;

  return response.text();
};

const extractDataFromAiHTML = ($) => {
  const getErrorStr = (errName) =>
    `ERROR: cannot extract channel ${errName} from AI channel: ${$.html()}`;

  const reliableRate = parseInt($('#reliable-rate').text().trim(), 10);
  if (isNaN(reliableRate)) return getErrorStr('RELIABLE-RATE');

  if (reliableRate < RELIABLE_THRESHOLD)
    return `ERROR: Reliable AI Rate ${reliableRate} < allowed threshold (${RELIABLE_THRESHOLD})`;

  const enDescription = $('#description-en').text().trim();
  if (!enDescription || enDescription.length < 40)
    return getErrorStr('EN_DESCRIPTION');

  const enKeywords = $('#keywords-en').text().trim();
  if (!enKeywords || enKeywords.length < 40) return getErrorStr('EN_KEYWORDS');

  const siteUrl = $('#site-url').text().trim();
  if (siteUrl.length > 150)
    return `ERROR: Extracting Site URL from AI generated. Length: ${siteUrl.length} characters > 150 allowed`;

  const genreId = parseInt($('#category-number').text().trim(), 10);
  if (!genreId) return getErrorStr('GENRE_ID');

  const enText = $('#text-en').html();
  if (!enText || enText.length < 100) return getErrorStr('EN_CONTENT');

  const uaDescription = $('#description-ua').text().trim();
  if (!uaDescription || uaDescription.length < 40)
    return getErrorStr('UA_DESCRIPTION');

  const uaKeywords = $('#keywords-ua').text().trim();
  if (!uaKeywords || uaKeywords.length < 40) return getErrorStr('UA_KEYWORDS');

  const uaText = $('#text-ua').html();
  if (!uaText || uaText.length < 100) return getErrorStr('UA_CONTENT');

  return {
    uaText,
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
  const aiText = await generateAiText({
    channelTitle,
    language,
    ifRadio,
  });

  if (!aiText) {
    return `ERROR: AI cannot generate content. Channel: ${channelTitle}`;
  }

  const extractedAiData = extractDataFromAiHTML(cheerio.load(aiText));

  return typeof extractedAiData === 'string'
    ? `${extractedAiData}. Channel: ${channelTitle}`
    : extractedAiData;
};
