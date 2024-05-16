import Link from 'next/link';
import styles from './GoUpLink.module.scss';
import { META_ALL_SAT_CHANNEL_LIST } from '@/models/channelList.model';
import { LANGUAGE } from '@/models/ui.model';
import TooltipSimple from '../tooltips/TooltipSimple/TooltipSimple';

const {
  anchors: { goUpLink },
} = META_ALL_SAT_CHANNEL_LIST;

const GoUpLink = () => (
  <TooltipSimple tooltipText={goUpLink.title[LANGUAGE]}>
    <Link
      href={`#`}
      title={goUpLink.title[LANGUAGE]}
      className={styles.goUpLink}
    >
      {goUpLink.img}
    </Link>
  </TooltipSimple>
);

export default GoUpLink;
