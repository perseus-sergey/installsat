import styles from './Fieldset.module.scss';

interface IFieldsetProps {
  children: React.ReactNode;
  legendText: string;
}

const Fieldset = ({ children, legendText }: IFieldsetProps) => (
  <fieldset className={styles.fieldset} data-testid="Fieldset">
    <legend className={styles.legend}>{legendText}</legend>

    {children}
  </fieldset>
);

export default Fieldset;
