'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface IAdsBannerProps {
  'data-ad-client': string;
  'data-ad-slot': string;
  'data-ad-format': string;
  'data-full-width-responsive': string;
  'data-ad-layout'?: string;
}

const AdsHeadMediaBanner = (props: IAdsBannerProps) => {
  const router = useRouter();
  const adRef = useRef<HTMLModElement>(null); // ref для ins елемента
  const adsLoaded = useRef(false); // Слідкуємо за станом завантаження оголошення

  useEffect(() => {
    const loadAd = () => {
      if (
        typeof window !== 'undefined' &&
        window.adsbygoogle &&
        adRef.current
      ) {
        adRef.current.innerHTML = ''; // Очищуємо попередній вміст для уникнення конфліктів
        window.adsbygoogle.push({});
        adsLoaded.current = true; // Відмічаємо, що оголошення завантажено
      }
    };

    // const handleRouteChange = () => {
    //   adsLoaded.current = false; // Скидаємо статус оголошення при зміні маршруту
    //   loadAd(); // Завантажуємо нове оголошення після зміни маршруту
    // };

    if (!adsLoaded.current) {
      loadAd(); // Завантажуємо оголошення на початку
    }

    // Підписуємося на зміни маршруту
    // router.events.on('routeChangeComplete', handleRouteChange);

    // Очищуємо підпис при демонтажі компонента
    return () => {
      // router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return (
    <ins
      className="adsbygoogle block overflow-hidden"
      ref={adRef} // Прив'язуємо ref до ins елемента
      // key={router.asPath} // Додаємо ключ для примусового рендерингу при зміні маршруту
      {...props}
    />
  );
};
export default AdsHeadMediaBanner;
