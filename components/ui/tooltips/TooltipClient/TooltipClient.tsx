'use client';

import { ReactNode, Suspense, useEffect, useState } from 'react';
import styles from './TooltipClient.module.scss';
import BaseButton from '../../buttons/BaseButton/BaseButton';
import { ELanguage } from '@/models/language.model';

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
              className={`flex flex-col justify-between text-center w-full max-h-full xl:w-[80vw] bg-stone-100 p-2 fixed z-10 rounded-xl text-stone-600 shadow-md transition-all duration-500 scale-0 left-0 top-0 opacity-0 transform translate-x-0 translate-y-0 ${!isStyleDisabled ? ` ${styles.showHint} left-1/2 top-1/2 scale-100 opacity-100` : ''}`}
            >
              {hintContent}
              <figcaption className="p-2 flex justify-between gap-8 items-center">
                {hintDescription}
                <span className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full border border-stone-400 bg-red-400">
                  <span className="text-white">{CAPTIONS.closeButtonMark}</span>
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
