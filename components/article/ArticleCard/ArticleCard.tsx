import Link from 'next/link';
import styles from './ArticleCard.module.scss';
import BottomInfoPanel, {
  IBottomInfoPanelItem,
} from '../../BottomInfoPanel/BottomInfoPanel';

interface IArticleCardProps {
  articleTitle: React.ReactNode;
  href: string;
  image?: React.ReactNode;
  articleDescription: React.ReactNode;
  infoPanelItems: IBottomInfoPanelItem[];
}

const ArticleCard = ({
  articleDescription,
  articleTitle,
  image,
  infoPanelItems,
  href,
}: IArticleCardProps) => (
  <section className={styles.ArticleCard} data-testid="ArticleCard">
    <h2>
      <Link className={styles.h2Title} href={href}>
        {articleTitle}
      </Link>
    </h2>
    <div className={styles.descriptionWrapper}>
      <div className={styles.text}>{articleDescription}</div>
      <Link href={href} className={styles.image}>
        {image && image}
      </Link>
    </div>
    <BottomInfoPanel items={infoPanelItems} />
  </section>
);

export default ArticleCard;
