import { MouseEvent } from 'react';

export const tooltipSetPosition = (
  oldStyle: React.CSSProperties,
  e: MouseEvent,
  hintElement: HTMLElement | null
) => {
  const { pageX, pageY } = e;
  if (!hintElement) return;

  const offsetFromCursorY = 15;

  const windowWidth = window.innerWidth - 20;
  const windowHeight = window.innerHeight - 20;

  const rightEdge = windowWidth - e.clientX;
  const bottomEdge = windowHeight - e.clientY - offsetFromCursorY;

  // const styleLeft = `${pageX - hintElement.offsetWidth / 2}px`;

  // const styleLeft =
  //   rightEdge < hintElement.offsetWidth
  //     ? `${pageX - hintElement.offsetWidth}px`
  //     : `${pageX}px`;

  const styleLeft =
    rightEdge < hintElement.offsetWidth
      ? `${pageX - hintElement.offsetWidth / 2}px`
      : `${pageX}px`;

  const styleTop =
    bottomEdge < hintElement.offsetHeight
      ? `${pageY - hintElement.offsetHeight - offsetFromCursorY}px`
      : `${pageY + offsetFromCursorY}px`;

  return {
    ...oldStyle,
    top: styleTop,
    left: styleLeft,
  };
};
