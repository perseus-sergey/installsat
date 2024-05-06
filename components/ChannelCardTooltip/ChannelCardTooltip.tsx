import { IImgParams } from '@/models/ui.model';
import FillingValidImage, {
  IAlternativeImgProps,
} from '../ui/Images/FillingValidImage';
import Tooltip from '../ui/Tooltip/Tooltip';
// import styles from './ChannelCardTooltip.module.scss';

interface ITooltipTextList {
  title: string;
  description: string | number;
}

interface IChannelCardTooltipProps {
  mainImage: IImgParams;
  mainDefaultImage: IImgParams;
  mainAlternativeImgString: IAlternativeImgProps;
  tooltipTextList: ITooltipTextList[];
  tooltipImage?: IImgParams;
  tooltipDefaultImage?: IImgParams;
  tooltipAlternativeImgString?: IAlternativeImgProps;
  mainIsChangeToGif?: boolean;
  children?: React.ReactNode;
}

const ChannelCardTooltip = ({
  mainImage,
  mainDefaultImage,
  mainAlternativeImgString,
  tooltipTextList,
  tooltipImage = mainImage,
  tooltipDefaultImage = mainDefaultImage,
  tooltipAlternativeImgString = mainAlternativeImgString,
  mainIsChangeToGif = false,
  children,
}: IChannelCardTooltipProps) => (
  <div
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
  >
    <Tooltip
      hintHtml={
        <>
          <FillingValidImage
            image={tooltipImage}
            defaultImage={tooltipDefaultImage}
            alternativeImgString={tooltipAlternativeImgString}
          />
          <div className="py-2.5 px-5">
            <ul>
              {tooltipTextList.map(
                ({ title, description }, i) =>
                  title &&
                  description && (
                    <li key={`${title}${i}`}>
                      {title}: <strong>{description}</strong>
                    </li>
                  )
              )}
            </ul>
          </div>
        </>
      }
    >
      <FillingValidImage
        image={mainImage}
        defaultImage={mainDefaultImage}
        alternativeImgString={mainAlternativeImgString}
        isChangeToGif={mainIsChangeToGif}
      />
    </Tooltip>
    {children && children}
  </div>
);

export default ChannelCardTooltip;
