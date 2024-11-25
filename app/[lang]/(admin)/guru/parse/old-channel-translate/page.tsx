import { Title } from '@/components/ui/Titles/Title';
import { sendMail } from '@/libs/mail/sendMail';
import { poolExecute } from '@/libs/db/mysqldb';
import { ResultSetHeader } from 'mysql2';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { ELanguage } from '@/models/language.model';
import { EDBTableTitles, getDbTableLink } from '@/models/dbTblNames.model';
import { sleep } from '@/libs/utils/sleep';
import { EUrlAdminParam } from '@/models/url/urlAdmin.model';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.BASE_URL;

const { CHANNELS, TBL_LANGUAGE } = EDBTableTitles;

const SIMULTANEOUS_GENERATE_LIMIT = 30;

const RELIABLE_THRESHOLD = 9;

interface IDbChannelDataAbout {
  title: string | null;
  text_ua: string | null;
  text_en: string | null;
  description_en: string | null;
  description_ua: string | null;
  keywords_ua: string | null;
  keywords_en: string | null;
}

interface IGeneratedJson {
  reliable_rate: number;
  title: string;
  text_ua: string;
  text_en: string;
  description_en: string;
  description_ua: string;
  keywords_ua: string;
  keywords_en: string;
}

interface IDbCurrentChannel {
  title: string;
  lang: string;
  text: string;
}

const emptyChannelDescription: IDbChannelDataAbout = {
  title: null,
  text_ua: null,
  text_en: null,
  description_en: null,
  description_ua: null,
  keywords_ua: null,
  keywords_en: null,
};

const getSatChannelsFromDB = async () => {
  const sql = `
  SELECT C.title, MAX(C.text) as text, MAX(L.title) as lang
  FROM ${CHANNELS} AS C
  LEFT JOIN ${TBL_LANGUAGE} AS L ON C.lang = L.id
  WHERE text_en IS NULL
  GROUP BY C.title
  LIMIT ${SIMULTANEOUS_GENERATE_LIMIT};
  `;
  const res = await poolExecute<IDbCurrentChannel[]>(sql);

  return res instanceof Error
    ? `ERROR: SELECT channel titles from satellite: "${CHANNELS}". Error message: ${res.message}`
    : res;
};

const updateGeneratedDataDB = async (
  {
    title,
    text_ua,
    text_en,
    description_en,
    description_ua,
    keywords_ua,
    keywords_en,
  }: IDbChannelDataAbout,
  channelName: string
) => {
  if (!title) return new Error('ERROR: Cannot UPDATE DB. Title is NULL');

  const sql = `
      UPDATE ${CHANNELS}
      SET
        title = ?, 
        text = ?, 
        text_en = ?, 
        description_en = ?, 
        description = ?, 
        keywords = ?, 
        keywords_en = ?
      WHERE title = ? 
    `;
  const res = await poolExecute<ResultSetHeader>(sql, [
    title,
    text_ua,
    text_en,
    description_en,
    description_ua,
    keywords_ua,
    keywords_en,
    channelName,
  ]);

  return res instanceof Error ? res : res.affectedRows;
};

const generateAiText = async (
  channelTitle: string,
  lang: string,
  currentText: string
) => {
  const generationConfig = {
    temperature: 0.5,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 6000,
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

  const prompt = `Channel name: "${channelTitle}"${lang ? `, Probable broadcast or translate language: ${lang}` : ''}, SPECIAL HINT: "${currentText}"`;
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig,
      safetySettings,
      systemInstruction: `
  What do you know about this channel?
  
  Ensure all generated text is presented in a neutral, descriptive tone suitable for an encyclopedia or informative website entry.
  Always use in the text and description the original channel's name without translation, without declination and enclose it in Unicode curly quotes (« »).
  When generating the JSON output, please escape any double quotes within the text with a double backslash (\\). For instance, a phrase like 'He said, "Hello."' should be formatted as 'He said, \\"Hello.\\".'
  The content should be written in the third person, without direct appeals to the reader. 
  Avoid promotional language or calls to action, and focus on providing factual and descriptive content about the channel, its programs, and its significance. The tone should be entirely neutral and informative.
  
  RYRI - Rating of your reliable information about this channel (Number from 0 to 10).
  
  Format the response as JSON in the following format:
  {
    "reliable_rate": [number],
    "title": [string],
    "text_ua": [string],
    "text_en": [string],
    "description_en": [string],
    "description_ua": [string],
    "keywords_ua": [string],
    "keywords_en": [string]
  }
  
  where:
  
  - 'reliable_rate' - RYRI.

  - Only if the RYRI < ${RELIABLE_THRESHOLD}, use a SPECIAL HINT.

  - 'title' - Channel name. (${lang === 'Украинский' ? 'If the name of the channel is written in Russian, translate it into Ukrainian' : `Leave "${channelTitle}"`}). Do not use Unicode curly quotes (« ») here.
  
  - 'description_en', 'description_ua' - Provide a concise description (in English and Ukrainian) for this channel, suitable for a meta description tag for SEO, from 50 to 200 characters in each language.
  
  - 'keywords_en', 'keywords_ua' - List relevant keywords (in English and Ukrainian) for this channel, separated by commas, suitable for a meta keywords tag for SEO, from 50 to 200 characters in each language.
  
  - 'text_en', 'text_ua' - write up to 10 paragraphs (<p>) for each languages (English and Ukrainian) that provide a descriptive overview of the channel. 
    - e.g., '<p>[Paragraph 1]</p><p>[Paragraph 2]</p><p>[Paragraph N]</p>'
   - Do not add newline character (\n).
    - Wrap relevant and important keywords or phrases in <strong> tags to optimize for SEO, ensuring it enhances the readability and value of the content without appearing excessive or spammy.
    - The text must be unique and not plagiarized.
    - Do not insert any links into the content.
    - If the channel is Russian or Belarusian news, write about it in a skeptical style.
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

const extractDataFromAiJson = (aiObject: IGeneratedJson) => {
  const getErrorStr = (errName: string, value = '') =>
    `ERROR: cannot extract channel ${errName}${value ? `: (${value})` : ''} from AI generated descriptions`;

  const reliable_rate = aiObject['reliable_rate'];

  const title = aiObject['title'].trim();
  if (!title)
    return {
      aiDescription: emptyChannelDescription,
      error: getErrorStr('TITLE'),
    };

  const description_en = aiObject['description_en'].trim();
  if (
    !description_en ||
    description_en.length < 30 ||
    description_en.length > 230
  )
    return {
      aiDescription: emptyChannelDescription,
      error: getErrorStr('EN_DESCRIPTION', description_en),
    };

  const keywords_en = aiObject['keywords_en'].trim();
  if (!keywords_en || keywords_en.length < 30 || keywords_en.length > 230)
    return {
      aiDescription: emptyChannelDescription,
      error: getErrorStr('EN_KEYWORDS', keywords_en),
    };

  const description_ua = aiObject['description_ua'].trim();
  if (
    !description_ua ||
    description_ua.length < 30 ||
    description_ua.length > 230
  )
    return {
      aiDescription: emptyChannelDescription,
      error: getErrorStr('UA_DESCRIPTION', description_ua),
    };

  const keywords_ua = aiObject['keywords_ua'].trim();
  if (!keywords_ua || keywords_ua.length < 30 || keywords_ua.length > 230)
    return {
      aiDescription: emptyChannelDescription,
      error: getErrorStr('UA_KEYWORDS', keywords_ua),
    };

  const text_en = aiObject['text_en'].trim();
  if (!text_en || text_en.length < 100)
    return {
      aiDescription: emptyChannelDescription,
      error: getErrorStr('EN_CONTENT'),
    };

  const text_ua = aiObject['text_ua'].trim();
  if (!text_ua || text_ua.length < 100)
    return {
      aiDescription: emptyChannelDescription,
      error: getErrorStr('UA_CONTENT'),
    };

  return {
    aiDescription: {
      reliable_rate,
      title,
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

const generateChannelAbout = async (
  channelTitle: string,
  lang: string,
  currentText: string
) => {
  const aiText = await generateAiText(channelTitle, lang, currentText);

  if (aiText instanceof Error) {
    return {
      aiDescription: emptyChannelDescription,
      error: `ERROR: AI cannot generate content. Channel: ${channelTitle}. Error message: ${aiText.message}`,
    };
  }

  const extractedAiData = extractDataFromAiJson(aiText);

  return extractedAiData;
};

const getAiChannelAbout = async (dbChannelData: IDbCurrentChannel) => {
  const generatedDataRes = await generateChannelAbout(
    dbChannelData.title,
    dbChannelData.lang,
    dbChannelData.text
  );

  return {
    shouldUpdateData: generatedDataRes.aiDescription,
    shouldUpdateMessage:
      generatedDataRes.error ||
      `SUCCESS: Generated channel descriptions for "${dbChannelData.title}" channel`,
  };
};

const extractAndUpdateData = async (dbChannelData: IDbCurrentChannel) => {
  const messages = [];

  const { shouldUpdateData, shouldUpdateMessage } =
    await getAiChannelAbout(dbChannelData);

  if (shouldUpdateMessage) messages.push(shouldUpdateMessage);

  const updateAllChanWithSameTitleRes = await updateGeneratedDataDB(
    shouldUpdateData,
    dbChannelData.title
  );

  messages.push(
    updateAllChanWithSameTitleRes instanceof Error
      ? `ERROR: DB UPDATE data for channels with title "${dbChannelData.title}". Error message: ${updateAllChanWithSameTitleRes.message}`
      : `SUCCESS: Add ${updateAllChanWithSameTitleRes} channel descriptions for "${dbChannelData.title}" channel(s)`
  );

  return { extractAndUpdateMessages: messages };
};

const addDescriptionForChannels = async () => {
  const messages = [];

  const dbChannelsRes = await getSatChannelsFromDB();
  if (typeof dbChannelsRes === 'string') return [dbChannelsRes];

  for (const channel of dbChannelsRes) {
    messages.push(`┌──────────────── "${channel.title}" ────────────────┐`);
    const { extractAndUpdateMessages } = await extractAndUpdateData(channel);
    messages.push(...extractAndUpdateMessages);
    messages.push(`└──────────────────────────┘`);

    await sleep(500);
  }

  return messages;
};

const sendReportMail = async (errorMessages: string[]) => {
  const { renderAsync } = await import('@react-email/render');
  const { ParseTransNews } = await import(
    '@/components/EmailTemplates/parseTransNews.template'
  );

  await sendMail({
    subject: `Generate AI description for "${SIMULTANEOUS_GENERATE_LIMIT}" channels`,
    body: await renderAsync(
      <ParseTransNews
        title={`Generate AI description for "${SIMULTANEOUS_GENERATE_LIMIT}" channels`}
        pathToMainParsePage={`${BASE_URL}/${ELanguage.EN}/${EUrlAdminParam.BASE_PATH}/${EUrlAdminParam.PARSE}`}
        errorMessages={errorMessages}
        dbTableHref={getDbTableLink(EDBTableTitles.CHANNELS)}
        hrefSources=""
      />
    ),
  });
};

export default async function Page() {
  const messages = await addDescriptionForChannels();

  await sendReportMail(messages);

  return (
    <>
      <Title>
        {`Generate description channel data for ${SIMULTANEOUS_GENERATE_LIMIT} channels`}
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
