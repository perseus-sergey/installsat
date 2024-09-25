interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const TitleH3Digest = ({
  children,
  className,
  ...attributes
}: Props) => (
  <h2
    style={{ textShadow: '0 1px 0 #ffffff, 1px 1px 2px #999999' }}
    className={`flex gap-2 sm:gap-4 sm:text-2xl text-xl text-blue-800 font-bold text-left border-b border-gray-700 border-groove p-0 pl-2 my-2 items-center 
     before:content-['🛰'] before:text-2xl sm:before:text-5xl font-verdana${className ? ` ${className}` : ''}`}
    {...attributes}
  >
    {children}
  </h2>
);
