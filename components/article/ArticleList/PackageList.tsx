import { ARTICLES } from '@/models/articles.model';
import ArticleCard from '../ArticleCard/ArticleCard';
import FillingValidImage from '../../ui/Images/FillingValidImage';
import { LANGUAGE } from '@/models/ui.model';
import { EUrlBaseParam } from '@/models/url.model';
import { cutText } from '@/libs/utils/utils';
import DangerHtml from '../../ui/DangerHtml/DangerHtml';
import {
  IChannelPackagesModel,
  META_PACKAGES,
} from '@/models/channelList.model';

const { packageImage } = META_PACKAGES;

const { views: viewsTitle, comments: commentsTitle } = ARTICLES.infoPanelTitles;

interface IProps {
  packageList: IChannelPackagesModel[];
}

const PackageList = ({ packageList }: IProps) => (
  <>
    <ul>
      {packageList.map(
        ({ id, title, description, view, comment_count, logo, cpu }) => (
          <li key={id}>
            <ArticleCard
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
                  alt={`${packageImage.altPre[LANGUAGE]} ${title}`}
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
                { name: viewsTitle[LANGUAGE], value: view },
                { name: commentsTitle[LANGUAGE], value: comment_count },
              ]}
            />
          </li>
        )
      )}
    </ul>
  </>
);

export default PackageList;
