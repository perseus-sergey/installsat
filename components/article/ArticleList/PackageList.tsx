import ArticleCard from '../ArticleCard/ArticleCard';
import FillingValidImage from '../../ui/Images/FillingValidImage';
import { EUrlBaseParam } from '@/models/url.model';
import { cutText } from '@/libs/utils/utils';
import DangerHtml from '../../ui/DangerHtml/DangerHtml';
import {
  IChannelPackagesModel,
  PACKAGES_IMAGES,
} from '@/models/channelList.model';
import EmptyData from '@/components/errors/EmptyData/EmptyData';
import { ELanguage } from '@/models/ui.model';
import { INFO_PANEL_TITLES } from '@/models/articles.model';

const { packageImage } = PACKAGES_IMAGES;

const {
  views: viewsTitle,
  // comments: commentsTitle
} = INFO_PANEL_TITLES;

interface IProps {
  packageList: IChannelPackagesModel[];
  lang: ELanguage;
}

const PackageList = ({ packageList, lang }: IProps) =>
  packageList.length > 0 ? (
    <>
      <ul>
        {packageList.map(
          ({
            id,
            title,
            description,
            view,
            // comment_count,
            logo,
            cpu,
          }) => (
            <li key={id}>
              <ArticleCard
                seoCardLinkTitle={
                  lang === ELanguage.UA
                    ? `Перейти до перегляду списку каналів пакету "${title}"`
                    : `Go to view the list of channels in package "${title}"`
                }
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
                    alt={`${packageImage.altPre[lang]} "${title}"`}
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
                  // { name: commentsTitle[lang], value: comment_count },
                ]}
              />
            </li>
          )
        )}
      </ul>
    </>
  ) : (
    <EmptyData lang={lang} />
  );

export default PackageList;
