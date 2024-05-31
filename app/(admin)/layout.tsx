import { redirect } from 'next/navigation';
import './styles.scss';
import { EUrlBaseParam } from '@/models/url.model';
import SideBar from '@/components/SideBar/SideBar';
import { isAdminAuth } from '@/controllers/login.controller';

export interface IParams {
  children: React.ReactNode;
}

export default async function layout({ children }: IParams) {
  if (!(await isAdminAuth())) return redirect(EUrlBaseParam.BASE_PATH);

  return (
    <main className="main">
      <SideBar isAdmin />
      <section className="articleWrapper">
        <article className="article">{children}</article>
      </section>
    </main>
  );
}
