import Image from 'next/image';

import { ELanguage } from '@/models/language.model';
import BreadCrumbServer, {
  IBreadCrumbLink,
} from '@/components/BreadCrumbs/BreadCrumbsServer';
import emptyPageImg from 'public/Images/empty_page.png';
import ArticleWrapper from '@/components/article/ArticleWrapper';
import { EMPTY_IMG_ALT } from '@/models/emptyData.model';

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
        <Image src={emptyPageImg} alt={EMPTY_IMG_ALT[lang]} />
      </div>
    </ArticleWrapper>
  </>
);

export default EmptyPage;
