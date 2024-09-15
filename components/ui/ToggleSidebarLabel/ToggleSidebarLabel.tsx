interface IToggleSidebarLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children?: React.ReactNode;
  ariaLabel: string;
}

const ToggleSidebarLabel = ({
  children,
  className,
  ariaLabel,
  ...attributes
}: IToggleSidebarLabelProps) => (
  <label
    htmlFor="toggle-sidebar"
    role="button"
    aria-label={ariaLabel}
    title={ariaLabel}
    className={`lg:hidden inline-block ${className ? ` ${className}` : ''}`}
    data-testid="ToggleSidebarLabel"
    {...attributes}
  >
    {children}
  </label>
);

export default ToggleSidebarLabel;
