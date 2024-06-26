import Link from 'next/link';
import styles from './GoUpLink.module.scss';
import { META_ALL_SAT_CHANNEL_LIST } from '@/models/channelList.model';
import { DEFAULT_LANG } from '@/models/ui.model';
import TooltipSimple from '../tooltips/TooltipSimple/TooltipSimple';

const {
  anchors: { goUpLink },
} = META_ALL_SAT_CHANNEL_LIST;

const GoUpLink = () => (
  <TooltipSimple tooltipText={goUpLink.title[DEFAULT_LANG]}>
    <Link
      href={`#`}
      title={goUpLink.title[DEFAULT_LANG]}
      className={styles.goUpLink}
    >
      {goUpLink.img}
    </Link>
  </TooltipSimple>
);

export default GoUpLink;
