import { ARTICLES } from '@/models/articles.model';
import ArticleCard from '../ArticleCard/ArticleCard';
import FillingValidImage from '../../ui/Images/FillingValidImage';
import { EUrlBaseParam } from '@/models/url.model';
import { cutText } from '@/libs/utils/utils';
import DangerHtml from '../../ui/DangerHtml/DangerHtml';
import {
  IChannelPackagesModel,
  META_PACKAGES,
} from '@/models/channelList.model';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { ELanguage } from '@/models/ui.model';

const { packageImage } = META_PACKAGES;

const { views: viewsTitle, comments: commentsTitle } = ARTICLES.infoPanelTitles;

interface IProps {
  packageList: IChannelPackagesModel[];
  lang: ELanguage;
}

const PackageList = ({ packageList, lang }: IProps) =>
  packageList.length > 0 ? (
    <>
      <ul>
        {packageList.map(
          ({ id, title, description, view, comment_count, logo, cpu }) => (
            <li key={id}>
              <ArticleCard
                isTitleCentered
                articleTitle={title}
                image={
                  <FillingValidImage
                    image={{
                      width: packageImage.width,
                      height: packageImage.height,
                      src: `${packageImage.path}${logo}`,
                    }}
                    defaultImage={packageImage.defaultImg}
                    alternativeImgString={packageImage.alternativeStr}
                    alt={`${packageImage.altPre[lang]} ${title}`}
                    isBlur
                  />
                }
                articleDescription={
                  <DangerHtml
                    text={cutText(description, 250)}
                    wrapperTagName="span"
                  />
                }
                href={`/${lang}/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${cpu}`}
                infoPanelItems={[
                  { name: viewsTitle[lang], value: view },
                  { name: commentsTitle[lang], value: comment_count },
                ]}
              />
            </li>
          )
        )}
      </ul>
    </>
  ) : (
    <EmptyData />
  );

export default PackageList;
