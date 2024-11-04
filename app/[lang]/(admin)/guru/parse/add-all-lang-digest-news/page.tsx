import { poolExecute } from '@/libs/db/mysqldb';
import { validSearchParam } from '@/libs/utils/validSearchParam';
import { EUrlSearchParam, TSearchParams } from '@/models/url/urlSearch.model';

// ****************************************************************
// For translate and add all languages news column to old sat_digest tables
// ****************************************************************

const translateToLang = (
  text: string,
  lang: 'ru' | 'es' | 'ar' | 'de' | 'fr' | 'it'
) => {
  const translations: {
    [key: string]: { regex: RegExp; replacement: string }[];
  } = {
    ru: [
      { regex: /package/giu, replacement: 'пакет' },
      { regex: /packages/giu, replacement: 'пакеты' },
      { regex: /free broadcasting/giu, replacement: 'идет открыто' },
      { regex: /\bFTA\b/giu, replacement: 'открыт' },
      { regex: /resumed\w*/giu, replacement: 'возобновил' },
      { regex: /after the break/giu, replacement: 'после перерыва' },
      { regex: /updated/giu, replacement: 'обновил' },
      {
        regex: /new SR \(symbol rate\)/giu,
        replacement: 'новый SR (символьная скорость)',
      },
      { regex: /encrypted on/giu, replacement: 'закодирован на' },
      { regex: /restored broadcasting/giu, replacement: 'возобновил вещание' },
      { regex: /restored in the package/giu, replacement: 'снова в пакете' },
      {
        regex: /started test broadcasting/giu,
        replacement: 'начал тестовое вещание',
      },
      {
        regex: /started regular broadcasting/giu,
        replacement: 'начал регулярное вещание',
      },
      { regex: /started translating/giu, replacement: 'начал транслировать' },
      { regex: /started broadcasting/giu, replacement: 'начал вещание' },
      {
        regex: /returned with new parameters/giu,
        replacement: 'вернулся с новыми параметрами',
      },
      { regex: /after disappearance/giu, replacement: 'после исчезновения' },
      {
        regex: /appeared on the satellite/giu,
        replacement: 'появился на спутнике',
      },
      {
        regex: /stopped broadcasting/giu,
        replacement: 'перестал транслироваться',
      },
      {
        regex: /parameters have changed/giu,
        replacement: 'изменились параметры',
      },
      { regex: /returned/giu, replacement: 'вернулся' },
      { regex: /\bold\b/giu, replacement: 'старый' },
      { regex: /satellites/giu, replacement: 'спутники' },
      { regex: /satellite/giu, replacement: 'спутник' },
      { regex: /broadcasting/giu, replacement: 'вещание' },
      { regex: /now/giu, replacement: 'сейчас' },
      { regex: /again/giu, replacement: 'снова' },
      { regex: /\bon\b/giu, replacement: 'на' },
    ],

    es: [
      { regex: /package/giu, replacement: 'paquete' },
      { regex: /packages/giu, replacement: 'paquetes' },
      { regex: /free broadcasting/giu, replacement: 'emisión gratuita' },
      { regex: /\bFTA\b/giu, replacement: 'libre' },
      { regex: /resumed\w*/giu, replacement: 'reanudado' },
      { regex: /after the break/giu, replacement: 'después de la pausa' },
      { regex: /updated/giu, replacement: 'actualizado' },
      {
        regex: /new SR \(symbol rate\)/giu,
        replacement: 'nuevo SR (tasa de símbolos)',
      },
      { regex: /encrypted on/giu, replacement: 'encriptado en' },
      { regex: /restored broadcasting/giu, replacement: 'reanudó la emisión' },
      {
        regex: /restored in the package/giu,
        replacement: 'restaurado en el paquete',
      },
      {
        regex: /started test broadcasting/giu,
        replacement: 'comenzó la emisión de prueba',
      },
      {
        regex: /started regular broadcasting/giu,
        replacement: 'comenzó la emisión regular',
      },
      { regex: /started translating/giu, replacement: 'comenzó a transmitir' },
      { regex: /started broadcasting/giu, replacement: 'comenzó a emitir' },
      {
        regex: /returned with new parameters/giu,
        replacement: 'regresó con nuevos parámetros',
      },
      {
        regex: /after disappearance/giu,
        replacement: 'después de la desaparición',
      },
      {
        regex: /appeared on the satellite/giu,
        replacement: 'apareció en el satélite',
      },
      { regex: /stopped broadcasting/giu, replacement: 'dejó de emitir' },
      {
        regex: /parameters have changed/giu,
        replacement: 'han cambiado los parámetros',
      },
      { regex: /returned/giu, replacement: 'regresó' },
      { regex: /\bold\b/giu, replacement: 'antiguo' },
      { regex: /satellites/giu, replacement: 'satélites' },
      { regex: /satellite/giu, replacement: 'satélite' },
      { regex: /broadcasting/giu, replacement: 'emisión' },
      { regex: /now/giu, replacement: 'ahora' },
      { regex: /again/giu, replacement: 'de nuevo' },
      { regex: /\bon\b/giu, replacement: 'en' },
    ],

    ar: [
      { regex: /package/giu, replacement: 'حزمة' },
      { regex: /packages/giu, replacement: 'حزم' },
      { regex: /free broadcasting/giu, replacement: 'البث المجاني' },
      { regex: /\bFTA\b/giu, replacement: 'مفتوح' },
      { regex: /resumed\w*/giu, replacement: 'استأنف' },
      { regex: /after the break/giu, replacement: 'بعد الاستراحة' },
      { regex: /updated/giu, replacement: 'محدث' },
      { regex: /encrypted on/giu, replacement: 'مشفّر على' },
      { regex: /restored broadcasting/giu, replacement: 'استأنف البث' },
      { regex: /restored in the package/giu, replacement: 'عاد في الحزمة' },
      {
        regex: /started test broadcasting/giu,
        replacement: 'بدأ البث التجريبي',
      },
      {
        regex: /started regular broadcasting/giu,
        replacement: 'بدأ البث المنتظم',
      },
      { regex: /started translating/giu, replacement: 'بدأ الترجمة' },
      { regex: /started broadcasting/giu, replacement: 'بدأ البث' },
      {
        regex: /returned with new parameters/giu,
        replacement: 'عاد بمعايير جديدة',
      },
      { regex: /after disappearance/giu, replacement: 'بعد الاختفاء' },
      {
        regex: /appeared on the satellite/giu,
        replacement: 'ظهر على القمر الصناعي',
      },
      { regex: /stopped broadcasting/giu, replacement: 'توقف البث' },
      { regex: /parameters have changed/giu, replacement: 'تغيرت المعايير' },
      { regex: /returned/giu, replacement: 'عاد' },
      { regex: /\bold\b/giu, replacement: 'قديم' },
      { regex: /satellites/giu, replacement: 'الأقمار الصناعية' },
      { regex: /satellite/giu, replacement: 'قمر صناعي' },
      { regex: /broadcasting/giu, replacement: 'بث' },
      { regex: /now/giu, replacement: 'الآن' },
      { regex: /again/giu, replacement: 'مرة أخرى' },
      { regex: /\bon\b/giu, replacement: 'على' },
    ],

    de: [
      { regex: /package/giu, replacement: 'Paket' },
      { regex: /packages/giu, replacement: 'Pakete' },
      { regex: /free broadcasting/giu, replacement: 'freie Ausstrahlung' },
      { regex: /\bFTA\b/giu, replacement: 'frei empfangbar' },
      { regex: /resumed\w*/giu, replacement: 'wieder aufgenommen' },
      { regex: /after the break/giu, replacement: 'nach der Unterbrechung' },
      { regex: /updated/giu, replacement: 'aktualisiert' },
      { regex: /encrypted on/giu, replacement: 'verschlüsselt auf' },
      {
        regex: /restored broadcasting/giu,
        replacement: 'Ausstrahlung wiederhergestellt',
      },
      {
        regex: /restored in the package/giu,
        replacement: 'wieder im Paket enthalten',
      },
      {
        regex: /started test broadcasting/giu,
        replacement: 'hat Testsendungen gestartet',
      },
      {
        regex: /started regular broadcasting/giu,
        replacement: 'hat reguläre Sendungen gestartet',
      },
      {
        regex: /started translating/giu,
        replacement: 'hat Übersetzungen begonnen',
      },
      {
        regex: /started broadcasting/giu,
        replacement: 'hat die Ausstrahlung begonnen',
      },
      {
        regex: /returned with new parameters/giu,
        replacement: 'mit neuen Parametern zurückgekehrt',
      },
      { regex: /after disappearance/giu, replacement: 'nach dem Verschwinden' },
      {
        regex: /appeared on the satellite/giu,
        replacement: 'auf dem Satelliten erschienen',
      },
      {
        regex: /stopped broadcasting/giu,
        replacement: 'hat die Ausstrahlung eingestellt',
      },
      {
        regex: /parameters have changed/giu,
        replacement: 'Parameter wurden geändert',
      },
      { regex: /returned/giu, replacement: 'zurückgekehrt' },
      { regex: /\bold\b/giu, replacement: 'alt' },
      { regex: /satellites/giu, replacement: 'Satelliten' },
      { regex: /satellite/giu, replacement: 'Satellit' },
      { regex: /broadcasting/giu, replacement: 'Ausstrahlung' },
      { regex: /now/giu, replacement: 'jetzt' },
      { regex: /again/giu, replacement: 'wieder' },
      { regex: /\bon\b/giu, replacement: 'auf' },
    ],

    fr: [
      { regex: /package/giu, replacement: 'paquet' },
      { regex: /packages/giu, replacement: 'paquets' },
      { regex: /free broadcasting/giu, replacement: 'diffusion gratuite' },
      { regex: /\bFTA\b/giu, replacement: 'gratuit' },
      { regex: /resumed\w*/giu, replacement: 'a repris' },
      { regex: /after the break/giu, replacement: 'après la pause' },
      { regex: /updated/giu, replacement: 'mis à jour' },
      {
        regex: /new SR \(symbol rate\)/giu,
        replacement: 'nouveau SR (taux de symboles)',
      },
      { regex: /encrypted on/giu, replacement: 'crypté sur' },
      {
        regex: /restored broadcasting/giu,
        replacement: 'a repris la diffusion',
      },
      {
        regex: /restored in the package/giu,
        replacement: 'restauré dans le paquet',
      },
      {
        regex: /started test broadcasting/giu,
        replacement: 'a commencé la diffusion test',
      },
      {
        regex: /started regular broadcasting/giu,
        replacement: 'a commencé la diffusion régulière',
      },
      { regex: /started translating/giu, replacement: 'a commencé à diffuser' },
      {
        regex: /started broadcasting/giu,
        replacement: 'a commencé la diffusion',
      },
      {
        regex: /returned with new parameters/giu,
        replacement: 'revenu avec de nouveaux paramètres',
      },
      { regex: /after disappearance/giu, replacement: 'après disparition' },
      {
        regex: /appeared on the satellite/giu,
        replacement: 'apparu sur le satellite',
      },
      {
        regex: /stopped broadcasting/giu,
        replacement: 'a arrêté la diffusion',
      },
      {
        regex: /parameters have changed/giu,
        replacement: 'les paramètres ont changé',
      },
      { regex: /returned/giu, replacement: 'revenu' },
      { regex: /\bold\b/giu, replacement: 'ancien' },
      { regex: /satellites/giu, replacement: 'satellites' },
      { regex: /satellite/giu, replacement: 'satellite' },
      { regex: /broadcasting/giu, replacement: 'diffusion' },
      { regex: /now/giu, replacement: 'maintenant' },
      { regex: /again/giu, replacement: 'encore' },
      { regex: /\bon\b/giu, replacement: 'sur' },
    ],

    it: [
      { regex: /package/giu, replacement: 'pacchetto' },
      { regex: /packages/giu, replacement: 'pacchetti' },
      { regex: /free broadcasting/giu, replacement: 'trasmissione gratuita' },
      { regex: /\bFTA\b/giu, replacement: 'in chiaro' },
      { regex: /resumed\w*/giu, replacement: 'ripreso' },
      { regex: /after the break/giu, replacement: 'dopo la pausa' },
      { regex: /updated/giu, replacement: 'aggiornato' },
      {
        regex: /new SR \(symbol rate\)/giu,
        replacement: 'nuovo SR (symbol rate)',
      },
      { regex: /encrypted on/giu, replacement: 'criptato su' },
      {
        regex: /restored broadcasting/giu,
        replacement: 'ripristinata la trasmissione',
      },
      {
        regex: /restored in the package/giu,
        replacement: 'ripristinato nel pacchetto',
      },
      {
        regex: /started test broadcasting/giu,
        replacement: 'avviato trasmissione di prova',
      },
      {
        regex: /started regular broadcasting/giu,
        replacement: 'avviato trasmissione regolare',
      },
      {
        regex: /started translating/giu,
        replacement: 'ha iniziato a trasmettere',
      },
      {
        regex: /started broadcasting/giu,
        replacement: 'ha iniziato la trasmissione',
      },
      {
        regex: /returned with new parameters/giu,
        replacement: 'tornato con nuovi parametri',
      },
      { regex: /after disappearance/giu, replacement: 'dopo la scomparsa' },
      {
        regex: /appeared on the satellite/giu,
        replacement: 'apparso sul satellite',
      },
      {
        regex: /stopped broadcasting/giu,
        replacement: 'ha smesso di trasmettere',
      },
      {
        regex: /parameters have changed/giu,
        replacement: 'i parametri sono cambiati',
      },
      { regex: /returned/giu, replacement: 'tornato' },
      { regex: /\bold\b/giu, replacement: 'vecchio' },
      { regex: /satellites/giu, replacement: 'satelliti' },
      { regex: /satellite/giu, replacement: 'satellite' },
      { regex: /broadcasting/giu, replacement: 'trasmissione' },
      { regex: /now/giu, replacement: 'ora' },
      { regex: /again/giu, replacement: 'di nuovo' },
      { regex: /\bon\b/giu, replacement: 'su' },
    ],
  };

  const rules = translations[lang];

  return rules.reduce(
    (acc, { regex, replacement }) => acc.replaceAll(regex, replacement),
    text
  );
};

const updateSingleRow = async (
  id: string,
  translations: {
    text_ru: string;
    text_es: string;
    text_ar: string;
    text_de: string;
    text_fr: string;
    text_it: string;
  },
  tblName: string
) => {
  const sql = `
    UPDATE ${tblName}
    SET text_ru = ?, text_es = ?, text_ar = ?, text_de = ?, text_fr = ?, text_it = ?
    WHERE id = ?
  `;

  const updateValues = [
    translations.text_ru,
    translations.text_es,
    translations.text_ar,
    translations.text_de,
    translations.text_fr,
    translations.text_it,
    id,
  ];

  return await poolExecute(sql, updateValues);
};

export default async function Page({
  searchParams,
}: {
  searchParams?: TSearchParams;
}) {
  const searchQuery = validSearchParam(EUrlSearchParam.INTERVAL, searchParams);
  const year = parseInt(searchQuery, 10) || 0;
  let tblName = 'tbl_digest';
  if (year) tblName += `_${year}`;

  const sql = `SELECT id, text_en FROM ${tblName}`;
  const oldData = await poolExecute<{ id: string; text_en: string }[]>(sql);
  if (oldData instanceof Error) return JSON.stringify(oldData);

  const errors = [];

  for (const row of oldData) {
    const translations = {
      text_ru: translateToLang(row.text_en, 'ru'),
      text_es: translateToLang(row.text_en, 'es'),
      text_ar: translateToLang(row.text_en, 'ar'),
      text_de: translateToLang(row.text_en, 'de'),
      text_fr: translateToLang(row.text_en, 'fr'),
      text_it: translateToLang(row.text_en, 'it'),
    };

    const result = await updateSingleRow(row.id, translations, tblName);
    if (result instanceof Error) {
      errors.push({ id: row.id, error: result.message });
    }
  }

  if (errors.length > 0) return JSON.stringify(errors);

  return JSON.stringify({ message: 'Update successful' });
}
