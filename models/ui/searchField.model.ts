import { ELanguage } from '../language.model';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const SEARCH_FIELD = {
  placeholder: {
    [UA]: 'Пошук статті...',
    [EN]: 'Search article...',
    [RU]: 'Поиск статьи...',
    [ES]: 'Buscar artículo...',
    [AR]: 'بحث عن المقال...',
    [DE]: 'Artikel suchen...',
    [FR]: 'Rechercher un article...',
    [IT]: 'Cerca articolo...',
  },
  labelTitle: {
    [UA]: 'Шукати статті по назві та опису',
    [EN]: 'Search articles by title and description',
    [RU]: 'Искать статьи по названию и описанию',
    [ES]: 'Buscar artículos por título y descripción',
    [AR]: 'البحث عن المقالات حسب العنوان والوصف',
    [DE]: 'Artikel nach Titel und Beschreibung suchen',
    [FR]: 'Rechercher des articles par titre et description',
    [IT]: 'Cerca articoli per titolo e descrizione',
  },
};
