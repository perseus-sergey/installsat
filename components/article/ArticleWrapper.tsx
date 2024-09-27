import { ELanguage } from '@/models/ui.model';

interface IProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  lang: ELanguage;
}

const ArticleWrapper = ({ children, className }: IProps) => (
  // const ArticleWrapper = ({ children, lang, className }: IProps) => (
  <article className={`article ${className ? className : ''}`}>
    {children}
  </article>
);

export default ArticleWrapper;
