'use client';

import { ReactNode, Suspense, useEffect, useState } from 'react';
import styles from './TooltipClient.module.scss';
import BaseButton from '../../buttons/BaseButton/BaseButton';
import { ELanguage } from '@/models/ui.model';

const CAPTIONS = {
  ariaLabelSmall: {
    [ELanguage.UA]: 'Натисніть щоб відкрити',
    [ELanguage.EN]: 'Click to open',
  },
  ariaLabelBig: {
    [ELanguage.UA]: 'Натисніть щоб сховати',
    [ELanguage.EN]: 'Click to hide',
  },
  closeButtonMark: '✕',
};

interface ITooltipClientProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  hintContent: ReactNode;
  hintDescription: string;
  lang: ELanguage;
}

const TooltipClient = ({
  children,
  lang,
  hintContent,
  hintDescription,
  className,
  ...attributes
}: ITooltipClientProps) => {
  const [isPopUp, setIsPopUp] = useState(false);
  const [isStyleDisabled, setIsStyleDisabled] = useState(true);

  useEffect(() => {
    if (!isStyleDisabled) return;

    const timer = setTimeout(() => {
      setIsPopUp(false);
    }, 700);

    return () => clearTimeout(timer);
  }, [isStyleDisabled]);

  const removePopUp = async () => {
    setIsStyleDisabled(true);
  };

  const showPopUp = async () => {
    setIsPopUp(true);
    setIsStyleDisabled(false);
  };

  return (
    <>
      <Suspense>
        <BaseButton
          ariaLabel={CAPTIONS.ariaLabelSmall[lang]}
          onClick={showPopUp}
          className={className}
          {...attributes}
        >
          {children}
        </BaseButton>
      </Suspense>

      {isPopUp && (
        <Suspense>
          <BaseButton
            ariaLabel={CAPTIONS.ariaLabelBig[lang]}
            onClick={removePopUp}
          >
            <figure
              className={`${styles.hint}${!isStyleDisabled ? ` ${styles.showHint}` : ''}`}
            >
              {hintContent}
              <figcaption className="p-2 flex justify-between gap-8 items-center">
                {hintDescription}
                <span className={styles.crossMarkWrapper}>
                  <span className={styles.crossMark}>
                    {CAPTIONS.closeButtonMark}
                  </span>
                </span>
              </figcaption>
            </figure>
          </BaseButton>
        </Suspense>
      )}
    </>
  );
};

export default TooltipClient;
