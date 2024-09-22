interface ITooltipSimpleProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  tooltipText: React.ReactNode;
  isTooltipBottomOfPage?: boolean;
  wrapperTagName?: keyof JSX.IntrinsicElements;
}

const TooltipSimple = ({
  children,
  tooltipText,
  className,
  isTooltipBottomOfPage = false,
  wrapperTagName = 'div',
  // ...attributes
}: ITooltipSimpleProps) => {
  const TagName = wrapperTagName as keyof JSX.IntrinsicElements;
  const commonStyles =
    'max-w-xs text-white text-base font-georgia leading-tight font-normal text-center p-2.5 rounded-md z-30';

  return (
    <TagName
      className={`group cursor-context-menu${isTooltipBottomOfPage ? '' : ' relative'}${className ? ` ${className}` : ''}`}
      data-testid="TooltipSimple"
      // {...attributes}
    >
      {children}
      <span
        className={
          isTooltipBottomOfPage
            ? `${commonStyles} bg-sky-700/90 fixed bottom-[3%] right-0 translate-x-[-100vw] duration-500 transition-transform group-hover:translate-x-[-5vw]`
            : `${commonStyles} absolute w-36 -ml-16 left-1/2 bg-indigo-950 bottom-[125%] transition-opacity duration-500 invisible opacity-0 group-hover:visible group-hover:opacity-100`
        }
      >
        {!isTooltipBottomOfPage && (
          <span className="absolute top-full left-1/2 -ml-2 w-0 h-0 border-8 border-solid border-indigo-950 border-b-transparent border-x-transparent"></span>
        )}

        {tooltipText}
      </span>
    </TagName>
  );
};

export default TooltipSimple;
