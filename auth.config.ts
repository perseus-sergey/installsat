import type { NextAuthConfig } from 'next-auth';
import { EUrlAdminParam, EUrlBaseParam } from './models/url.model';

// export const authConfig = {
//   pages: {
//     signIn: `/${EUrlBaseParam.SIGN_IN}`,
//   },
//   providers: [],

//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       console.log('🚀 ~ authorized ~ auth:', auth);
//       const isLoggedIn = !!auth?.user;
//       const isOnGuruRoute = nextUrl.pathname.startsWith(
//         EUrlAdminParam.BASE_PATH
//       );
//       if (isOnGuruRoute) {
//         return isLoggedIn ? true : false;
//       } else if (isLoggedIn) {
//         return Response.redirect(new URL(EUrlAdminParam.BASE_PATH, nextUrl));
//       }
//       return true;
//     },
//   },
// } satisfies NextAuthConfig;

const loginPagePath = `/${EUrlBaseParam.SIGN_IN}`;

export const authConfig = {
  pages: {
    signIn: loginPagePath,
  },
  providers: [],

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log('🚀 ~ authorized ~ auth:', auth);
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute = nextUrl.pathname.startsWith(
        EUrlAdminParam.BASE_PATH
      );
      const isOnLoginRoute = nextUrl.pathname.startsWith(loginPagePath);

      if (isOnProtectedRoute) {
        console.log(
          '🚀 ~ authorized ~ isOnProtectedRoute:',
          isOnProtectedRoute
        );
        return isLoggedIn ? true : false;
      } else if (isOnLoginRoute) {
        console.log('🚀 ~ authorized ~ isOnLoginRoute:', isOnLoginRoute);
        return isLoggedIn ? false : true;
      } else if (isLoggedIn) {
        console.log('🚀 ~ authorized ~ isLoggedIn:', isLoggedIn);
        return Response.redirect(new URL(EUrlAdminParam.BASE_PATH, nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
