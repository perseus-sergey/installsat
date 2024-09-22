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
    aria-label={ariaLabel}
    title={ariaLabel}
    className={`inline-block transition-all ease-linear duration-300 ${className ? ` ${className}` : ''}`}
    // className={`lg:hidden inline-block ${className ? ` ${className}` : ''}`}
    data-testid="ToggleSidebarLabel"
    {...attributes}
  >
    {children}
  </label>
);

export default ToggleSidebarLabel;
