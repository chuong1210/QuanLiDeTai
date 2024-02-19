import { NextRequest, NextResponse } from 'next/server';
import {
    
    AUTH_RAW_TOKEN,
    ROUTES,
    AUTH_TOKEN,
} from '@/assets/config';
import { AuthType } from '@/assets/interface/AuthType.type';



export const config = {
    // matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
     matcher: ['/'],
};

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1) {
        return NextResponse.next();
    }


  

    // console.log(req.cookies.get(AUTH_TOKEN)?.value);

    try {
      let auth: AuthType = JSON.parse(req.cookies.get(AUTH_TOKEN)?.value || '');
      
      console.log(auth);
      if (auth.type !== 'student') {
          req.cookies.clear();
      }
  } catch (error) {
      console.log('Error parsing JSON:', error);
  }
    if (!req.cookies.has(AUTH_RAW_TOKEN) && !req.url.includes(ROUTES.auth.sign_in)) {
      console.log(123);

        return NextResponse.redirect(new URL(`${ROUTES.auth.sign_in}`, req.url));
    }

    console.log(req.nextUrl);
    if ( !req.nextUrl.pathname.startsWith('/_next')  ) {
      console.log(234);

        // let response = NextResponse.redirect(new URL(`/${ROUTES.auth.sign_in}${req.nextUrl.pathname}`, req.url));
        let response = NextResponse.redirect(new URL(`/${ROUTES.auth.sign_in}`, req.url));

        if (req.cookies.has(AUTH_RAW_TOKEN)) {
        console.log(456);

            response = NextResponse.redirect(new URL(`/${ROUTES.home.index}${req.nextUrl.pathname}`, req.url));
        }

        return response;
    }

    if (req.headers.has('referer')) {
        const refererUrl = new URL(req.headers.get('referer')!);
        const response = NextResponse.next();

      
        return response;
    }

    // return NextResponse.next();
}
/////////////////////////////////----------
// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";
// import { AUTH_TOKEN, ROUTES } from "./assets/config";

// export function middleware(request: NextRequest) {
//   // Kiểm tra xem người dùng đã đăng nhập hay chưa
//     // Kiểm tra xem có token đăng nhập không
//     if (request.cookies.has(AUTH_TOKEN)) {
//       // Nếu có token đăng nhập, chuyển hướng đến /home
//       const targetUrl = new URL("/home", request.nextUrl.origin);
//       console.log(2234);
//       // return NextResponse.rewrite(targetUrl);
//       return NextResponse.redirect(new URL("/sign-in",request.url));
//     } else {
//       // Nếu chưa đăng nhập, chuyển hướng đến /auth/signin
//       const targetUrl = new URL(ROUTES.auth.sign_in, request.nextUrl.origin);
//       console.log(123);
//       // return NextResponse.rewrite(targetUrl);
//       return NextResponse.redirect(new URL("/home",request.url));

//     }
// }

// export const config = {
//   matcher: "/",
// };

