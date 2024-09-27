'use client';

import { ELanguage } from '@/models/ui.model';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const AdBannerArticleAbove = ({
  adsenseId,
  lang,
}: {
  adsenseId: string;
  lang: string;
}) => {
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
    <section
      id="ad-container"
      key={pathname}
      className="w-full flex justify-center items-center"
      role="complementary"
      aria-label={lang === ELanguage.UA ? 'Реклама' : 'Advertising'}
    >
      <ins
        className="adsbygoogle block w-full text-center h-80 md:h-52"
        data-ad-client={`ca-pub-${adsenseId}`}
        data-ad-slot="1581071444"
        data-full-width-responsive="true"
        data-ad-format="auto"
      />
    </section>
  );
};

export default AdBannerArticleAbove;
