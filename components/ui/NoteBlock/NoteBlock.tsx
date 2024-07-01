interface INoteBlockProps {
  children?: React.ReactNode;
  noteTitle: string;
}

const NoteBlock = ({ children, noteTitle }: INoteBlockProps) => (
  <section
    className="flex my-4 mx-auto bg-white bg-opacity-45 border border-gray-300 border-l-8 border-l-sky-600 rounded-md shadow p-4 items-start gap-4"
    data-testid="NoteBlock"
  >
    <span className="text-3xl">📌</span>
    <p>
      <strong>{noteTitle}: </strong>
      {children}
    </p>
  </section>
);

export default NoteBlock;
