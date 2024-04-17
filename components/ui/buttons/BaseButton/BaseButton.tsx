import styles from './BaseButton.module.scss';

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  children?: React.ReactNode;
}

export default ({ ariaLabel, children, className, ...attributes }: IProps) => (
  // <div className={styles.BtnWrapper}>
  <button
    aria-label={ariaLabel}
    className={className ? `${styles.Button} ${className}` : styles.Button}
    data-testid="TextButton"
    type="button"
    {...attributes}
  >
    {children && children}
  </button>
  // </div>
);
