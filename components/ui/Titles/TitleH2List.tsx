interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const TitleH2List = ({ children, className, ...attributes }: Props) => (
  <h2
    className={`flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 sm:text-3xl text-2xl text-indigo-700 text-center py-2 font-verdana font-semibold${className ? ` ${className}` : ''}`}
    {...attributes}
  >
    {children}
  </h2>
);
