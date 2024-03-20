import BreadCrumbs from '@/components/BreadCrumbs/BreadCrumbs';

interface IProps {
  children: React.ReactNode;
}

export default function Template({ children }: IProps) {
  return (
    <>
      <BreadCrumbs />
      {children}
    </>
  );
}
