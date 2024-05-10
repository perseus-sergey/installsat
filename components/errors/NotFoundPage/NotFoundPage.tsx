import styles from './NotFoundPage.module.scss';
import Link from 'next/link';
import { Title } from '../../ui/Titles/Title';
import { EUrlBaseParam } from '@/models/url.model';
import { LANGUAGE, ERRORS } from '@/models/ui.model';
import FillingImg from '@/components/ui/Images/FillingImage';

const { width, height, src } = ERRORS.EMPTY_DATE_NEWS_PAGE.img;

const NotFoundPage = () => (
  <div className={styles.NotFoundPage} data-testid="NotFoundPage">
    <Title className="text-center text-shadow-lg">
      {ERRORS.NOT_FOUND_TITLE[LANGUAGE]}
    </Title>
    <FillingImg
      src={src}
      alt="Error page image"
      width={width}
      height={height}
      isPriority
    />
    <p className="text-center font-bold text-xl">
      {ERRORS.NOT_FOUND_DESCRIPTION[LANGUAGE]}
    </p>
    <Link href={EUrlBaseParam.BASE_PATH} className={styles.linkWrapper}>
      <FillingImg
        src="/Images/InstallsatOrig_400.png"
        alt="Installsat TV Logo"
        width={400}
        height={200}
        isPriority
      />
      <p className="text-blue-900 hover:text-red-500">
        {ERRORS.NOT_FOUND_ACTION[LANGUAGE]}
      </p>
    </Link>
  </div>
);

export default NotFoundPage;
