// import styles from './EmptyData.module.scss';

import FillingValidImage from '@/components/ui/Images/FillingValidImage';
import { LANGUAGE, ERRORS, IS_PRODUCTION } from '@/models/ui.model';

interface IEmptyDataProps {
  description?: string;
}

const EmptyData = ({ description }: IEmptyDataProps) => (
  <h3
    className="p-5 font-bold text-purple-600 flex flex-col items-center"
    data-testid="EmptyData"
  >
    <FillingValidImage
      image={ERRORS.EMPTY_DATE_NEWS_PAGE.img}
      alternativeImgString={ERRORS.EMPTY_DATE_NEWS_PAGE.img.alternativeImgStr}
      alt="Empty Data Image"
    />
    {ERRORS.ERROR_EMPTY_DATA[LANGUAGE]}
    {description && !IS_PRODUCTION ? <span>: {description}</span> : null}
  </h3>
);

export default EmptyData;
