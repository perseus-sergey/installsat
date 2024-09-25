'use client';

import { FAKE_PLAYER } from '@/models/channel.model';
import BaseButton from '../../ui/buttons/BaseButton/BaseButton';
import styles from './FakePlayer.module.scss';
import { ELanguage } from '@/models/ui.model';

const {
  button: { ariaLabel, titleStart: btnTitleStart },
  getCopyrightText,
  openNewWindowFeatures,
} = FAKE_PLAYER;

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
    <nav
      className="block relative min-h-[450px] bg-slate-950"
      data-testid="FakePlayer"
    >
      <BaseButton
        ariaLabel={ariaLabel[lang]}
        onClick={openNewWindow}
        className={`${styles.goButton} z-0 absolute top-1/2 left-1/2 py-2 px-8 outline-none border-none text-amber-50 bg-sky-950 cursor-pointer rounded-lg select-none
        before:-z-10 before:absolute before:-top-1 before:-left-1 before:blur-sm before:rounded-lg before:transition-opacity before:duration-300 before:ease-in-out
        after:-z-10 after:absolute after:w-full after:h-full after:bg-sky-950 after:left-0 after:top-0 after:rounded-lg`}
      >
        {btnTitleStart[lang]} «{chanTitle}»
      </BaseButton>
    </nav>
  ) : (
    <b className="text-red-700 text-center p-4">
      {getCopyrightText(chanTitle)[lang]}
    </b>
  );
};

export default FakePlayer;
