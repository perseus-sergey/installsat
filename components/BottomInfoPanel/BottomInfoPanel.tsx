import { ReactNode } from 'react';
import { ELanguage } from '@/models/language.model';
import { localeStringMaker } from '@/libs/utils/localeStringMaker';

export interface IBottomInfoPanelItem {
  name: string;
  value: ReactNode | null;
}

interface IBottomInfoPanel {
  items: IBottomInfoPanelItem[];
  lang: ELanguage;
}

const BottomInfoPanel = ({ items, lang }: IBottomInfoPanel) => {
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
            className={`text-center ${i !== lastId ? ` ${lang === ELanguage.AR ? 'border-l pl-2' : 'border-r pr-2'} border-solid border-stone-300` : ''}`}
            key={name}
          >
            <span>{name}: </span>
            <figcaption className="inline-block text-white">
              {typeof value === 'number' ? localeStringMaker(value) : value}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
};

export default BottomInfoPanel;
