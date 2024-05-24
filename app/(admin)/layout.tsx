import { redirect } from 'next/navigation';
import './styles.scss';
import { EUrlBaseParam } from '@/models/url.model';
import { auth } from '@/auth';
import SideBar from '@/components/SideBar/SideBar';

const adminEmail = process.env.ADMIN_EMAIL || '';

export interface IParams {
  children: React.ReactNode;
}

export default async function layout({ children }: IParams) {
  const session = await auth();

  if (!session || !session.user || session.user.email !== adminEmail)
    return redirect(EUrlBaseParam.BASE_PATH);

  return (
    <main className="main">
      <SideBar isAdmin />
      <section className="articleWrapper">
        <article className="article">{children}</article>)
      </section>
    </main>
  );
}
