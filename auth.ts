import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { Provider } from 'next-auth/providers';
import GitHub from 'next-auth/providers/github';

const providers: Provider[] = [
  GitHub({
    checks: ['none'],
    clientId: process.env.AUTH_GITHUB_ID || '',
    clientSecret: process.env.AUTH_GITHUB_SECRET || '',
  }),
  Credentials({
    async authorize(credentials) {
      return credentials.name && typeof credentials.name === 'string'
        ? {
            name: credentials.name,
            email:
              credentials.email && typeof credentials.email === 'string'
                ? credentials.email
                : '',
          }
        : null;
    },
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === 'function') {
    const providerData = provider();

    return { id: providerData.id, name: providerData.name };
  }

  return { id: provider.id, name: provider.name };
});

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers,
});
