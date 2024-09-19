import { IImgParams, IMG_PROPERTIES } from '@/models/ui.model';
import FillingImg from './FillingImage';
import { imagePathValidate } from '@/libs/utils/imagePathValidate';

interface IFillingImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  image: IImgParams;
  defaultImage: IImgParams;
  alt?: string;
  isBlur?: boolean;
  blurImgPath?: string;
  isChangeToGif?: boolean;
  isFillParent?: boolean;
}

const FillingValidImage = ({
  image,
  defaultImage,
  alt = '',
  isBlur = false,
  blurImgPath = IMG_PROPERTIES.defaultImgBlur,
  isChangeToGif = false,
  isFillParent = false,
  className,
}: IFillingImgProps) => {
  const validImg = imagePathValidate(image, defaultImage, isChangeToGif);

  return (
    <FillingImg
      {...validImg}
      alt={alt}
      isBlur={isBlur}
      blurImgPath={blurImgPath}
      isFillParent={isFillParent}
      className={className}
    />
  );
};

export default FillingValidImage;
