'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const AdBannerArticleAbove = ({ adsenseId }: { adsenseId: string }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [adHeight, setAdHeight] = useState(280);

  useEffect(() => {
    const updateAdHeight = () =>
      setAdHeight(window.innerWidth < 768 ? 320 : 280);

    updateAdHeight();

    window.addEventListener('resize', updateAdHeight);

    return () => window.removeEventListener('resize', updateAdHeight);
  }, []);

  useEffect(() => {
    const adContainer = adContainerRef.current;

    if (adContainer) {
      adContainer.style.setProperty('min-height', `${adHeight}px`, 'important');
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
        clearInterval(intervalId);
      }
    }, 200);

    return () => clearInterval(intervalId);
  }, [pathname, searchParams, adHeight]);

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
