'use client';

import { META_CHANNEL_ONLINE } from '@/models/channel.model';
import BaseButton from '../../ui/buttons/BaseButton/BaseButton';
import styles from './FakePlayer.module.scss';
import { ELanguage } from '@/models/ui.model';

const {
  button: { ariaLabel, titleStart: btnTitleStart },
  getCopyrightText,
  openNewWindowFeatures,
} = META_CHANNEL_ONLINE.fakePlayer;

interface IFakePlayerProps {
  chanTitle: string;
  url: string;
  lang: ELanguage;
}

const FakePlayer = ({ url, chanTitle, lang }: IFakePlayerProps) => {
  const openNewWindow = () => {
    const windowFeatures = openNewWindowFeatures;
    window.open(url, windowFeatures);
  };

  return url ? (
    <nav className={styles.FakePlayer} data-testid="FakePlayer">
      <BaseButton
        ariaLabel={ariaLabel[lang]}
        onClick={openNewWindow}
        className={styles.goButton}
      >
        {btnTitleStart[lang]} «{chanTitle}»
      </BaseButton>
    </nav>
  ) : (
    <strong className="text-red-700 text-center p-4">
      {getCopyrightText(chanTitle)[lang]}
    </strong>
  );
};

export default FakePlayer;
