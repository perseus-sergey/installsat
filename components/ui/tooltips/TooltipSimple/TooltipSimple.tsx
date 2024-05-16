import styles from './TooltipSimple.module.scss';

interface ITooltipSimpleProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  tooltipText: React.ReactNode;
  isTooltipBottomOfPage?: boolean;
}

const TooltipSimple = ({
  children,
  tooltipText,
  className,
  isTooltipBottomOfPage = false,
  ...attributes
}: ITooltipSimpleProps) => (
  <div
    className={`${styles.TooltipSimple}${isTooltipBottomOfPage ? '' : ' relative'}${className ? ` ${className}` : ''}`}
    data-testid="TooltipSimple"
    {...attributes}
  >
    {children}
    <span
      className={
        isTooltipBottomOfPage ? styles.tooltipBottom : styles.tooltipText
      }
    >
      {tooltipText}
    </span>
  </div>
);

export default TooltipSimple;
