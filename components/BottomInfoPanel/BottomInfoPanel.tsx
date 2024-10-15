import { ELanguage } from '@/models/language.model';
import { ReactNode } from 'react';

export interface IBottomInfoPanelItem {
  name: string;
  value: ReactNode | null;
}

interface IBottomInfoPanel {
  items: IBottomInfoPanelItem[];
}

export const INFO_PANEL_TITLES = {
  package: { [ELanguage.UA]: 'Пакет', [ELanguage.EN]: 'Package' },
  theme: { [ELanguage.UA]: 'Тема', [ELanguage.EN]: 'Theme' },
  views: { [ELanguage.UA]: 'Переглядів', [ELanguage.EN]: 'Views' },
  date: { [ELanguage.UA]: 'Дата', [ELanguage.EN]: 'Date' },
  comments: { [ELanguage.UA]: 'Коментарів', [ELanguage.EN]: 'Comments' },
};

const BottomInfoPanel = ({ items }: IBottomInfoPanel) => {
  const filteredItems = items.filter((item) => item.value);
  const lastId = filteredItems.length - 1;

  return (
    <ul
      style={{
        background:
          'linear-gradient(to bottom,rgb(30, 87, 153) 20%,rgb(2, 118, 214) 50%,rgb(30, 87, 153) 80%)',
      }}
      className="text-stone-300 font-verdana text-xs py-1 px-4 flex gap-2"
      data-testid="BottomInfoPanel"
    >
      {filteredItems.map(({ name, value }, i) => (
        <li key={name}>
          <figure
            className={`text-center${i !== lastId ? ` border-r border-solid border-stone-300 pr-2` : ''}`}
            key={name}
          >
            <span>{name}: </span>
            <figcaption className="inline-block text-white">
              {typeof value === 'number'
                ? value.toLocaleString('en-US')
                : value}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
};

export default BottomInfoPanel;
