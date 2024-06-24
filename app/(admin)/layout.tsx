import { redirect } from 'next/navigation';
import './styles.scss';
import { EUrlBaseParam } from '@/models/url.model';
import SideBar from '@/components/SideBar/SideBar';
import { isAdminAuth } from '@/controllers/login.controller';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import { ELanguage } from '@/models/ui.model';

export interface IParams {
  children: React.ReactNode;
}

export default async function layout({ children }: IParams) {
  if (!(await isAdminAuth())) return redirect(EUrlBaseParam.BASE_PATH);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <input type="checkbox" id="toggle-sidebar" hidden />
        <Header />
        <main className="main">
          <SideBar lang={ELanguage.EN} isAdmin />
          <section className="articleWrapper">
            <article className="article">{children}</article>
          </section>
        </main>
        <Footer />
      </body>
    </html>
  );
}
