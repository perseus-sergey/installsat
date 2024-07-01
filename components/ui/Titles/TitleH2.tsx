import styles from './Title.module.scss';

interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const TitleH2 = ({ children, className, ...attributes }: Props) => (
  <h2
    className={`${styles.h2Title}${className ? ` ${className}` : ''}`}
    {...attributes}
  >
    {children}
  </h2>
);
