import { ERRORS } from '@/models/ui.model';
import FillingValidImage from '../../ui/Images/FillingValidImage';

const EmptyPage = ({ title }: { title: string }) => (
  <div className="text-red-500 text-lg flex items-center flex-col gap-20">
    <p className="p-4">{title}</p>
    <FillingValidImage
      image={ERRORS.EMPTY_DATE_NEWS_PAGE.img}
      alternativeImgString={ERRORS.EMPTY_DATE_NEWS_PAGE.img.alternativeImgStr}
      alt={title}
    />
  </div>
);

export default EmptyPage;
