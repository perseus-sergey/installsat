// import styles from './EmptyData.module.scss';

import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import { ELanguage, ERRORS } from '@/models/ui.model';

interface IEmptyDataProps {
  lang: ELanguage;
  description?: string;
}

const EmptyData = ({ description, lang }: IEmptyDataProps) => (
  <section
    className="p-5 font-bold text-purple-600 flex flex-col items-center gap-12"
    data-testid="EmptyData"
  >
    <FillingValidImage
      image={ERRORS.EMPTY_DATE_NEWS_PAGE.img}
      alternativeImgString={ERRORS.EMPTY_DATE_NEWS_PAGE.img.alternativeImgStr}
      alt="Empty Data Image"
    />
    <p>{description || ERRORS.ERROR_EMPTY_DATA[lang]}</p>
  </section>
);

export default EmptyData;
