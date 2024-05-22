import { redirect } from 'next/navigation';
import './styles.scss';
import { EUrlBaseParam } from '@/models/url.model';
import { auth } from '@/auth';

const adminEmail = process.env.ADMIN_EMAIL || '';

export interface IParams {
  children: React.ReactNode;
}

export default async function layout({ children }: IParams) {
  const session = await auth();

  if (!session || !session.user || session.user.email !== adminEmail)
    return redirect(EUrlBaseParam.BASE_PATH);

  return <article className="article">{children}</article>;
}
