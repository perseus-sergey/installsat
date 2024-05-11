import { IMapModel, SAT_MAPS_MODEL } from '@/models/articles.model';
import { TitleH2 } from '../ui/Titles/TitleH2';
import { IMG_PROPERTIES, LANGUAGE } from '@/models/ui.model';
import FillingImg from '../ui/Images/FillingImage';
import React, { Fragment } from 'react';
// import TooltipBigImg from '../ui/tooltips/TooltipBigImg/TooltipBigImg';
import TooltipClient from '../ui/tooltips/TooltipClient/TooltipClient';

const {
  metaSingleMap: { h2Start },
  images: { singleMap },
} = SAT_MAPS_MODEL;

interface IBeamMapListProps {
  beamList: IMapModel[];
}

const BeamMapList = ({ beamList }: IBeamMapListProps) => {
  return beamList.map((item) => {
    const altText = singleMap.mapParams.getAlt(item.sat_title, item.beam_title)[
      LANGUAGE
    ];

    return (
      <Fragment key={item.beam_slug}>
        <TitleH2>
          {h2Start[LANGUAGE]} «{item.beam_title}»
        </TitleH2>
        {item.beam_description && <p>{item.beam_description}</p>}
        <TooltipClient
          className="p-4"
          hintDescription={altText}
          hintContent={
            <FillingImg
              width={singleMap.bigMapParams.width}
              height={singleMap.bigMapParams.height}
              src={`${singleMap.bigMapParams.path}${item.map_img}`}
              alt={altText}
              isFillParent
            />
          }
        >
          <FillingImg
            width={singleMap.mapParams.width}
            height={singleMap.mapParams.height}
            src={`${singleMap.mapParams.path}${item.map_img}`}
            alt={altText}
            blurImgPath={IMG_PROPERTIES.defaultImgBlur}
            isBlur
            isFillParent
          />
        </TooltipClient>
      </Fragment>
    );
  });
};

export default BeamMapList;
