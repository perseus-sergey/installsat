import Image from 'next/image';
import { IMG_PROPERTIES } from '@/models/ui.model';

interface IBlurImageProps {
  imgParentWidth: number;
  imgParentHeight: number;
  imgPath: string;
  alt: string;
  blurImgPath?: string;
}

const BlurImage = ({
  imgParentWidth,
  imgParentHeight,
  imgPath,
  alt,
  blurImgPath = IMG_PROPERTIES.defaultImgBlur,
}: IBlurImageProps) => (
  <div
    style={{
      width: `${imgParentWidth}px`,
      height: `${imgParentHeight}px`,
      position: 'relative',
    }}
    data-testid="BlurImage"
  >
    <Image
      fill
      sizes={`${imgParentWidth}px`}
      placeholder="blur"
      blurDataURL={blurImgPath}
      src={imgPath}
      alt={alt}
    />
  </div>
);

export default BlurImage;
