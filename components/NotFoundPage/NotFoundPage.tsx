import styles from './NotFoundPage.module.scss';
import Link from 'next/link';
import { Title } from '../Title/Title';
import Image from 'next/image';
import { EUrlBaseParam } from '@/models/url.model';
import { CURRENT_LANGUAGE, ERRORS } from '@/models/ui.model';

const NotFoundPage = () => (
  <div className={styles.NotFoundPage} data-testid="NotFoundPage">
    <Title className="text-center text-shadow-lg">
      {ERRORS.NOT_FOUND_TITLE[CURRENT_LANGUAGE]}
    </Title>
    <p className="text-center font-bold text-xl">
      {ERRORS.NOT_FOUND_DESCRIPTION[CURRENT_LANGUAGE]}
    </p>
    <Link href={EUrlBaseParam.BASE_PATH} className={styles.linkWrapper}>
      <Image
        className=""
        src="/Images/InstallsatOrig_400.png"
        alt="Installsat TV Logo"
        width={400}
        height={200}
        priority
      />
      {ERRORS.NOT_FOUND_ACTION[CURRENT_LANGUAGE]}
    </Link>
  </div>
);

export default NotFoundPage;
