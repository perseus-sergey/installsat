import styles from './NotFoundPage.module.scss';
import Link from 'next/link';
import { Title } from '../../ui/Titles/Title';
import { EUrlBaseParam } from '@/models/url.model';
import { LANGUAGE, ERRORS } from '@/models/ui.model';
import FillingImg from '@/components/ui/Images/FillingImage';

const NotFoundPage = () => (
  <div className={styles.NotFoundPage} data-testid="NotFoundPage">
    <Title className="text-center text-shadow-lg">
      {ERRORS.NOT_FOUND_TITLE[LANGUAGE]}
    </Title>
    <p className="text-center font-bold text-xl">
      {ERRORS.NOT_FOUND_DESCRIPTION[LANGUAGE]}
    </p>
    <Link href={EUrlBaseParam.BASE_PATH} className={styles.linkWrapper}>
      <FillingImg
        src="/Images/InstallsatOrig_400.png"
        alt="Installsat TV Logo"
        width="400px"
        height="200px"
        isPriority
      />
      {ERRORS.NOT_FOUND_ACTION[LANGUAGE]}
    </Link>
  </div>
);

export default NotFoundPage;
