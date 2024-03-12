import styles from './ToggleSidebarLabel.module.scss';

interface IToggleSidebarLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
}

const ToggleSidebarLabel = ({
  children,
  className,
  ...attributes
}: IToggleSidebarLabelProps) => (
  <label
    htmlFor="toggle-sidebar"
    className={
      className
        ? `${styles.ToggleSidebarLabel} ${className}`
        : styles.ToggleSidebarLabel
    }
    data-testid="ToggleSidebarLabel"
    {...attributes}
  >
    {children}
  </label>
);

export default ToggleSidebarLabel;
