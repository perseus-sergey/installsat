import { ELanguage } from '@/models/ui.model';
import AdBannerWrapper from '../GoogleAdsense/AdBannerWrapper';
// import AdBannerArticleTop from '../GoogleAdsense/AdBannerArticleTop';
import dynamic from 'next/dynamic';
// import { Suspense } from 'react';

const AdBannerUnderHeader = dynamic(
  () => import('@/components/GoogleAdsense/AdBannerUnderHeader'),
  {
    ssr: false,
  }
);

const adsenseId = process.env.G_ADSENSE_ID || '';

interface IProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  lang: ELanguage;
}

// const ArticleWrapper = ({ children, className }: IProps) => (
const ArticleWrapper = ({ children, lang, className }: IProps) => (
  <article className={`article ${className ? className : ''}`}>
    <AdBannerWrapper
      lang={lang}
      className="w-full flex justify-center items-center"
    >
      <AdBannerUnderHeader adsenseId={adsenseId} />
    </AdBannerWrapper>
    {/* <AdBannerArticleTop lang={lang} /> */}

    {/* <section
      className="h-60 w-full flex justify-center items-center"
      role="complementary"
      aria-label={lang === ELanguage.UA ? 'Реклама' : 'Advertising'}
    >
      <Suspense>
        <AdsHeadMediaBanner
          data-ad-client={`ca-pub-${adsenseId}`}
          data-ad-slot="1581071444"
          data-full-width-responsive="true"
          data-ad-format="auto"
        />
      </Suspense>
    </section> */}

    {children}
  </article>
);

export default ArticleWrapper;
