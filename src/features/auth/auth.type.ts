export type RegisterType = {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
};
