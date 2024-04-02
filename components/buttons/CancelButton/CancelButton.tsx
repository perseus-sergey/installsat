import styles from './CancelButton.module.scss';

interface ICancelButtonProps {
  children?: React.ReactNode;
}

const CancelButton = ({ children }: ICancelButtonProps) => (
  <div className={styles.CancelButton} data-testid="CancelButton">
    <h1>{children}</h1>
  </div>
);

export default CancelButton;
