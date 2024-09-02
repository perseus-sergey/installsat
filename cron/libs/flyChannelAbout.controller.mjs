import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';
import { EDBTableTitles } from './commons.mjs';
import { executePoolQuery } from './mysqldb.mjs';

const { FLY_CHANNELS } = EDBTableTitles;

const getChannelPrompt = (channelTitle) => {
  return `
    Generate an HTML formatted text about the channel "${channelTitle}" that includes the following elements:

    1. <div id='description-en'>[Description]</div><div id='description-ua'>[Опис]</div>: Provide a concise description (in English and Ukrainian) for this channel, suitable for a meta description tag for SEO, up to 200 characters in each language.

    2. <div id='keywords-en'>[Keywords]</div><div id='keywords-ua'>[Ключові слова]</div>: List relevant keywords (in English and Ukrainian) for this channel, separated by commas, suitable for a meta keywords tag for SEO, up to 200 characters in each language.
    
    3. <div id='languages'>[Main language]</div>: Specify the main language of the channel (e.g., English, Persian).

    4. <div id='site-url'>[Url of official site]</div>: Include the URL of the official site for this channel. if not available, leave the tag blank.

    5. <div id='category-number'>[n]</div>: Choose a category number that best describes the channel from the following list:
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

    6. <div id='text-en'><p>[Paragraph 1]</p><p>[Paragraph 2]</p><p>[Paragraph N]</p></div>
    <div id='text-ua'><p>[Параграф 1]</p><p>[Параграф 2]</p><p>[Параграф N]</p></div> 
    : Write up to 10 paragraphs (<p>) for each languages (English and Ukrainian) that provide a descriptive overview of the channel. Wrap relevant and important keywords or phrases in <strong> tags to optimize for SEO, ensuring it enhances the readability and value of the content without appearing excessive or spammy. The text must be unique and not plagiarized.

    Ensure all generated text is presented in a neutral, descriptive tone suitable for an encyclopedia or informative website entry.
    Always use the original channel's name without translation and enclose it in Unicode curly quotes (« »).
    The content should be written in the third person. 
    Avoid promotional language or calls to action, and focus on providing factual and descriptive content about the channel, its programs, and its significance. The tone should be entirely neutral and informative.
    If you have no information about this channel, return: "",
  `;
};

const generateAiText = async (channelTitle) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = getChannelPrompt(channelTitle);

  const result = await model.generateContent(prompt);
  const response = result.response;

  return response.text();
};

const extractDataFromAiHTML = ($) => {
  const getErrorStr = (errName) =>
    `ERROR: cannot extract channel ${errName} from AI channel: ${$.html()}`;

  const enDescription = $('#description-en').text().trim();
  if (!enDescription) return getErrorStr('EN_DESCRIPTION');

  const enKeywords = $('#keywords-en').text().trim();
  if (!enKeywords) return getErrorStr('EN_KEYWORDS');

  const languages = $('#languages').text().trim();
  // if (!languages) return getErrorStr('LANGUAGES');

  const siteUrl = $('#site-url').text().trim();
  // if (!siteUrl) return getErrorStr('SITE_URL');

  const genreId = $('#category-number').text().trim();
  if (!genreId) return getErrorStr('GENRE_ID');

  const enText = $('#text-en').html();
  if (!enText) return getErrorStr('EN_CONTENT');

  const uaDescription = $('#description-ua').text().trim();
  if (!uaDescription) return getErrorStr('UA_DESCRIPTION');

  const uaKeywords = $('#keywords-ua').text().trim();
  if (!uaKeywords) return getErrorStr('UA_KEYWORDS');

  const uaText = $('#text-ua').html();
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
    genreId: Number(genreId),
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
  channelName
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

export const generateChannelAbout = async (channelTitle) => {
  const aiText = await generateAiText(channelTitle);

  if (!aiText) {
    return `ERROR: AI cannot generate content. Channel: ${channelTitle}`;
  }

  const extractedAiData = extractDataFromAiHTML(cheerio.load(aiText));

  return typeof extractedAiData === 'string'
    ? `${extractedAiData}. Channel: ${channelTitle}`
    : extractedAiData;
};
