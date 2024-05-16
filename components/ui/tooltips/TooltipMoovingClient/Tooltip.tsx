'use client';

import { MouseEvent, ReactNode, useRef, useState } from 'react';
import styles from './Tooltip.module.scss';
import { tooltipSetPosition } from './utilsTooltip';

interface ITooltipProps {
  children: ReactNode;
  hintHtml: ReactNode;
}

const Tooltip = ({ children, hintHtml }: ITooltipProps) => {
  const [elStyles, setElStyles] = useState({});
  const hintRef = useRef<HTMLDivElement>(null);

  const mouseMove = (e: MouseEvent) => {
    setElStyles((oldStyles) =>
      tooltipSetPosition(oldStyles, e, hintRef.current)
    );
  };

  const mouseOut = () => {
    setElStyles((oldStyles) => ({
      ...oldStyles,
      left: '-200vw',
    }));
  };

  return (
    <div
      onMouseMove={mouseMove}
      onMouseOut={mouseOut}
      className={styles.Tooltip}
      data-testid="Tooltip"
    >
      {children}

      <div className={styles.hint} style={elStyles} ref={hintRef}>
        {hintHtml}
      </div>
    </div>
  );
};

export default Tooltip;
