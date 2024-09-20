import { redirect } from 'next/navigation';
import './styles.scss';
import { EUrlBaseParam } from '@/models/url.model';
import SideBar from '@/components/SideBar/SideBar';
import { isAdminAuth } from '@/controllers/login.controller';
import { ELanguage } from '@/models/ui.model';

export interface IParams {
  children: React.ReactNode;
}

export default async function layout({ children }: IParams) {
  if (!(await isAdminAuth())) return redirect(EUrlBaseParam.BASE_PATH);

  return (
    <main className="mx-auto bg-blue-950 flex justify-between items-start min-h-screen sm:w-[95%]">
      <SideBar lang={ELanguage.EN} isAdmin />
      <section className="flex flex-col flex-[3] overflow-x-hidden">
        <article className="article">{children}</article>
      </section>
    </main>
  );
}
