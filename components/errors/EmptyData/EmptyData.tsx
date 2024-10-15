import { ELanguage } from '@/models/language.model';
import Image from 'next/image';
import emptyPageImg from 'public/Images/empty_page.png';

interface IEmptyDataProps {
  lang: ELanguage;
  description?: string;
}

const ERROR_EMPTY_DATA = {
  [ELanguage.UA]: 'На жаль, запит повернув порожній результат',
  [ELanguage.EN]: 'Unfortunately, the query returned an empty result',
};

const EmptyData = ({ description, lang }: IEmptyDataProps) => (
  <section
    className="p-5 font-bold text-center text-purple-600 flex flex-col items-center gap-12"
    data-testid="EmptyData"
  >
    <Image
      src={emptyPageImg}
      alt={
        lang === ELanguage.UA
          ? 'Зображення космосу для позначення порожнього результату'
          : 'Image of space for marking an empty result'
      }
    />
    <p>{description || ERROR_EMPTY_DATA[lang]}</p>
  </section>
);

export default EmptyData;
