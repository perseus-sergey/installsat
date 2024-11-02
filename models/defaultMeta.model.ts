import { ELanguage } from './language.model';

export const DEFAULT_META_DATA = {
  [ELanguage.UA]: {
    title: 'Сайт про цифрове телебачення',
    description:
      'Статті, новини, списки телеканалів в пакетах провайдерів цифрового телебачення. Програма телепередач',
    keywords:
      'Статті, новини, списки телеканалів, провайдери, цифрове телебачення, Програма телепередач, бісс ключі, мовлення',
  },
  [ELanguage.EN]: {
    title: 'Site about digital television',
    description:
      'Articles, news, lists of TV channels in packages of digital television providers. TV program',
    keywords:
      'Articles, news, lists of TV channels, providers, digital television, TV program, biss keys, broadcasting',
  },
  [ELanguage.RU]: {
    title: 'Сайт о цифровом телевидении',
    description:
      'Статьи, новости, списки телеканалов в пакетах провайдеров цифрового телевидения. Телепрограмма',
    keywords:
      'Статьи, новости, списки телеканалов, провайдеры, цифровое телевидение, телепрограмма, biss ключи, вещание',
  },
  [ELanguage.ES]: {
    title: 'Sitio sobre televisión digital',
    description:
      'Artículos, noticias, listas de canales de TV en paquetes de proveedores de televisión digital. Programa de TV',
    keywords:
      'Artículos, noticias, listas de canales de TV, proveedores, televisión digital, programa de TV, claves biss, transmisión',
  },
  [ELanguage.AR]: {
    title: 'موقع عن التلفزيون الرقمي',
    description:
      'مقالات، أخبار، قوائم القنوات التلفزيونية في حزم مقدمي خدمات التلفزيون الرقمي. برنامج التلفزيون',
    keywords:
      'مقالات، أخبار، قوائم القنوات التلفزيونية، مقدمو الخدمات، التلفزيون الرقمي، برنامج التلفزيون، مفاتيح بيس، البث',
  },
  [ELanguage.DE]: {
    title: 'Seite über digitales Fernsehen',
    description:
      'Artikel, Nachrichten, Listen von TV-Kanälen in Paketen von Anbietern für digitales Fernsehen. TV-Programm',
    keywords:
      'Artikel, Nachrichten, Listen von TV-Kanälen, Anbieter, digitales Fernsehen, TV-Programm, biss-Schlüssel, Rundfunk',
  },
  [ELanguage.FR]: {
    title: 'Site sur la télévision numérique',
    description:
      'Articles, actualités, listes de chaînes TV dans les offres des fournisseurs de télévision numérique. Programme TV',
    keywords:
      'Articles, actualités, listes de chaînes TV, fournisseurs, télévision numérique, programme TV, clés biss, diffusion',
  },
  [ELanguage.IT]: {
    title: 'Sito sulla televisione digitale',
    description:
      'Articoli, notizie, elenchi di canali TV nei pacchetti dei fornitori di televisione digitale. Programma TV',
    keywords:
      'Articoli, notizie, elenchi di canali TV, fornitori, televisione digitale, programma TV, chiavi biss, trasmissione',
  },

  openGraph: {
    siteName: 'Installsat TV',
    type: 'article',
    authors: ['Installsat'],
  },
};
