import { EUITitles, MUITitles } from '@/models/ui.model';
import styles from './NotFoundPage.module.scss';
import Link from 'next/link';
import { EUrlParam } from '@/models/url.model';
import { Title } from '../Title/Title';
import Image from 'next/image';

const NotFoundPage = () => (
  <div className={styles.NotFoundPage} data-testid="NotFoundPage">
    <Title className="text-center text-shadow-lg">
      {MUITitles.get(EUITitles.NOT_FOUND_TITLE)?.ua}
    </Title>
    <p className="text-center font-bold text-xl">
      {MUITitles.get(EUITitles.NOT_FOUND_DESCRIPTION)?.ua}
    </p>
    <Link href={EUrlParam.BASE_PATH} className={styles.linkWrapper}>
      <Image
        className=""
        src="/images/InstallsatOrig_400.png"
        alt="Installsat TV Logo"
        width={400}
        height={200}
        priority
      />
      {MUITitles.get(EUITitles.NOT_FOUND_ACTION)?.ua}
    </Link>
  </div>
);

export default NotFoundPage;
