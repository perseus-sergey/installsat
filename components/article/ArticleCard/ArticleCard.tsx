import styles from './ArticleCard.module.scss';
import BottomInfoPanel, {
  IBottomInfoPanelItem,
} from '../../BottomInfoPanel/BottomInfoPanel';
import SeoLink from '@/components/ui/SeoLink/SeoLink';

interface IArticleCardProps {
  articleTitle: React.ReactNode;
  href: string;
  seoCardLinkTitle: string;
  image?: React.ReactNode;
  isTitleCentered?: boolean;
  articleDescription: React.ReactNode;
  infoPanelItems: IBottomInfoPanelItem[];
}

const ArticleCard = ({
  articleDescription,
  articleTitle,
  image,
  infoPanelItems,
  href,
  seoCardLinkTitle,
  isTitleCentered = false,
}: IArticleCardProps) => (
  <section className={styles.ArticleCard} data-testid="ArticleCard">
    <SeoLink href={href} title={seoCardLinkTitle}>
      <h2
        style={isTitleCentered ? { justifyContent: 'center' } : {}}
        className={styles.h2Title}
      >
        {articleTitle}
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
        {articleDescription}
        {image && image}
      </div>
    </SeoLink>
    <BottomInfoPanel items={infoPanelItems} />
  </section>
);

export default ArticleCard;
