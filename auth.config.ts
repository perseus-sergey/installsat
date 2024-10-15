import type { NextAuthConfig } from 'next-auth';
import { EUrlBaseParam } from './models/url/url.model';
import { ELanguage } from './models/language.model';
import { EUrlAdminParam } from './models/url/urlAdmin.model';

export const authConfig = {
  pages: {
    signIn: `/${ELanguage.EN}/${EUrlBaseParam.SIGN_IN}`,
  },
  providers: [],

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute = new RegExp(
        `/${EUrlAdminParam.BASE_PATH}(/|$)`
      ).test(nextUrl.pathname);
      const isOnLoginRoute = new RegExp(`/${EUrlBaseParam.SIGN_IN}(/|$)`).test(
        nextUrl.pathname
      );

      if (isOnProtectedRoute) {
        return isLoggedIn ? true : false;
      } else if (isOnLoginRoute) {
        return isLoggedIn ? false : true;
      } else if (isLoggedIn) {
        // console.log('🚀 ~ authorized ~ isLoggedIn:', isLoggedIn);
        // return Response.redirect(
        //   new URL(`${ELanguage.EN}/${EUrlAdminParam.BASE_PATH}`, nextUrl)
        // );
      }
      return true;
    },
    // async redirect({ baseUrl }) {
    //   return baseUrl;
    // },
  },
} satisfies NextAuthConfig;
