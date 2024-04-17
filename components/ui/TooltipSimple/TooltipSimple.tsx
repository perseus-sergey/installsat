import styles from './TooltipSimple.module.scss';

interface ITooltipSimpleProps {
  children: React.ReactNode;
  tooltipText: React.ReactNode;
}

const TooltipSimple = ({ children, tooltipText }: ITooltipSimpleProps) => (
  <div className={styles.TooltipSimple} data-testid="TooltipSimple">
    {children}
    <span className={styles.tooltipText}>{tooltipText}</span>
  </div>
);

export default TooltipSimple;
