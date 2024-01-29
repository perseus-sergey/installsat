import React from 'react';
import styles from './Danger.module.scss';

interface IDangerProps {
  text: string;
}

const Danger = ({ text }: IDangerProps) => (
  <ul dangerouslySetInnerHTML={{ __html: text }} className={styles.Danger}></ul>
);

export default Danger;
