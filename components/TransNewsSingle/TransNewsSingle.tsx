import { Title } from '../ui/Titles/Title';
import satNewsStyles from '../SatNewsList/SatNewsList.module.scss';
import { ReactNode } from 'react';
import DangerHtmlUl from '../ui/DangerHtml/DangerHtml';
import { META_TRANS_NEWS_LIST, TSatDigest } from '@/models/satDigest.model';
import { getDailyNews } from '@/controllers/satDigest.controller';
import FillingValidImage from '../ui/Images/FillingValidImage';
import { ELanguage, ERRORS } from '@/models/ui.model';
import { decode } from 'html-entities';
import { TitleH2Digest } from '../ui/Titles/TitleH2Digest';
import EmptyData from '../errors/EmptyData/EmptyData';
import { SatLink } from '../DateNewsList/DateNewsList';

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
          const { satLogo } = META_TRANS_NEWS_LIST.images;
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
                  alternativeImgString={satLogo.alternativeStr}
                  alt={`${satLogo.alt[lang]}${satNews[0]}`}
                />
                <SatLink
                  className="underline"
                  lang={lang}
                  satTitle={satTitle}
                  satSlug={satNews[1][0].sat_slug}
                />
              </TitleH2Digest>
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
      <EmptyData
        lang={lang}
        description={ERRORS.EMPTY_DATE_NEWS_PAGE.title[lang]}
      />
    )}
  </>
);

export default TransNewsSingle;
