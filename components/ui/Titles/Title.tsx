import styles from './Title.module.scss';

interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Title = ({ children, className, ...attributes }: Props) => (
  <h1
    className={`${styles.sectionTitle}${className ? ` ${className}` : ''}`}
    {...attributes}
  >
    {children}
  </h1>
);
