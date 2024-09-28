'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const AdBannerUnderHeader = ({ adsenseId }: { adsenseId: string }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
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
  }, [pathname, searchParams]);

  return (
    <ins
      key={`${pathname}-${searchParams.toString()}`}
      className="adsbygoogle block w-full text-center h-80 md:h-72"
      data-ad-client={`ca-pub-${adsenseId}`}
      data-ad-slot="1581071444"
      data-full-width-responsive="true"
      data-ad-format="auto"
    />
  );
};

export default AdBannerUnderHeader;
