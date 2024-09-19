import styles from './NotFoundPage.module.scss';
import { Title } from '../../ui/Titles/Title';
import { DEFAULT_LANG, NOT_FOUND_PAGE } from '@/models/ui.model';
import SeoLink from '@/components/ui/SeoLink/SeoLink';
import Image from 'next/image';
import emptyPageImg from 'public/Images/empty_page.png';
import mainLogoImg from 'public/Images/InstallsatOrig_400.png';

const NotFoundPage = () => (
  <div className={styles.NotFoundPage} data-testid="NotFoundPage">
    <Title className="text-center text-shadow-lg">
      {NOT_FOUND_PAGE.NOT_FOUND_TITLE[DEFAULT_LANG]}
    </Title>
    <Image
      src={emptyPageImg}
      alt="Image of space for marking an empty result"
      priority
    />
    <p className="text-center font-bold text-xl">
      {NOT_FOUND_PAGE.NOT_FOUND_DESCRIPTION[DEFAULT_LANG]}
    </p>
    <SeoLink
      href={`/${DEFAULT_LANG}`}
      className={styles.linkWrapper}
      title="Go to the Home Page"
    >
      <Image src={mainLogoImg} alt="Installsat TV Logo" priority />
      <p className="text-blue-900 hover:text-red-500">
        {NOT_FOUND_PAGE.NOT_FOUND_ACTION[DEFAULT_LANG]}
      </p>
    </SeoLink>
  </div>
);

export default NotFoundPage;
