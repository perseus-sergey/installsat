import { ELanguage, languageMap } from '@/models/language.model';
import { MAIN_URL } from '@/models/url/url.model';

const BASE_URL = process.env.BASE_URL || MAIN_URL;

export const generateJsonLd = ({
  lang,
  title,
  description,
  keywords,
  articleBody,
  relativeImgPath,
  relativePagePath,
  datePublished,
  dateModified,
  ...rest
}: {
  lang: ELanguage;
  title: string;
  description: string;
  keywords: string;
  articleBody: string;
  relativePagePath: string;
  relativeImgPath?: string;
  datePublished?: Date | null;
  dateModified?: Date | null;
  [key: string]: string | Date | null | undefined;
}) => {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Article',
    headline: title,

    inLanguage: languageMap[lang],

    ...(relativeImgPath
      ? {
          image: {
            '@type': 'ImageObject',
            url: `${BASE_URL}${relativeImgPath}`,
          },
        }
      : {}),

    author: {
      '@type': 'Person',
      name: 'Installsat',
    },

    ...(datePublished
      ? { datePublished: datePublished.toISOString() }
      : dateModified
        ? { datePublished: dateModified.toISOString() }
        : {}),

    ...(dateModified
      ? { dateModified: dateModified.toISOString() }
      : datePublished
        ? { dateModified: datePublished.toISOString() }
        : {}),

    description,

    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/${lang}${relativePagePath}`,
    },

    publisher: {
      '@type': 'Organization',
      name: 'Installsat.tv', // Your website name
      url: `${BASE_URL}/${lang}`,
      logo: {
        // Optional: Your website logo URL
        '@type': 'ImageObject',
        url: `${BASE_URL}/Images/InstallsatOrig_400.png`,
      },
    },

    ...(keywords ? { keywords } : {}),
    articleBody, //  The main text content (might be too long for search engines; consider using a summary)
    ...rest,
  };
};
