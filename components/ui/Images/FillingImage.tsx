import Image, { StaticImageData } from 'next/image';
import { IMG_PROPERTIES } from '@/models/ui.model';

interface IFillingImgProps {
  width: string;
  height: string;
  src: string | StaticImageData;
  alt?: string;
  isBlur?: boolean;
  blurImgPath?: string;
  isPriority?: boolean;
}

const FillingImg = ({
  width,
  height,
  src,
  alt = '',
  isBlur = false,
  isPriority = false,
  blurImgPath = IMG_PROPERTIES.defaultImgBlur,
}: IFillingImgProps) => (
  <div
    style={{
      minWidth: width,
      height,
      position: 'relative',
      display: 'inline-block',
    }}
  >
    <Image
      fill
      sizes={width}
      placeholder={isBlur ? 'blur' : 'empty'}
      blurDataURL={blurImgPath}
      src={src}
      alt={alt}
      priority={isPriority}
    />
  </div>
);

export default FillingImg;
