'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const AdBannerArticleAbove = ({ adsenseId }: { adsenseId: string }) => {
  const pathname = usePathname(); // Отримуємо поточний шлях
  const searchParams = useSearchParams(); // Отримуємо поточні параметри запиту

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     try {
  //       // Check if the 'ins' element already has an ad in it
  //       if (typeof window !== 'undefined' && window.adsbygoogle) {
  //         window.adsbygoogle.push({});
  //         clearInterval(intervalId);
  //       }
  //     } catch (err) {
  //       console.log('Error pushing ads: ', err);
  //       clearInterval(intervalId); // Ensure we clear interval on errors too
  //     }
  //   }, 100);

  //   return () => clearInterval(intervalId);
  // }, [pathname, searchParams]);

  useEffect(() => {
    const loadAd = () => {
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          const adElement = document.querySelector('.adsbygoogle');

          if (adElement) {
            adElement.innerHTML = ''; // Очищаємо старе оголошення
            window.adsbygoogle.push({});
          }
        }
      }, 200); // Затримка на півсекунди
    };

    loadAd(); // Завантажуємо оголошення на початку

    return () => {
      loadAd(); // Перезавантажуємо оголошення при зміні маршруту
    };
  }, [pathname, searchParams]);

  return (
    <div
      id="ad-container"
      key={pathname}
      className="w-full h-full flex justify-center items-center"
    >
      <ins
        className="adsbygoogle block w-full m-auto"
        data-ad-client={`ca-pub-${adsenseId}`}
        data-ad-slot="1581071444"
        data-full-width-responsive="true"
        data-ad-format="auto"
      />
    </div>
  );
};

export default AdBannerArticleAbove;
