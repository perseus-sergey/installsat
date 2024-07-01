import { getSatMapList } from '@/controllers/siteMap.controller';
import { ELanguage } from '@/models/ui.model';
import { EUrlBaseParam, MAIN_URL } from '@/models/url.model';
import { MetadataRoute } from 'next';

const BASE = process.env.BASE_URL || MAIN_URL;
const { UA, EN } = ELanguage;
const { SAT_COVERAGE_MAP } = EUrlBaseParam;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const satMapList = await getSatMapList();

  return [
    {
      url: `${BASE}/${UA}/${SAT_COVERAGE_MAP}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${BASE}/${EN}/${SAT_COVERAGE_MAP}`,
          uk: `${BASE}/${UA}/${SAT_COVERAGE_MAP}`,
        },
      },
    },
    ...satMapList.map((m) => ({
      url: `${BASE}/${UA}/${SAT_COVERAGE_MAP}/${m.cpu}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${BASE}/${EN}/${SAT_COVERAGE_MAP}/${m.cpu}`,
          uk: `${BASE}/${UA}/${SAT_COVERAGE_MAP}/${m.cpu}`,
        },
      },
    })),
  ];
  // return products.map((product) => ({
  //   url: `${BASE_URL}/product/${id}`,
  //   lastModified: product.date,
  // }))

  // return [
  //   {
  //     url: BASE,
  //     lastModified: new Date(),
  //     alternates: {
  //       languages: {
  //         es: 'https://acme.com/es',
  //         de: 'https://acme.com/de',
  //       },
  //     },
  //   },
  //   {
  //     url: 'https://acme.com/about',
  //     lastModified: new Date(),
  //     alternates: {
  //       languages: {
  //         es: 'https://acme.com/es/about',
  //         de: 'https://acme.com/de/about',
  //       },
  //     },
  //   },
  //   {
  //     url: 'https://acme.com/blog',
  //     lastModified: new Date(),
  //     alternates: {
  //       languages: {
  //         es: 'https://acme.com/es/blog',
  //         de: 'https://acme.com/de/blog',
  //       },
  //     },
  //   },
  // ];
}
