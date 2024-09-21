import styles from './Title.module.scss';

interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Title = ({ children, className, ...attributes }: Props) => (
  <h1
    className={`${styles.sectionTitle} flex flex-wrap sm:flex-nowrap items-center justify-around gap-4 text-indigo-800 font-bold font-georgia p-2 sm:p-6 text-center text-2xl sm:text-3xl${className ? ` ${className}` : ''}`}
    {...attributes}
  >
    {children}
  </h1>
);
