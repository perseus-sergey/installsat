import styles from './TemplateName.module.scss';

interface ITemplateNameProps {
  children?: React.ReactNode;
}

const TemplateName = ({ children }: ITemplateNameProps) => (
  <div className={styles.TemplateName} data-testid="TemplateName">
    <h1>{children}</h1>
  </div>
);

export default TemplateName;
