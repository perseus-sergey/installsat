import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import bcryptjs from 'bcryptjs';
import { getDbUser } from './controllers/login.controller';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;

        if (typeof email === 'string' && typeof password === 'string') {
          const user = (await getDbUser(email))[0];

          if (user && (await bcryptjs.compare(password, user.password)))
            return user;
        }

        return null;
      },
    }),
  ],
});
