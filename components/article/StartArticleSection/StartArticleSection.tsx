import styles from './StartArticleSection.module.scss';

interface IStartArticleSectionProps {
  children?: React.ReactNode;
}

const StartArticleSection = ({ children }: IStartArticleSectionProps) => (
  <section
    className={styles.StartArticleSection}
    data-testid="StartArticleSection"
  >
    {children}
  </section>
);

export default StartArticleSection;
