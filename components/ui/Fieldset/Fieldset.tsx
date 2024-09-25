interface IFieldsetProps
  extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  children: React.ReactNode;
  legendText: string;
}

const Fieldset = ({
  children,
  legendText,
  className,
  ...attributes
}: IFieldsetProps) => (
  <fieldset
    style={{ border: 'var(--groove-border)' }}
    className={`rounded-md${className ? ` ${className}` : ''}`}
    data-testid="Fieldset"
    {...attributes}
  >
    <legend className={'px-2 ml-4 text-stone-600'}>{legendText}</legend>

    {children}
  </fieldset>
);

export default Fieldset;
