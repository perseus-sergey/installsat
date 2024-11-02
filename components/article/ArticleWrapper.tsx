import dynamic from 'next/dynamic';

import { ELanguage } from '@/models/language.model';
import AdBannerWrapper from '../GoogleAdsense/AdBannerWrapper';

const AdBanner = dynamic(() => import('@/components/GoogleAdsense/AdBanner'), {
  ssr: false,
});

const adsenseId = process.env.G_ADSENSE_ID || '';

interface IProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  lang: ELanguage;
}

const ArticleWrapper = ({ children, lang, className }: IProps) => (
  <article className="flex" dir={lang === ELanguage.AR ? 'rtl' : 'ltr'}>
    <div className="w-0 min-h-[85vh]" />

    <div className={`article w-full ${className ? className : ''}`}>
      <AdBannerWrapper
        lang={lang}
        className="w-full flex justify-center items-center"
      >
        <div className="w-0 h-80 md:h-72" />
        <AdBanner
          adsenseId={adsenseId}
          className="block w-full text-center h-80 md:h-72"
          dataAttrs={{
            'data-ad-slot': '1581071444',
            'data-full-width-responsive': 'true',
            'data-ad-format': 'auto',
          }}
        />
      </AdBannerWrapper>
      {children}
    </div>
  </article>
);

export default ArticleWrapper;
