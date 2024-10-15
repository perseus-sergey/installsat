import { ELanguage } from '@/models/language.model';
import Image from 'next/image';
import Link from 'next/link';

import onePlusTwoLogoImg from 'public/Images/1plus2-logo_w180.png';

const SitePartners = ({ lang }: { lang: ELanguage }) => {
  const onePlusTwoAriaLabel =
    lang === ELanguage.UA
      ? `Перейти на сайт "1plus2" - навчання в розважальній формі`
      : `Go to the "1plus2" website - learning in an entertaining way`;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h3 className="text-slate-100 font-bold text-xl border-b border-b-slate-50">
        {lang === ELanguage.UA ? 'Наші Партнери' : 'Our Partners'}
      </h3>

      <Link
        href="https://www.1plus2.fun/en"
        target="_blank"
        rel="noopener noreferrer"
        title={onePlusTwoAriaLabel}
        aria-label={onePlusTwoAriaLabel}
        className="py-2"
      >
        <Image
          src={onePlusTwoLogoImg}
          alt={
            lang === ELanguage.UA
              ? `Логотип сайту "1plus2".fun з грайливими числами та навчальними символами.`
              : `Logo of "1plus2".fun website with playful numbers and educational symbols.`
          }
        />
      </Link>
    </div>
  );
};

export default SitePartners;
