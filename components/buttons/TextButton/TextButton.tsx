import styles from './TextButton.module.scss';

interface TextButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  children?: React.ReactNode;
}

export default ({
  ariaLabel,
  children,
  className,
  ...attributes
}: TextButtonProps) => (
  <div className={styles.BtnWrapper}>
    <button
      aria-label={ariaLabel}
      className={
        className ? `${styles.TextButton} ${className}` : styles.TextButton
      }
      data-testid="TextButton"
      type="button"
      {...attributes}
    >
      {children && children}
    </button>
  </div>
);
