import { EUrlAdminParam, EUrlBaseParam } from '@/models/url.model';
import { MetadataRoute } from 'next';

const { BASE_PATH } = EUrlAdminParam;
const { SIGN_IN, DELETE_COMMENT_SUBSCRIPTION } = EUrlBaseParam;

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.BASE_URL;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        `/${BASE_PATH}/`,
        `/api/auth/`,
        `/${SIGN_IN}/`,
        `/${DELETE_COMMENT_SUBSCRIPTION}/`,
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
