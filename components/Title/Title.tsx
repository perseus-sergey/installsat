interface Props extends React.HTMLAttributes<HTMLElement> {
  name: string;
}

export const Title = ({ name, className, ...attributes }: Props) => (
  <h1 className={className ? `section-title ${className}` : 'section-title'} {...attributes}>
    {name}
  </h1>
);
