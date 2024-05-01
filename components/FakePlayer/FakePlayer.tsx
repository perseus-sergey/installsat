'use client';

import BaseButton from '../ui/buttons/BaseButton/BaseButton';
import styles from './FakePlayer.module.scss';

interface IFakePlayerProps {
  chanTitle: string;
  url: string;
}

const FakePlayer = ({ url, chanTitle }: IFakePlayerProps) => {
  const openNewWindow = () => {
    const windowFeatures =
      'left=0,top=0,width=665,height=550,status=no,toolbar=yes,menubar=no,scrollbars=yes';
    window.open(url, windowFeatures);
  };

  return url ? (
    <div className={styles.FakePlayer} data-testid="FakePlayer">
      <BaseButton
        ariaLabel="Перейти до перегляду"
        onClick={openNewWindow}
        className={styles.goButton}
        // className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        Дивитись онлайн «{chanTitle}»
      </BaseButton>
    </div>
  ) : (
    <strong className="text-red-700 text-center p-4">
      Онлайн трансляція телеканалу {chanTitle} призупинена за вимогою власника
      авторських прав.
    </strong>
  );
};

export default FakePlayer;
