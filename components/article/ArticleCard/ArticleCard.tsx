import { ELanguage } from '@/models/language.model';
import BottomInfoPanel, {
  IBottomInfoPanelItem,
} from '../../BottomInfoPanel/BottomInfoPanel';
import SeoLink from '@/components/ui/SeoLink/SeoLink';

interface IArticleCardProps {
  lang: ELanguage;
  articleTitle: React.ReactNode;
  href: string;
  seoCardLinkTitle: string;
  image?: React.ReactNode;
  isTitleCentered?: boolean;
  articleDescription: React.ReactNode;
  infoPanelItems: IBottomInfoPanelItem[];
}

const ArticleCard = ({
  lang,
  articleDescription,
  articleTitle,
  image,
  infoPanelItems,
  href,
  seoCardLinkTitle,
  isTitleCentered = false,
}: IArticleCardProps) => (
  <section
    className="mb-4 shadow-[2px_2px_5px_#999999] hover:shadow-[2px_2px_5px_#5a5a5a] transition-transform hover:translate-y-px duration-100"
    data-testid="ArticleCard"
  >
    <SeoLink href={href} title={seoCardLinkTitle}>
      <h2
        style={{ textShadow: '0 1px 0 #ffffff, 1px 3px 3px #999999' }}
        className={`${isTitleCentered ? 'justify-center' : ''} flex items-start gap-4 font-verdana text-indigo-800 text-xl font-bold py-4 px-2`}
      >
        {articleTitle}
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
        {articleDescription}
        {image && image}
      </div>
    </SeoLink>
    <BottomInfoPanel items={infoPanelItems} lang={lang} />
  </section>
);

export default ArticleCard;
