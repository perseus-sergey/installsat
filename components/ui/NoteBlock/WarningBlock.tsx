interface IWarningBlockProps {
  children?: React.ReactNode;
  warningTitle: string;
}

const WarningBlock = ({ children, warningTitle }: IWarningBlockProps) => (
  <section className="flex my-4 mx-auto bg-red-400:50 border border-gray-300 border-l-8 border-l-red-600 rounded-md shadow p-4 items-start gap-4">
    <span className="text-3xl">⚠</span>
    <p>
      <strong>{warningTitle}: </strong>
      {children}
    </p>
  </section>
);

export default WarningBlock;
