'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

const AdBanner = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // Отримуємо поточний шлях
  const searchParams = useSearchParams(); // Отримуємо поточні параметри запиту

  //   useEffect(() => {
  //     const intervalId = setInterval(() => {
  //       try {
  //         // Check if the 'ins' element already has an ad in it
  //         if (typeof window !== 'undefined' && window.adsbygoogle) {
  //           window.adsbygoogle.push({});
  //           clearInterval(intervalId);
  //         }
  //       } catch (err) {
  //         console.log('Error pushing ads: ', err);
  //         clearInterval(intervalId); // Ensure we clear interval on errors too
  //       }
  //     }, 100);

  //     return () => clearInterval(intervalId);
  //   }, [pathname, searchParams]);

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
      }, 500); // Затримка на півсекунди
    };

    loadAd(); // Завантажуємо оголошення на початку

    return () => {
      console.log('Route change detected. Clearing previous ads...');
      loadAd(); // Перезавантажуємо оголошення при зміні маршруту
    };
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
