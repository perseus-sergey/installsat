'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const AdBanner = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // Отримуємо поточний шлях
  const searchParams = useSearchParams(); // Отримуємо поточні параметри запиту

  useEffect(() => {
    const intervalId = setInterval(() => {
      try {
        // Check if the 'ins' element already has an ad in it
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          window.adsbygoogle.push({});
          clearInterval(intervalId);
        }
      } catch (err) {
        console.error('Error pushing ads: ', err);
        clearInterval(intervalId); // Ensure we clear interval on errors too
      }
    }, 100);

    return () => clearInterval(intervalId);
    // const loadAd = () => {
    //   if (typeof window !== 'undefined' && window.adsbygoogle) {
    //     window.adsbygoogle = window.adsbygoogle || [];
    //     window.adsbygoogle.push({});
    //     adsLoaded.current = true; // Встановлюємо статус, що реклама завантажена
    //   }
    // };

    // // Завантажуємо рекламу, якщо вона ще не завантажена
    // if (!adsLoaded.current) {
    //   setTimeout(loadAd, 0);
    // }
  }, [pathname, searchParams]);

  return children;
};

// const AdBanner = ({ children }: { children: React.ReactNode }) => {
//   useEffect(() => {
//     try {
//       (window.adsbygoogle = window.adsbygoogle || []).push({});
//     } catch (err) {
//       console.log(err);
//     }
//   }, []);

//   return children;
// };

export default AdBanner;
