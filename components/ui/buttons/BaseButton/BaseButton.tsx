interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  children?: React.ReactNode;
}

export default ({ ariaLabel, children, className, ...attributes }: IProps) => (
  <button
    aria-label={ariaLabel}
    title={ariaLabel}
    className={className}
    {...attributes}
  >
    {children && children}
  </button>
);
