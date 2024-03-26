import { Title } from '../Title/Title';
import satNewsStyles from '../SatNewsList/SatNewsList.module.scss';
import React from 'react';
import DangerHtmlUl from '../DangerHtml/DangerHtml';
import { META_TRANS_NEWS_LIST, TSatDigest } from '@/models/satDigest.model';
import { getDailyNews } from '@/controllers/satDigest.controller';
import FillingValidImage from '../Images/FillingValidImage';

interface ITransNewsSingleProps {
  newsArray: [string, TSatDigest[]][];
  title: string;
}

const TransNewsSingle = ({ newsArray, title }: ITransNewsSingleProps) => (
  <>
    <Title>{title}</Title>
    <div className={satNewsStyles.newsBlock}>
      {newsArray.map((satNews) => (
        <>
          <h2 className={satNewsStyles.groupTitle} key={satNews[0]}>
            <FillingValidImage
              image={{
                ...META_TRANS_NEWS_LIST.images.satLogo,
                src: `${META_TRANS_NEWS_LIST.images.satLogo.path}${satNews[1][0].satLogo}`,
              }}
              defaultImage={META_TRANS_NEWS_LIST.images.satLogo.defaultImg}
              alternativeImgString={
                META_TRANS_NEWS_LIST.images.satLogo.alternativeStr
              }
              alt={`${META_TRANS_NEWS_LIST.images.satLogo.alt.ua}${satNews[0]}`}
            />
            {satNews[0]}
          </h2>
          <div className={satNewsStyles.newsList}>
            <DangerHtmlUl text={getDailyNews(satNews[1])} wrapperTagName="ul" />
          </div>
        </>
      ))}
    </div>
  </>
);

export default TransNewsSingle;
