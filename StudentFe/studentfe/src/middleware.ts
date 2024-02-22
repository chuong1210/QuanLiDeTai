import { NextRequest, NextResponse } from 'next/server';
import {
    
    AUTH_RAW_TOKEN,
    ROUTES,
    AUTH_TOKEN,
} from '@/assets/config';
import { AuthType } from '@/assets/interface/AuthType.type';



// export const config = {
//     // matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
//      matcher: ['/'],
// };

// export function middleware(req: NextRequest) {
//     if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1) {
//         return NextResponse.next();
//     }

//     try {
//         let auth: AuthType = JSON.parse(req.cookies.get(AUTH_TOKEN)?.value || '');

//         if (auth && auth.type !== 'student') {
//             req.cookies.clear();
//         }
//     } catch (error) {
//         console.log('Error parsing JSON:', error);
//     }

   
//     if(!req.nextUrl.pathname.startsWith(ROUTES.auth.sign_in))
//     {
     

//         if (req.cookies.has(AUTH_RAW_TOKEN) ||req.cookies.has(AUTH_TOKEN)) {
//             console.log(777,req.cookies.has(AUTH_TOKEN));
//             return NextResponse.redirect(new URL(`${ROUTES.home.index}`, req.url));
//         } else {
//             console.log(123);
//             console.log("token", req.cookies.get(AUTH_TOKEN));
//             console.log(" roken",!! req.cookies.get(AUTH_TOKEN));

//             console.log("raw token",!! req.cookies.get(AUTH_RAW_TOKEN));

//             return NextResponse.redirect(new URL(`${ROUTES.auth.sign_in}`, req.url));
//         }
//     }
//     if ( !req.nextUrl.pathname.startsWith('/_next')  ) {

//         // let response = NextResponse.redirect(new URL(`/${ROUTES.auth.sign_in}${req.nextUrl.pathname}`, req.url));
//         let response = NextResponse.redirect(new URL(`/${ROUTES.auth.sign_in}`, req.url));

//         if (req.cookies.has(AUTH_RAW_TOKEN)|| req.cookies.get(AUTH_TOKEN)) {
//             console.log(234);

//             response = NextResponse.redirect(new URL(`/${ROUTES.home.index}${req.nextUrl.pathname}`, req.url));

//         }

//         return response;
//     }

//     if (req.headers.has('referer')) {
//         const refererUrl = new URL(req.headers.get('referer')!);
//         const response = NextResponse.next();

      
//         return response;
//     }

//     // return NextResponse.next();
// }
/////////////////////////////////----------


export function middleware(request: NextRequest) {
  // Kiểm tra xem người dùng đã đăng nhập hay chưa
    // Kiểm tra xem có token đăng nhập không
    if (request.cookies.has(AUTH_TOKEN)) {
      // Nếu có token đăng nhập, chuyển hướng đến /home
      const targetUrl = new URL("/home", request.nextUrl.origin);
      console.log(2234);
    //    return NextResponse.rewrite(targetUrl);
       return NextResponse.redirect(new URL(ROUTES.home.index,request.url));
    } else if(!request.cookies.has(AUTH_TOKEN)) {
      // Nếu chưa đăng nhập, chuyển hướng đến /auth/signin
      const targetUrl = new URL(ROUTES.auth.sign_in, request.nextUrl.origin);
      console.log(123);
    //  return NextResponse.rewrite(targetUrl);
      return NextResponse.redirect(new URL(ROUTES.auth.sign_in,request.url));

    }
}

export const config = {
  matcher: "/",
};

