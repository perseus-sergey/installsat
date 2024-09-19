import { GO_UP_LINK } from '@/models/channelList.model';
import TooltipSimple from '../tooltips/TooltipSimple/TooltipSimple';
import { ELanguage } from '@/models/ui.model';
import SeoLink from '../SeoLink/SeoLink';

const GoUpLink = ({ lang }: { lang: ELanguage }) => (
  <TooltipSimple tooltipText={GO_UP_LINK.title[lang]}>
    <SeoLink
      href={`#top`}
      title={GO_UP_LINK.title[lang]}
      className="text-3xl rounded-full text-blue-200 bg-stone-400 p-2 hover:text-white hover:bg-red-300"
    >
      {GO_UP_LINK.img}
    </SeoLink>
  </TooltipSimple>
);

export default GoUpLink;
