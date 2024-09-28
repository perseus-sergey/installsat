'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

interface IDataAttributes {
  'data-ad-slot': string;
  'data-full-width-responsive': string;
  'data-ad-format': string;
  'data-ad-layout'?: string;
}

interface IAdsBannerProps extends React.HTMLAttributes<HTMLElement> {
  dataAttrs: IDataAttributes;
  adsenseId: string;
}

const AdBanner = ({ dataAttrs, adsenseId, className }: IAdsBannerProps) => {
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
        console.log('Error pushing ads: ', err);
        clearInterval(intervalId); // Ensure we clear interval on errors too
      }
    }, 200);

    return () => clearInterval(intervalId);
  }, [pathname, searchParams]);

  return (
    <ins
      className={`adsbygoogle ${className || ''}`}
      key={`${pathname}-${searchParams.toString()}`}
      data-ad-client={`ca-pub-${adsenseId}`}
      {...dataAttrs}
    />
  );
};

export default AdBanner;
