interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const TitleH2 = ({ children, className, ...attributes }: Props) => (
  <h2
    className={`text-indigo-800 text-center text-xl sm:text-2xl py-3 font-verdana font-semibold${className ? ` ${className}` : ''}`}
    {...attributes}
  >
    {children}
  </h2>
);
