import Filter from '@/components/ui/Filter/Filter';
import { ARTICLES } from '@/models/articles.model';
import { LANGUAGE } from '@/models/ui.model';
import { EUrlSearchParam } from '@/models/url.model';

const {
  search: { placeholder, labelTitle },
} = ARTICLES;

interface IProps {
  children: React.ReactNode;
}

export default function Template({ children }: IProps) {
  return (
    <>
      <Filter
        idName="article-search-input"
        placeholder={placeholder[LANGUAGE]}
        labelTitle={labelTitle[LANGUAGE]}
        searchQueryTitle={EUrlSearchParam.ARTICLE}
      />
      {children}
    </>
  );
}
