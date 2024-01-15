import styles from './Title.module.scss';

interface Props extends React.HTMLAttributes<HTMLElement> {
  name: string;
}

export const Title = ({ name, className, ...attributes }: Props) => (
  <h1 className={`${styles.sectionTitle}${classNam ? ` ${className}` : ''}`} {...attributes}>
    {name}
  </h1>
);
