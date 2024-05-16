interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  children?: React.ReactNode;
}

export default ({ ariaLabel, children, className, ...attributes }: IProps) => (
  <button
    aria-label={ariaLabel}
    className={className}
    data-testid="TextButton"
    type="button"
    role="button"
    {...attributes}
  >
    {children && children}
  </button>
);
