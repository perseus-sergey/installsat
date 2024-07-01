import { MChanTheme, META_SAT_CHANNEL_LIST } from '@/models/channelList.model';
import TooltipSimple from '../../tooltips/TooltipSimple/TooltipSimple';
import FillingImg from '../FillingImage';
import React from 'react';
import { ELanguage } from '@/models/ui.model';

const {
  images: { genreImage },
} = META_SAT_CHANNEL_LIST;

interface IGenreImageProps extends React.HtmlHTMLAttributes<HTMLElement> {
  genreMapPosition: number;
  tooltipText: string;
  lang: ELanguage;
}

const GenreImage = ({
  genreMapPosition,
  tooltipText,
  lang,
  className,
}: IGenreImageProps) => (
  <TooltipSimple tooltipText={tooltipText} className={className}>
    <FillingImg
      width={genreImage.width}
      height={genreImage.height}
      alt={`${genreImage.altPre[lang]} ${tooltipText}`}
      src={`${genreImage.path}${MChanTheme.get(genreMapPosition)}`}
    />
  </TooltipSimple>
);

export default GenreImage;
