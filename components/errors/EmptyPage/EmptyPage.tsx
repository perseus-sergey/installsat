import { ELanguage, ERRORS } from '@/models/ui.model';
import FillingValidImage from '../../ui/Images/FillingValidImage';
import BreadCrumbServer from '@/components/BreadCrumbs/BreadCrumbsServer';

const EmptyPage = ({ title, lang }: { title: string; lang: ELanguage }) => (
  <>
    <BreadCrumbServer lang={lang} />
    <article className="article">
      <div className="text-red-500 text-lg flex items-center flex-col gap-20">
        <p className="p-4">{title}</p>
        <FillingValidImage
          image={ERRORS.EMPTY_DATE_NEWS_PAGE.img}
          alternativeImgString={
            ERRORS.EMPTY_DATE_NEWS_PAGE.img.alternativeImgStr
          }
          alt={title}
        />
      </div>
    </article>
  </>
);

export default EmptyPage;
