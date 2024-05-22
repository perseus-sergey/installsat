import Image from 'next/image';
import { IMG_PROPERTIES } from '@/models/ui.model';

interface IFillingImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width: number;
  height: number;
  src: string;
  alt?: string;
  isFillParent?: boolean;
  isBlur?: boolean;
  blurImgPath?: string;
  isPriority?: boolean;
  quality?: number;
}

const FillingImg = ({
  width,
  height,
  src,
  alt = '',
  quality = 75,
  isFillParent = false,
  isBlur = false,
  isPriority = false,
  blurImgPath = IMG_PROPERTIES.defaultImgBlur,
}: IFillingImgProps) =>
  isFillParent ? (
    <div
      style={{
        position: 'relative',
        height: `${height}px`,
        // maxHeight: '80vh',
        // width: `${width}px`,
        minWidth: `${width}px`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        sizes={`${width}px`}
        fill
        style={{
          objectFit: 'contain',
          // maxWidth: '100%',
        }}
        placeholder={isBlur ? 'blur' : 'empty'}
        blurDataURL={blurImgPath}
        priority={isPriority}
        quality={quality}
      />
    </div>
  ) : (
    <Image
      width={width}
      height={height}
      style={{ minWidth: width, height: 'auto' }}
      placeholder={isBlur ? 'blur' : 'empty'}
      blurDataURL={blurImgPath}
      src={src}
      alt={alt}
      priority={isPriority}
    />
  );

export default FillingImg;
