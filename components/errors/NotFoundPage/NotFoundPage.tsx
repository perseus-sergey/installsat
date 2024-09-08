import styles from './NotFoundPage.module.scss';
import { Title } from '../../ui/Titles/Title';
import { DEFAULT_LANG, ERRORS } from '@/models/ui.model';
import FillingImg from '@/components/ui/Images/FillingImage';
import SeoLink from '@/components/ui/SeoLink/SeoLink';

const { width, height, src } = ERRORS.EMPTY_DATE_NEWS_PAGE.img;

const NotFoundPage = () => (
  <div className={styles.NotFoundPage} data-testid="NotFoundPage">
    <Title className="text-center text-shadow-lg">
      {ERRORS.NOT_FOUND_TITLE[DEFAULT_LANG]}
    </Title>
    <FillingImg
      src={src}
      alt="Error page image"
      width={width}
      height={height}
      isPriority
    />
    <p className="text-center font-bold text-xl">
      {ERRORS.NOT_FOUND_DESCRIPTION[DEFAULT_LANG]}
    </p>
    <SeoLink
      href={`/${DEFAULT_LANG}`}
      className={styles.linkWrapper}
      title="Go to the Home Page"
    >
      <FillingImg
        src="/Images/InstallsatOrig_400.png"
        alt="Installsat TV Logo"
        width={400}
        height={200}
        isPriority
        isFillParent
      />
      <p className="text-blue-900 hover:text-red-500">
        {ERRORS.NOT_FOUND_ACTION[DEFAULT_LANG]}
      </p>
    </SeoLink>
  </div>
);

export default NotFoundPage;
