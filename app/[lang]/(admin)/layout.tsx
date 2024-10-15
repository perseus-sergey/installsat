import { redirect } from 'next/navigation';
import { EUrlBaseParam } from '@/models/url/url.model';
import SideBar from '@/components/SideBar/SideBar';
import { isAdminAuth } from '@/libs/utils/loggedUser';
import { ELanguage } from '@/models/language.model';
import SideBarServer from '@/components/SideBar/SideBarServer';
import ToastProvider from '@/libs/ToastProvider/ToastProvider';

export interface IParams {
  children: React.ReactNode;
}

export default async function layout({ children }: IParams) {
  if (!(await isAdminAuth())) return redirect(EUrlBaseParam.BASE_PATH);

  return (
    <main className="mx-auto bg-blue-950 flex justify-between items-start min-h-screen sm:w-[95%]">
      <SideBar lang={ELanguage.EN}>
        <SideBarServer lang={ELanguage.EN} isAdmin />
      </SideBar>
      <section className="flex flex-col flex-[3] overflow-x-hidden">
        <article className="article">
          <ToastProvider>{children}</ToastProvider>
        </article>
      </section>
    </main>
  );
}
