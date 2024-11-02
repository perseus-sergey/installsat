import { ELanguage } from '../language.model';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const FLY_CHANNEL_LIST_MODEL = {
  toolTipT2Caption: {
    [UA]: 'Цифрове Ефірне ТБ',
    [EN]: 'Digital Terrestrial TV',
    [RU]: 'Цифровое эфирное ТВ',
    [ES]: 'TV Terrestre Digital',
    [AR]: 'التلفزيون الأرضي الرقمي',
    [DE]: 'Digitales terrestrisches Fernsehen',
    [FR]: 'Télévision numérique terrestre',
    [IT]: 'TV Digitale Terrestre',
  },

  emptyDataText: {
    [UA]: 'Зараз канали відсутні. Спробуйте обрати інший супутник, або налаштувати фільтри.',
    [EN]: 'No channels available at the moment. Try selecting another satellite or adjusting filters.',
    [RU]: 'Сейчас каналы отсутствуют. Попробуйте выбрать другой спутник или настроить фильтры.',
    [ES]: 'No hay canales disponibles en este momento. Intente seleccionar otro satélite o ajustar los filtros.',
    [AR]: 'لا توجد قنوات متاحة حاليًا. حاول اختيار قمر صناعي آخر أو ضبط الفلاتر.',
    [DE]: 'Derzeit sind keine Kanäle verfügbar. Versuchen Sie, einen anderen Satelliten auszuwählen oder die Filter anzupassen.',
    [FR]: 'Aucun canal disponible pour le moment. Essayez de sélectionner un autre satellite ou de modifier les filtres.',
    [IT]: 'Nessun canale disponibile al momento. Prova a selezionare un altro satellite o a regolare i filtri.',
  },

  beamCaption: {
    [UA]: 'напр.',
    [EN]: 'beam',
    [RU]: 'луч',
    [ES]: 'haz',
    [AR]: 'شعاع',
    [DE]: 'Strahl',
    [FR]: 'faisceau',
    [IT]: 'raggio',
  },

  getToolTipAPidCaption(aPidLength: number) {
    return {
      [UA]: ` ще ${aPidLength - 2}`,
      [EN]: ` ${aPidLength - 2} more`,
      [RU]: ` ещё ${aPidLength - 2}`,
      [ES]: ` ${aPidLength - 2} más`,
      [AR]: ` ${aPidLength - 2} المزيد`,
      [DE]: ` noch ${aPidLength - 2}`,
      [FR]: ` ${aPidLength - 2} de plus`,
      [IT]: ` altri ${aPidLength - 2}`,
    };
  },

  getChanDetailLinkALabel(chanTitle: string) {
    return {
      [UA]: `Перейти до сторінки з детальним описом каналу "${chanTitle}"`,
      [EN]: `Go to the page with detailed information about the channel "${chanTitle}"`,
      [RU]: `Перейти на страницу с подробной информацией о канале "${chanTitle}"`,
      [ES]: `Ir a la página con información detallada sobre el canal "${chanTitle}"`,
      [AR]: `انتقل إلى الصفحة التي تحتوي على معلومات مفصلة عن القناة "${chanTitle}"`,
      [DE]: `Zur Seite mit detaillierten Informationen über den Kanal "${chanTitle}"`,
      [FR]: `Aller à la page avec des informations détaillées sur la chaîne "${chanTitle}"`,
      [IT]: `Vai alla pagina con informazioni dettagliate sul canale "${chanTitle}"`,
    };
  },
};
