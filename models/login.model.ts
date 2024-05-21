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
