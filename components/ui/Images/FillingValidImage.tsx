import { IImgParams, IMG_PROPERTIES } from '@/models/ui.model';
import FillingImg from './FillingImage';
import { imagePathValidate } from '@/libs/utils/imagePathValidate';

export interface IAlternativeImgProps {
  title: string;
  fontSize: string;
}
interface IFillingImgProps {
  image: IImgParams;
  defaultImage?: IImgParams;
  alternativeImgString: IAlternativeImgProps;
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
