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
  const separatorsCount = items.length - 2;

  return (
    <section className={styles.BottomInfoPanel} data-testid="BottomInfoPanel">
      {items.map(
        ({ name, value }, i) =>
          value && (
            <>
              <figure className={styles.infoPanelItem} key={name}>
                <span className={styles.itemName}>{name}: </span>
                <figcaption className={styles.itemValue}>{value}</figcaption>
              </figure>
              {i < separatorsCount && <span>|</span>}
            </>
          )
      )}
    </section>
  );
};

export default BottomInfoPanel;
