import styles from './Fieldset.module.scss';

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
    className={`${styles.fieldset} rounded-md${className ? ` ${className}` : ''}`}
    data-testid="Fieldset"
    {...attributes}
  >
    <legend className={'px-2 ml-4 text-stone-500'}>{legendText}</legend>

    {children}
  </fieldset>
);

export default Fieldset;
