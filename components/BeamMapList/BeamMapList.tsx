import {
  IMapModel,
  META_SINGLE_SAT_MAP,
  SINGLE_SAT_MAP_DATA,
} from '@/models/articles.model';
import { TitleH2 } from '../ui/Titles/TitleH2';
import { IMG_PROPERTIES, ELanguage } from '@/models/ui.model';
import FillingImg from '../ui/Images/FillingImage';
import React, { Fragment } from 'react';
import TooltipClient from '../ui/tooltips/TooltipClient/TooltipClient';

const { h2Start } = META_SINGLE_SAT_MAP;

const { images: singleMapImg } = SINGLE_SAT_MAP_DATA;

interface IBeamMapListProps {
  beamList: IMapModel[];
  lang: ELanguage;
}

const BeamMapList = ({ beamList, lang }: IBeamMapListProps) => {
  return beamList.map((item) => {
    const altText = singleMapImg.mapParams.getAlt(
      item.sat_title,
      item.beam_title
    )[lang];

    return (
      <Fragment key={item.beam_slug}>
        <TitleH2>
          {h2Start[lang]} «{item.beam_title}»
        </TitleH2>
        {item.beam_description && <p>{item.beam_description}</p>}
        <TooltipClient
          lang={lang}
          hintDescription={altText}
          hintContent={
            <FillingImg
              width={singleMapImg.bigMapParams.width}
              height={singleMapImg.bigMapParams.height}
              src={`${singleMapImg.bigMapParams.path}${item.map_img}`}
              alt={altText}
              isFillParent
              isBigImage
            />
          }
        >
          <FillingImg
            width={singleMapImg.mapParams.width}
            height={singleMapImg.mapParams.height}
            src={`${singleMapImg.mapParams.path}${item.map_img}`}
            alt={altText}
            blurImgPath={IMG_PROPERTIES.defaultImgBlur}
            isBlur
            isFillParent
            isBigImage
          />
        </TooltipClient>
      </Fragment>
    );
  });
};

export default BeamMapList;
