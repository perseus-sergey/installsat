'use client';

import { META_CHANNEL_ONLINE } from '@/models/channel.model';
import BaseButton from '../../ui/buttons/BaseButton/BaseButton';
import styles from './FakePlayer.module.scss';
import { LANGUAGE } from '@/models/ui.model';

const {
  button: { ariaLabel, titleStart: btnTitleStart },
  getCopyrightText,
  openNewWindowFeatures,
} = META_CHANNEL_ONLINE.fakePlayer;

interface IFakePlayerProps {
  chanTitle: string;
  url: string;
}

const FakePlayer = ({ url, chanTitle }: IFakePlayerProps) => {
  const openNewWindow = () => {
    const windowFeatures = openNewWindowFeatures;
    window.open(url, windowFeatures);
  };

  return url ? (
    <nav className={styles.FakePlayer} data-testid="FakePlayer">
      <BaseButton
        ariaLabel={ariaLabel[LANGUAGE]}
        onClick={openNewWindow}
        className={styles.goButton}
      >
        {btnTitleStart[LANGUAGE]} «{chanTitle}»
      </BaseButton>
    </nav>
  ) : (
    <strong className="text-red-700 text-center p-4">
      {getCopyrightText(chanTitle)[LANGUAGE]}
    </strong>
  );
};

export default FakePlayer;
