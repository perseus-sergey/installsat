import {
  MChanTheme,
  SAT_CHANNEL_LIST_IMAGES,
} from '@/models/channels/channelList.model';
import TooltipSimple from '../../tooltips/TooltipSimple/TooltipSimple';
import FillingImg from '../FillingImage';
import React from 'react';
import { ELanguage } from '@/models/language.model';

const { genreImage } = SAT_CHANNEL_LIST_IMAGES;

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
