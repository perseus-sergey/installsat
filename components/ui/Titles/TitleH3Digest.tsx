import styles from './Title.module.scss';

interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const TitleH3Digest = ({
  children,
  className,
  ...attributes
}: Props) => (
  <h2
    className={`${styles.groupSubTitle} flex gap-4 text-2xl text-blue-800 font-bold text-left border-b border-gray-700 border-groove p-0 pl-2 my-2 items-center custom-font custom-text-shadow before:text-5xl ${className ? ` ${className}` : ''}`}
    {...attributes}
  >
    {children}
  </h2>
);
