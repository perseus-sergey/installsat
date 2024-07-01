import { Title } from '../ui/Titles/Title';
import satNewsStyles from '../SatNewsList/SatNewsList.module.scss';
import React from 'react';
import DangerHtmlUl from '../ui/DangerHtml/DangerHtml';
import { META_TRANS_NEWS_LIST, TSatDigest } from '@/models/satDigest.model';
import { getDailyNews } from '@/controllers/satDigest.controller';
import FillingValidImage from '../ui/Images/FillingValidImage';
import { ELanguage, ERRORS } from '@/models/ui.model';
import EmptyPage from '../errors/EmptyPage/EmptyPage';
import { decode } from 'html-entities';

interface ITransNewsSingleProps {
  newsArray: [string, TSatDigest[]][] | null;
  title: string;
  lang: ELanguage;
}

const TransNewsSingle = ({ newsArray, title, lang }: ITransNewsSingleProps) => (
  <>
    <Title>{title}</Title>
    {newsArray && newsArray.length > 0 ? (
      <div className={satNewsStyles.newsBlock}>
        {newsArray.map((satNews) => {
          const { satLogo } = META_TRANS_NEWS_LIST.images;

          return (
            <>
              <h2 className={satNewsStyles.groupTitle} key={satNews[0]}>
                <FillingValidImage
                  image={{
                    ...satLogo,
                    src: `${satLogo.path}${satNews[1][0].satLogo}`,
                  }}
                  defaultImage={satLogo.defaultImg}
                  alternativeImgString={satLogo.alternativeStr}
                  alt={`${satLogo.alt[lang]}${satNews[0]}`}
                />
                {decode(satNews[0])}
              </h2>
              <div className={satNewsStyles.newsList}>
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
      <EmptyPage title={ERRORS.EMPTY_DATE_NEWS_PAGE.title[lang]} />
    )}
  </>
);

export default TransNewsSingle;
