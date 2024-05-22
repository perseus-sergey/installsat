import FillingImg from '@/components/ui/Images/FillingImage';

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: number;
  registration_date: Date;
  update_date: Date;
}

export enum ELoginFormNames {
  NAME = 'login-name',
  EMAIL = 'login-email',
  PASSWORD = 'login-password',
}

export const AUTH_PROVIDER_LOGOS: Record<string, React.ReactNode> = {
  github: (
    <FillingImg
      width={16}
      height={16}
      src="/Images/auth/github.png"
      isFillParent
    />
  ),
};
