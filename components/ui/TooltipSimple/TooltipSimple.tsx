import styles from './TooltipSimple.module.scss';

interface ITooltipSimpleProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  tooltipText: React.ReactNode;
}

const TooltipSimple = ({
  children,
  tooltipText,
  className,
  ...attributes
}: ITooltipSimpleProps) => (
  <div
    className={`${styles.TooltipSimple}${className ? ` ${className}` : ''}`}
    data-testid="TooltipSimple"
    {...attributes}
  >
    {children}
    <span className={styles.tooltipText}>{tooltipText}</span>
  </div>
);

export default TooltipSimple;
