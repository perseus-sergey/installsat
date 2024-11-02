import { ELanguage } from '@/models/language.model';

interface ISimilarArticlesProps {
  blockTitle: string;
  children: React.ReactNode;
  lang: ELanguage;
}

const SimilarBlock = async ({
  blockTitle,
  children,
  lang,
}: ISimilarArticlesProps) => {
  return (
    <nav
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="my-1 mx-auto w-full rounded-lg"
      style={{
        border: 'thick inset #cccccc',
        background:
          'linear-gradient(to bottom, #fceabb 0%, #fccd4d 35%, #f8b500 36%, #fbdf93 100%)',
      }}
    >
      <h2
        className="text-3xl font-bold font-verdana py-2 text-indigo-900 text-center"
        style={{ textShadow: '1px 1px 0px white' }}
      >
        {blockTitle}
      </h2>
      <ul
        className="py-4 px-12 font-georgia text-xl"
        style={{ listStyleImage: 'url(/Images/galka_blue.png)' }}
      >
        {children}
      </ul>
    </nav>
  );
};

export default SimilarBlock;
