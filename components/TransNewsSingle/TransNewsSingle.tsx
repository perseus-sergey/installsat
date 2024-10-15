import { Title } from '../ui/Titles/Title';
import styles from '../SatNewsList/SatNewsList.module.scss';
import { ReactNode } from 'react';
import DangerHtmlUl from '../ui/DangerHtml/DangerHtml';
import { TRANS_NEWS_LIST_IMAGES, TSatDigest } from '@/models/satDigest.model';
import { getDailyNews } from '@/controllers/satDigest.controller';
import FillingValidImage from '../ui/Images/FillingValidImage';
import { decode } from 'html-entities';
import { TitleH2Digest } from '../ui/Titles/TitleH2Digest';
import EmptyData from '../errors/EmptyData/EmptyData';
import { SatLink } from '../DateNewsList/DateNewsList';
import { ELanguage } from '@/models/language.model';

interface ITransNewsSingleProps {
  newsArray: [string, TSatDigest[]][] | null;
  title: ReactNode;
  lang: ELanguage;
}

const TransNewsSingle = ({ newsArray, title, lang }: ITransNewsSingleProps) => (
  <>
    <Title className="!inline-block">{title}</Title>
    {newsArray && newsArray.length > 0 ? (
      <div>
        {newsArray.map((satNews) => {
          const { satLogo } = TRANS_NEWS_LIST_IMAGES;
          const satTitle = decode(satNews[0]);

          return (
            <>
              <TitleH2Digest key={satNews[0]} className="!justify-start">
                <FillingValidImage
                  image={{
                    ...satLogo,
                    src: `${satLogo.path}${satNews[1][0].satLogo}`,
                  }}
                  defaultImage={satLogo.defaultImg}
                  alt={`${satLogo.alt[lang]}${satNews[0]}`}
                />
                <SatLink
                  className="underline"
                  lang={lang}
                  satTitle={satTitle}
                  satSlug={satNews[1][0].sat_slug}
                />
              </TitleH2Digest>
              <div className={`${styles.newsList} sm:text-xl`}>
                <DangerHtmlUl
                  text={getDailyNews(satNews[1])}
                  wrapperTagName="ul"
                />
              </div>
            </>
          );
        })}
      </div>
    ) : (
      <EmptyData
        lang={lang}
        description={
          lang === ELanguage.UA
            ? 'Немає новин за вказаний період'
            : 'There are no news for the specified period'
        }
      />
    )}
  </>
);

export default TransNewsSingle;
