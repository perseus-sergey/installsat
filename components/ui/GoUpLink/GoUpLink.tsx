import styles from './GoUpLink.module.scss';
import { ALL_SAT_CHANNEL_LIST_LINKS } from '@/models/channelList.model';
import TooltipSimple from '../tooltips/TooltipSimple/TooltipSimple';
import { ELanguage } from '@/models/ui.model';
import SeoLink from '../SeoLink/SeoLink';

const {
  anchors: { goUpLink },
} = ALL_SAT_CHANNEL_LIST_LINKS;

const GoUpLink = ({ lang }: { lang: ELanguage }) => (
  <TooltipSimple tooltipText={goUpLink.title[lang]}>
    <SeoLink
      href={`#top`}
      title={goUpLink.title[lang]}
      className={styles.goUpLink}
    >
      {goUpLink.img}
    </SeoLink>
  </TooltipSimple>
);

export default GoUpLink;
