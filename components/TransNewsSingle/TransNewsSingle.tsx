import { Title } from '../Title/Title';
// import styles from './TransNewsSingle.module.scss';
import satNewsStyles from '../SatNewsList/SatNewsList.module.scss';
import React from 'react';
import DangerHtmlUl from '../DangerHtml/DangerHtml';
import { TSatDigest } from '@/models/satDigest.model';
import Image from 'next/image';
import { getDailyNews } from '@/controllers/satDigest.controller';

interface ITransNewsSingleProps {
  newsArray: [string, TSatDigest[]][];
  title: string;
}

const TransNewsSingle = ({ newsArray, title }: ITransNewsSingleProps) => (
  <>
    <Title>{title}</Title>
    <div className={satNewsStyles.newsBlock}>
      {newsArray.map((satNews) => {
        return (
          <React.Fragment key={satNews[0]}>
            <h2 className={satNewsStyles.groupTitle}>
              <Image
                className={satNewsStyles.satImg}
                src={`/images/satellites/${satNews[1][0].satLogo || 'wrong_sat.png'}`}
                alt={`логотип супутника ${satNews[0]}`}
                width={67}
                height={50}
                // width={132}
                // height={99}
              />
              {satNews[0]}
            </h2>
            <div className={satNewsStyles.newsList}>
              <DangerHtmlUl
                text={getDailyNews(satNews[1])}
                wrapperTagName="ul"
              />
            </div>
          </React.Fragment>
        );
      })}
    </div>
  </>
);

export default TransNewsSingle;
