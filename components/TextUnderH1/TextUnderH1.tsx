import styles from './TextUnderH1.module.scss';

interface ITextUnderH1Props {
  children?: React.ReactNode;
}

const TextUnderH1 = ({ children }: ITextUnderH1Props) => (
  <>
    <section className={styles.TextUnderH1} data-testid="TextUnderH1">
      {children}
    </section>
  </>
);

export default TextUnderH1;
