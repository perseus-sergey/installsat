import { ReactNode } from 'react';
import styles from './BottomInfoPanel.module.scss';

export interface IBottomInfoPanelItem {
  name: string;
  value: ReactNode | null;
}

interface IBottomInfoPanel {
  items: IBottomInfoPanelItem[];
}

const BottomInfoPanel = ({ items }: IBottomInfoPanel) => {
  const filteredItems = items.filter((item) => item.value);
  const lastId = filteredItems.length - 1;

  return (
    <ul className={styles.BottomInfoPanel} data-testid="BottomInfoPanel">
      {filteredItems.map(({ name, value }, i) => (
        <li key={name}>
          <figure
            className={`${styles.infoPanelItem}${i !== lastId ? ` ${styles.bordered}` : ''}`}
            key={name}
          >
            <span className={styles.itemName}>{name}: </span>
            <figcaption className={styles.itemValue}>{value}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
};

export default BottomInfoPanel;
