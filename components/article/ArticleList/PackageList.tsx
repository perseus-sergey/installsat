import { ARTICLES } from '@/models/articles.model';
import ArticleCard from '../ArticleCard/ArticleCard';
import FillingValidImage from '../../ui/Images/FillingValidImage';
import { DEFAULT_LANG } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { cutText } from '@/libs/utils/utils';
import DangerHtml from '../../ui/DangerHtml/DangerHtml';
import {
  IChannelPackagesModel,
  META_PACKAGES,
} from '@/models/channelList.model';
import EmptyData from '@/components/errors/EmptyData/EmptyData';

const { packageImage } = META_PACKAGES;

const { views: viewsTitle, comments: commentsTitle } = ARTICLES.infoPanelTitles;

interface IProps {
  packageList: IChannelPackagesModel[];
}

const PackageList = ({ packageList }: IProps) =>
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
                    alt={`${packageImage.altPre[DEFAULT_LANG]} ${title}`}
                    isBlur
                  />
                }
                articleDescription={
                  <DangerHtml
                    text={cutText(description, 250)}
                    wrapperTagName="span"
                  />
                }
                href={`/${EUrlBaseParam.PACKAGE_CHANNEL_LIST}/${cpu}`}
                infoPanelItems={[
                  { name: viewsTitle[DEFAULT_LANG], value: view },
                  { name: commentsTitle[DEFAULT_LANG], value: comment_count },
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
