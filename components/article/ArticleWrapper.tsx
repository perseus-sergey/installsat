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

// const ArticleWrapper = ({ children, className }: IProps) => (
const ArticleWrapper = ({ children, lang, className }: IProps) => (
  <article className={`article relative ${className ? className : ''}`}>
    <AdBannerWrapper
      lang={lang}
      className="absolute left-0 top-0 w-full flex justify-center items-center"
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

    <section
      className="pt-80 md:pt-72"
      aria-label={lang === ELanguage.UA ? 'Основний контент' : 'Basic content'}
    >
      {children}
    </section>
  </article>
);

export default ArticleWrapper;
