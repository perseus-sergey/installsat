'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

const AdBannerArticleAbove = ({ adsenseId }: { adsenseId: string }) => {
  const pathname = usePathname(); // Отримуємо поточний шлях
  const searchParams = useSearchParams(); // Отримуємо поточні параметри запиту
  const adContainerRef = useRef<HTMLDivElement>(null); // Реф для контейнера оголошення

  useEffect(() => {
    const adContainer = adContainerRef.current;

    // Встановлення стилів з !important для контейнера
    if (adContainer) {
      adContainer.style.setProperty('min-height', '250px', 'important');
    }

    // Завантаження рекламного блоку через Google Ads
    const intervalId = setInterval(() => {
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          window.adsbygoogle.push({});
          clearInterval(intervalId);
        }
      } catch (err) {
        console.log('Error pushing ads: ', err);
        clearInterval(intervalId); // При помилці також очищаємо інтервал
      }
    }, 200);

    return () => clearInterval(intervalId); // Очищаємо інтервал при розмонтуванні
  }, [pathname, searchParams]);

  return (
    <div
      ref={adContainerRef}
      id="ad-container"
      key={pathname}
      className="w-full h-full flex justify-center items-center"
    >
      <ins
        className="adsbygoogle block w-full text-center"
        data-ad-client={`ca-pub-${adsenseId}`}
        data-ad-slot="1581071444"
        data-full-width-responsive="true"
        data-ad-format="auto"
      />
    </div>
  );
};

export default AdBannerArticleAbove;
