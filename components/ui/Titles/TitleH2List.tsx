import React from 'react';
import styles from './Title.module.scss';

interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const TitleH2List = ({ children, className, ...attributes }: Props) => (
  <h2
    className={`${styles.h2TitleList}${className ? ` ${className}` : ''}`}
    {...attributes}
  >
    {children}
  </h2>
);
