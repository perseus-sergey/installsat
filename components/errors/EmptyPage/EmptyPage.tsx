import { ELanguage } from '@/models/ui.model';
import BreadCrumbServer, {
  IBreadCrumbLink,
} from '@/components/BreadCrumbs/BreadCrumbsServer';
import Image from 'next/image';
import emptyPageImg from 'public/Images/empty_page.png';
import ArticleWrapper from '@/components/article/ArticleWrapper';

interface IProps {
  breadCrumbList?: (string | IBreadCrumbLink)[];
  title: string;
  lang: ELanguage;
}

const EmptyPage = ({ title, lang, breadCrumbList }: IProps) => (
  <>
    <BreadCrumbServer lang={lang} breadCrumbList={breadCrumbList} />
    <ArticleWrapper lang={lang}>
      <div className="text-red-500 text-lg flex items-center flex-col gap-20">
        <p className="p-4 text-center font-bold text-xl">{title}</p>
        <Image
          src={emptyPageImg}
          alt={
            lang === ELanguage.UA
              ? 'Зображення космосу для позначення порожнього результату'
              : 'Image of space for marking an empty result'
          }
        />
      </div>
    </ArticleWrapper>
  </>
);

export default EmptyPage;
