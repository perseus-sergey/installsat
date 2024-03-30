import { ERRORS } from '@/models/ui.model';
import styles from './EmptyPage.module.scss';
import FillingValidImage from '../Images/FillingValidImage';

const EmptyPage = ({ title }: { title: string }) => (
  <div className={styles.EmptyPage}>
    <p className={styles.title}>{title}</p>
    <FillingValidImage
      image={ERRORS.EMPTY_DATE_NEWS_PAGE.img}
      alternativeImgString={ERRORS.EMPTY_DATE_NEWS_PAGE.img.alternativeImgStr}
      alt={title}
    />
  </div>
);

export default EmptyPage;
