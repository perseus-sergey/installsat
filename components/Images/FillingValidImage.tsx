import { IImgParams, IMG_PROPERTIES } from '@/models/ui.model';
import { imagePathValidate } from '@/libs/utilsServer';
import FillingImg from './FillingImage';

interface IFillingImgProps {
  image: IImgParams;
  defaultImage?: IImgParams;
  alternativeImgString: { title: string; fontSize: string };
  alt?: string;
  isBlur?: boolean;
  blurImgPath?: string;
  isChangeToGif?: boolean;
}

const FillingValidImage = ({
  image,
  defaultImage,
  alternativeImgString,
  alt = '',
  isBlur = false,
  blurImgPath = IMG_PROPERTIES.defaultImgBlur,
  isChangeToGif = false,
}: IFillingImgProps) => {
  const validImg = imagePathValidate(
    image,
    alternativeImgString.title,
    defaultImage,
    isChangeToGif
  );

  return typeof validImg !== 'string' ? (
    <FillingImg
      {...validImg}
      alt={alt}
      isBlur={isBlur}
      blurImgPath={blurImgPath}
    />
  ) : (
    <span style={{ fontSize: alternativeImgString.fontSize }}>{validImg}</span>
  );
};

export default FillingValidImage;
