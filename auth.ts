import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        return credentials.name && typeof credentials.name === 'string'
          ? {
              name: credentials.name,
              email:
                credentials.email && typeof credentials.email === 'string'
                  ? credentials.email
                  : '',
              role: credentials.role,
            }
          : null;
      },
    }),
  ],
});

// export const { auth, signIn, signOut } = NextAuth({
//   ...authConfig,
//   providers: [
//     Credentials({
//       async authorize(credentials) {
//         const { email, password } = credentials;

//         if (typeof email === 'string' && typeof password === 'string') {
//           const user = (await getDbUser(email))[0];

//           if (user && (await bcryptjs.compare(password, user.password)))
//             return user;
//         }

//         return null;
//       },
//     }),
//   ],
// });
