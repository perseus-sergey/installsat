import TooltipSimple from '../tooltips/TooltipSimple/TooltipSimple';
import { ELanguage } from '@/models/language.model';
import SeoLink from '../SeoLink/SeoLink';

const { UA, EN, RU, ES, AR, DE, FR, IT } = ELanguage;

export const GO_UP_LINK = {
  title: {
    [UA]: 'Повернутися на початок сторінки',
    [EN]: 'Return to the top of the page',
    [RU]: 'Вернуться наверх страницы',
    [ES]: 'Volver al principio de la página',
    [AR]: 'العودة إلى أعلى الصفحة',
    [DE]: 'Zurück nach oben auf der Seite',
    [FR]: 'Retourner en haut de la page',
    [IT]: `Torna all'inizio della pagina`,
  },
  img: '⇧',
};

const GoUpLink = ({ lang }: { lang: ELanguage }) => (
  <TooltipSimple tooltipText={GO_UP_LINK.title[lang]}>
    <SeoLink
      href={`#top`}
      title={GO_UP_LINK.title[lang]}
      className="flex flex-col items-center justify-center text-3xl text-slate-500 hover:text-slate-400"
      // className="text-3xl rounded-full text-blue-200 bg-stone-400 p-2 hover:text-white hover:bg-red-300"
    >
      {GO_UP_LINK.img}
      <span className="text-xs">GO UP</span>
    </SeoLink>
  </TooltipSimple>
);

export default GoUpLink;
