import type { NextAuthConfig } from 'next-auth';
import { EUrlAdminParam, EUrlBaseParam } from './models/url.model';

export const authConfig = {
  pages: {
    signIn: `/${EUrlBaseParam.SIGN_IN}`,
  },
  providers: [],

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnGuruRoute = nextUrl.pathname.startsWith(
        EUrlAdminParam.BASE_PATH
      );
      if (isOnGuruRoute) {
        return isLoggedIn ? true : false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL(EUrlAdminParam.BASE_PATH, nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
