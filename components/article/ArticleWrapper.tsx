import { ELanguage } from '@/models/ui.model';
import AdBannerWrapper from '../GoogleAdsense/AdBannerWrapper';
import dynamic from 'next/dynamic';

const AdBanner = dynamic(() => import('@/components/GoogleAdsense/AdBanner'), {
  ssr: false,
});

const adsenseId = process.env.G_ADSENSE_ID || '';

interface IProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  lang: ELanguage;
}

const ArticleWrapper = ({ children, lang, className }: IProps) => (
  <article className="flex">
    <div aria-label="hidden" className="w-0 min-h-[85vh]" />

    <div className={`article ${className ? className : ''}`}>
      <AdBannerWrapper
        lang={lang}
        className="w-full flex justify-center items-center"
      >
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
