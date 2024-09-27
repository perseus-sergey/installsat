'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface IAdsBannerProps {
  'data-ad-client': string;
  'data-ad-slot': string;
  'data-ad-format'?: string;
  'data-full-width-responsive'?: string;
  'data-ad-layout'?: string;
}

const AdsHeadMediaBanner = (props: IAdsBannerProps) => {
  const adsLoaded = useRef(false); // Слідкуємо за станом завантаження оголошення
  const pathname = usePathname(); // Отримуємо поточний шлях
  const searchParams = useSearchParams(); // Отримуємо поточні параметри запиту

  useEffect(() => {
    // const intervalId = setInterval(() => {
    //   try {
    //     // Check if the 'ins' element already has an ad in it
    //     if (typeof window !== 'undefined' && window.adsbygoogle) {
    //       window.adsbygoogle.push({});
    //       clearInterval(intervalId);
    //     }
    //   } catch (err) {
    //     console.error('Error pushing ads: ', err);
    //     clearInterval(intervalId); // Ensure we clear interval on errors too
    //   }
    // }, 100);

    // return () => clearInterval(intervalId);
    const loadAd = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        adsLoaded.current = true; // Встановлюємо статус, що реклама завантажена
      }
    };

    // Завантажуємо рекламу, якщо вона ще не завантажена
    if (!adsLoaded.current) {
      setTimeout(loadAd, 200);
    }
  }, [pathname, searchParams]);

  return (
    <ins
      // className="adsbygoogle block overflow-hidden"
      className="adsbygoogle block w-[728px] h-[90px]"
      {...props}
    />
  );
};
export default AdsHeadMediaBanner;
