import styles from './TextButton.module.scss';

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default ({ children, className, ...attributes }: TextButtonProps) => (
  <div className={styles.BtnWrapper}>
    <button
      className={className ? `${styles.TextButton} ${className}` : styles.TextButton}
      data-testid="TextButton"
      type="button"
      {...attributes}
    >
      {children}
    </button>
  </div>
);
