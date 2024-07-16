interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const TitleH2Digest = ({
  children,
  className,
  ...attributes
}: Props) => (
  <h2
    className={`h2-shadow flex sm:gap-4 gap-2 items-center border-b-2 border-gray-500 text-sky-700 font-bold underline text-2xl sm:text-3xl my-4 ${className ? ` ${className}` : ''}`}
    {...attributes}
  >
    {children}
  </h2>
);
