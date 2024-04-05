import BreadCrumbs from '@/components/BreadCrumbs/BreadCrumbs';
import Filter from '@/components/Filter/Filter';
import { EUrlSearchParam } from '@/models/url.model';

interface IProps {
  children: React.ReactNode;
}

export default function Template({ children }: IProps) {
  return (
    <>
      <BreadCrumbs />
      <Filter
        placeholder="Пошук статті..."
        labelTitle="Шукати статті по назві та опису"
        searchQueryTitle={EUrlSearchParam.ARTICLE}
      />
      {children}
    </>
  );
}
