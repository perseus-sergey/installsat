import { ELanguage } from '@/models/ui.model';
// import AdBanner from '../GoogleAdsense/AdBanner';

// const adsenseId = process.env.G_ADSENSE_ID || '';

interface IProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  lang: ELanguage;
}

const ArticleWrapper = ({ children, className }: IProps) => (
  // const ArticleWrapper = ({ children, lang, className }: IProps) => (
  <article className={`article ${className ? className : ''}`}>
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
