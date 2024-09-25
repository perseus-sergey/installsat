'use client';

import { MouseEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { tooltipSetPosition } from './utilsTooltip';

interface ITooltipProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  hintHtml: ReactNode;
  isAllowedHoverOnMobile?: boolean;
  wrapperTagName?: keyof JSX.IntrinsicElements;
}

const Tooltip = ({
  children,
  hintHtml,
  className,
  isAllowedHoverOnMobile,
  wrapperTagName = 'div',
}: ITooltipProps) => {
  const [TagName] = useState(wrapperTagName as keyof JSX.IntrinsicElements);
  const [elStyles, setElStyles] = useState({});
  const hintRef = useRef<HTMLDivElement>(null);
  const [isHoverSupported, setIsHoverSupported] = useState(
    isAllowedHoverOnMobile
  );

  useEffect(() => {
    if (isAllowedHoverOnMobile) return;

    const mediaQuery = window.matchMedia('(hover: hover)');
    setIsHoverSupported(mediaQuery.matches);
  }, []);

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

  return isHoverSupported ? (
    <TagName
      onMouseMove={mouseMove}
      onMouseOut={mouseOut}
      data-testid="Tooltip"
      className={`group cursor-context-menu ${className ? ` ${className}` : ''}`}
    >
      {children}

      <div
        className="flex flex-col items-center text-center -left-full w-64 bg-slate-900 p-2 absolute z-20 rounded-xl text-stone-100 shadow-md 
        invisible opacity-0 transition-opacity duration-700 group-hover:visible group-hover:opacity-100"
        style={elStyles}
        ref={hintRef}
      >
        {hintHtml}
      </div>
    </TagName>
  ) : (
    <TagName data-testid="Tooltip" className={className}>
      {children}
    </TagName>
  );
};

export default Tooltip;
