import { IImgParams } from '@/models/ui.model';
import FillingValidImage from '../ui/Images/FillingValidImage';
import Tooltip from '../ui/tooltips/TooltipMovingClient/Tooltip';

interface ITooltipTextList {
  title: string;
  description?: string | number | string[] | number[];
}

interface IChannelCardTooltipProps {
  mainImage: IImgParams;
  mainDefaultImage: IImgParams;
  tooltipTextList: ITooltipTextList[];
  tooltipImage?: IImgParams;
  tooltipDefaultImage?: IImgParams;
  mainIsChangeToGif?: boolean;
  children?: React.ReactNode;
}

const ChannelCardTooltip = ({
  mainImage,
  mainDefaultImage,
  tooltipTextList,
  tooltipImage = mainImage,
  tooltipDefaultImage = mainDefaultImage,
  mainIsChangeToGif = false,
  children,
}: IChannelCardTooltipProps) => (
  <div
    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
  >
    <Tooltip
      className="inline-block border-b border-dotted border-gray-600 leading-none"
      hintHtml={
        <>
          <FillingValidImage
            image={tooltipImage}
            defaultImage={tooltipDefaultImage}
            className="bg-white"
          />
          <ul className="py-2.5 px-5">
            {tooltipTextList.map(({ title, description }, i) =>
              title && description ? (
                Array.isArray(description) ? (
                  <li key={`${title}${i}`} className="w-60">
                    <h3>-= {title} =-</h3>
                    <ul
                      key={`${title}${i}`}
                      className="text-sm border border-gray-300 border-groove p-2 rounded-md grid grid-cols-[repeat(auto-fit,minmax(40px,1fr))] gap-2"
                    >
                      {description.map((desc, i) => (
                        <li key={`${title}${i}`} className="bg-indigo-900">
                          {desc}
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={`${title}${i}`}>
                    {title}: <strong>{description}</strong>
                  </li>
                )
              ) : null
            )}
          </ul>
        </>
      }
    >
      <div className="bg-white">
        <FillingValidImage
          image={mainImage}
          defaultImage={mainDefaultImage}
          isChangeToGif={mainIsChangeToGif}
        />
      </div>
    </Tooltip>
    {children && children}
  </div>
);

export default ChannelCardTooltip;
