import Image from 'next/image';
import Link from 'next/link';

import { ELanguage } from '@/models/language.model';
import { PARTNERS_MODEL } from '@/models/ui/sideBar.model';

import onePlusTwoLogoImg from 'public/Images/1plus2-logo_w180.png';

const { caption, onePlusTwoAriaL, onePlusTwoLinkImgAlt, onePlusTwoHref } =
  PARTNERS_MODEL;

const SitePartners = ({ lang }: { lang: ELanguage }) => {
  const onePlusTwoAriaLabel = onePlusTwoAriaL[lang];

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <h3 className="text-slate-100 font-bold text-xl border-b border-b-slate-50">
        {caption[lang]}
      </h3>

      <Link
        href={onePlusTwoHref}
        target="_blank"
        rel="noopener noreferrer"
        title={onePlusTwoAriaLabel}
        aria-label={onePlusTwoAriaLabel}
        className="py-2"
      >
        <Image src={onePlusTwoLogoImg} alt={onePlusTwoLinkImgAlt[lang]} />
      </Link>
    </div>
  );
};

export default SitePartners;
