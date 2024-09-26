import { ELanguage } from '@/models/ui.model';
// import AdBannerArticleTop from '../GoogleAdsense/AdBannerArticleTop';

interface IProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  lang: ELanguage;
}

const ArticleWrapper = ({ children, className }: IProps) => (
  // const ArticleWrapper = ({ children, lang, className }: IProps) => (
  <article className={`article ${className ? className : ''}`}>
    {/* <AdBannerArticleTop lang={lang} /> */}
    {children}
  </article>
);

export default ArticleWrapper;
