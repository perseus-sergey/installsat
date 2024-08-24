import { ELanguage } from '@/models/ui.model';
import { EUrlAdminParam, EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import { MetadataRoute } from 'next';

const { BASE_PATH: ADMIN_BASE } = EUrlAdminParam;
const { SIGN_IN, DELETE_COMMENT_SUBSCRIPTION } = EUrlBaseParam;

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.BASE_URL || MAIN_URL;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        ...Object.values(ELanguage).map((lang) => `/${lang}/${ADMIN_BASE}/`),
        ...Object.values(ELanguage).map((lang) => `/${lang}/${SIGN_IN}/`),
        ...Object.values(ELanguage).map(
          (lang) => `/${lang}/spysok-kanaliv-suputnyka_old/`
        ),
        ...Object.values(ELanguage).map(
          (lang) => `/${lang}/${DELETE_COMMENT_SUBSCRIPTION}/`
        ),
        `/api/auth/`,
        `/tvefir/`,
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
