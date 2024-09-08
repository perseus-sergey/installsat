import styles from './GoUpLink.module.scss';
import { META_ALL_SAT_CHANNEL_LIST } from '@/models/channelList.model';
import TooltipSimple from '../tooltips/TooltipSimple/TooltipSimple';
import { ELanguage } from '@/models/ui.model';
import SeoLink from '../SeoLink/SeoLink';

const {
  anchors: { goUpLink },
} = META_ALL_SAT_CHANNEL_LIST;

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
