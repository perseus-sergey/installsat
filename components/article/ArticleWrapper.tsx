import { ELanguage } from '@/models/ui.model';
import AdsHeadMediaBanner from '../GoogleAdsense/AdsHeadMediaBanner';
// import AdBanner from '../GoogleAdsense/AdBanner';

const adsenseId = process.env.G_ADSENSE_ID || '';

interface IProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  lang: ELanguage;
}

const ArticleWrapper = ({ children, className }: IProps) => (
  // const ArticleWrapper = ({ children, lang, className }: IProps) => (
  <article className={`article ${className ? className : ''}`}>
    <AdsHeadMediaBanner
      data-ad-client={`ca-pub-${adsenseId}`}
      data-ad-slot="1581071444"
      data-full-width-responsive="true"
      // data-ad-layout="in-article"
      data-ad-format="auto"
    />
    {/* <AdBannerArticleTop lang={lang} /> */}
    {/* <div
      className="min-h-64 w-full flex justify-center items-center"
      role="complementary"
      aria-label={lang === ELanguage.UA ? 'Реклама' : 'Advertising'}
    >
      <AdBanner>
        <ins
          className="adsbygoogle block"
          data-ad-client={`ca-pub-${adsenseId}`}
          data-ad-slot="1581071444"
          data-full-width-responsive="true"
          data-ad-format="auto"
        />
      </AdBanner>
    </div> */}
    {children}
  </article>
);

export default ArticleWrapper;
