import styles from './TemplateName.module.css';

interface ITemplateNameProps {
  title?: string;
}

const TemplateName = ({ title }: ITemplateNameProps) => (
  <div className={styles.TemplateName} data-testid="TemplateName">
    <h1>{title}</h1>
  </div>
);

export default TemplateName;
