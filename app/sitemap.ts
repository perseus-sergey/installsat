import { getSatMapList } from '@/controllers/siteMap.controller';
import { ELanguage } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = process.env.BASE_URL || '';
  const { UA, EN } = ELanguage;

  const satMapList = await getSatMapList();

  const satMaps = satMapList.map((m) => ({
    url: `${BASE}/${UA}/${EUrlBaseParam.SAT_COVERAGE_MAP}/${m.cpu}`,
    lastModified: new Date(),
    alternates: {
      languages: {
        en: `${BASE}/${EN}/${EUrlBaseParam.SAT_COVERAGE_MAP}/${m.cpu}`,
        uk: `${BASE}/${UA}/${EUrlBaseParam.SAT_COVERAGE_MAP}/${m.cpu}`,
      },
    },
  }));

  return [
    {
      url: `${BASE}/${UA}/${EUrlBaseParam.SAT_COVERAGE_MAP}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          en: `${BASE}/${EN}/${EUrlBaseParam.SAT_COVERAGE_MAP}`,
          uk: `${BASE}/${UA}/${EUrlBaseParam.SAT_COVERAGE_MAP}`,
        },
      },
    },
    ...satMaps,
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
