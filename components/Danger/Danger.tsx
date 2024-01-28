import React from 'react';
import styles from './Danger.module.scss';

interface IDangerProps {
  text: string;
}

const Danger = ({ text }: IDangerProps) => (
  <div
    dangerouslySetInnerHTML={{ __html: text }}
    className={styles.Danger}
  ></div>
);

export default Danger;
