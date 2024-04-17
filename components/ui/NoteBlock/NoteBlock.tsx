import styles from './NoteBlock.module.scss';

interface INoteBlockProps {
  children?: React.ReactNode;
  noteTitle: string;
}

const NoteBlock = ({ children, noteTitle }: INoteBlockProps) => (
  <section className={styles.NoteBlock} data-testid="NoteBlock">
    <span className={styles.sign}>📌</span>
    <p className={styles.text}>
      <strong>{noteTitle}: </strong>
      {children}
    </p>
  </section>
);

export default NoteBlock;
