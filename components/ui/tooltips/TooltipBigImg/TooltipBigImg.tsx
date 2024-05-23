import { ReactNode } from 'react';
import styles from './TooltipBigImg.module.scss';

interface ITooltipBigImgProps {
  children: ReactNode;
  hintImg: ReactNode;
  hintDescription: string;
}

const TooltipBigImg = ({
  children,
  hintImg,
  hintDescription,
}: ITooltipBigImgProps) => {
  return (
    <div className="m-4">
      {children}

      <figure className={styles.hint}>
        {hintImg}
        <figcaption className="p-2">{hintDescription}</figcaption>
      </figure>
    </div>
  );
};

export default TooltipBigImg;
