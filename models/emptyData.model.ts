import { ELanguage } from './language.model';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const EMPTY_IMG_ALT = {
  [UA]: 'Зображення космосу для позначення порожнього результату',
  [EN]: 'Image of space for marking an empty result',
  [RU]: 'Изображение космоса для обозначения пустого результата',
  [ES]: 'Imagen del espacio para indicar un resultado vacío',
  [AR]: 'صورة الفضاء للإشارة إلى نتيجة فارغة',
  [DE]: 'Bild des Weltraums zur Markierung eines leeren Ergebnisses',
  [FR]: "Image de l'espace pour marquer un résultat vide",
  [IT]: 'Immagine dello spazio per indicare un risultato vuoto',
};

export const ERROR_EMPTY_DATA_TEXT = {
  [UA]: 'На жаль, запит повернув порожній результат',
  [EN]: 'Unfortunately, the query returned an empty result',
  [RU]: 'К сожалению, запрос вернул пустой результат',
  [ES]: 'Desafortunadamente, la consulta devolvió un resultado vacío',
  [AR]: 'للأسف، أعاد الاستعلام نتيجة فارغة',
  [DE]: 'Leider hat die Anfrage ein leeres Ergebnis zurückgegeben',
  [FR]: 'Malheureusement, la requête a retourné un résultat vide',
  [IT]: 'Purtroppo, la richiesta ha restituito un risultato vuoto',
};
