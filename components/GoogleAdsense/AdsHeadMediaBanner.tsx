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
  const adRef = useRef<HTMLModElement>(null);
  const adsLoaded = useRef(false); // Слідкуємо за станом завантаження оголошення
  const pathname = usePathname(); // Отримуємо поточний шлях
  const searchParams = useSearchParams(); // Отримуємо поточні параметри запиту

  useEffect(() => {
    const loadAd = () => {
      if (
        typeof window !== 'undefined' &&
        window.adsbygoogle &&
        adRef.current
      ) {
        adRef.current.innerHTML = ''; // Очищуємо попередній вміст для уникнення конфліктів
        window.adsbygoogle.push({});
        adsLoaded.current = true;
      }
    };

    if (!adsLoaded.current) {
      loadAd(); // Завантажуємо оголошення на початку
    }

    // Оновлюємо оголошення при зміні маршруту чи параметрів
    const handleRouteChange = () => {
      adsLoaded.current = false; // Скидаємо статус оголошення при зміні маршруту
      loadAd(); // Завантажуємо нове оголошення
    };

    handleRouteChange(); // Викликаємо завантаження при першому завантаженні або зміні URL
  }, [pathname, searchParams]);

  return (
    <ins
      // className="adsbygoogle block overflow-hidden"
      className="adsbygoogle block w-[728px] h-[90px]"
      ref={adRef} // Прив'язуємо ref до ins елемента
      {...props}
    />
  );
};
export default AdsHeadMediaBanner;
