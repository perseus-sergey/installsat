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
    className={className ? `${styles.fieldset} ${className}` : styles.fieldset}
    data-testid="Fieldset"
    {...attributes}
  >
    <legend className={styles.legend}>{legendText}</legend>

    {children}
  </fieldset>
);

export default Fieldset;
