import { NextRequest, NextResponse } from 'next/server';
import {
    
    ROUTES,
    ACCESS_TOKEN,
    REFRESH_TOKEN,
    API,
} from '@/assets/config';
import { AuthType } from '@/assets/interface/AuthType.type';



export const config = {
    matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
    //  matcher: ['/((?!api|_next|.*\\..*).*)']
    // matcher: ['/'],
};
const publicRoutes = ["/", "/login", "/signup"];

export function middleware(req: NextRequest) {
    if (req.nextUrl.pathname.indexOf('icon') > -1 || req.nextUrl.pathname.indexOf('chrome') > -1) {
        return NextResponse.next();
    }

    // try {
    //     let auth: AuthType = JSON.parse(req.cookies.get(ACCESS_TOKEN)?.value || '');

    //     if (auth && auth.type !== 'student') {
    //         req.cookies.clear();
    //     }
    // } catch (error) {
    //     console.log('Error parsing JSON:', error);
    // }
    const path = req.nextUrl.pathname;

   
   
    // if(!req.nextUrl.pathname.startsWith(ROUTES.auth.sign_in)) // && !req.url.includes(ROUTES.auth.sign_in)
    // {
     

        // if (
        //   !req.cookies.has(REFRESH_TOKEN) &&!req.cookies.has(ACCESS_TOKEN) 
        //   && (!req.url.includes(ROUTES.auth.sign_in)&&path!=='login')
        //  )
        //  {
        //     console.log(123);
        //     console.log("raw token",!! req.cookies.get(REFRESH_TOKEN));

        //     return NextResponse.redirect(new URL(`${ROUTES.auth.sign_in}`, req.url));
          
        // }
   
        if (

            !req.nextUrl.pathname.startsWith('/_next') &&(req.cookies.has(REFRESH_TOKEN) &&req.cookies.has(ACCESS_TOKEN) )&&!req.nextUrl.pathname.startsWith('/home')
        ) {
    
        
        if (req.url.includes(ROUTES.auth.sign_in)&&path==='login') {
            console.log(777,req.cookies.has(ACCESS_TOKEN));
            return NextResponse.redirect(new URL(`${ROUTES.home.index}`, req.url));
        }

         return NextResponse.redirect(new URL(`${ROUTES.home.index}`, req.url));
    }


    
    // if ( !req.nextUrl.pathname.startsWith('/_next')  ) {

    //     // let response = NextResponse.redirect(new URL(`/${ROUTES.auth.sign_in}${req.nextUrl.pathname}`, req.url));
    //     let response = NextResponse.redirect(new URL(`/${ROUTES.auth.sign_in}`, req.url));

    //     if (req.cookies.has(REFRESH_TOKEN)|| req.cookies.get(ACCESS_TOKEN)) {
    //         console.log(234);

    //         response = NextResponse.redirect(new URL(`/${ROUTES.home.index}${req.nextUrl.pathname}`, req.url));

    //     }

    //     return response;
    // }

    if (req.headers.has('referer')) {
        const refererUrl = new URL(req.headers.get('referer')!);
        const response = NextResponse.next();

      
        return response;
    }

    // return NextResponse.next();
}
/////////////////////////////////----------


// export function middleware(request: NextRequest) {
//     // Kiểm tra xem có token đăng nhập không
// console.log(request.cookies.has(ACCESS_TOKENN))
// const { pathname } = request.nextUrl

//     if (request.cookies.has(ACCESS_TOKEN)) {
//     //  const targetUrl = new URL("/home", request.nextUrl.origin);
//       console.log(2234);
//     //    return NextResponse.rewrite(targetUrl);
//        return NextResponse.redirect(new URL(ROUTES.home.index,request.url));
//     } 
//     else   if(!request.cookies.has(ACCESS_TOKEN)) {
//       const targetUrl = new URL(ROUTES.auth.sign_in, request.nextUrl.origin);
//       // console.log("path name",request.url) path name http://localhost:3000/sign-in
//      // let response = NextResponse.redirect(new URL(`/${ROUTES.auth.sign_in}`, request.url));
//       console.log(123);
//         return NextResponse.redirect(targetUrl);
//       // request.nextUrl.pathname="/home"
//       // return NextResponse.redirect(request.nextUrl);
//       // return NextResponse.rewrite(targetUrl);


//     }
//     if(request.nextUrl.pathname.startsWith(ROUTES.home.index))
//     {
//       console.log("path name",request.nextUrl.pathname.startsWith(ROUTES.home.index))

//     }

//         if (request.headers.has('referer')) {
//         const refererUrl = new URL(request.headers.get('referer')!);
//         const response = NextResponse.next();

      
//         return response;
//     }


//   //   const requestHeaders = new Headers(request.headers)
//   // requestHeaders.set('x-hello-from-middleware1', 'hello')
 
//   // // You can also set request headers in NextResponse.rewrite
//   // const response = NextResponse.next({
//   //   request: {
//   //     // New request headers
//   //     headers: requestHeaders,
//   //   },
//   // })
 
//   // // Set a new response header `x-hello-from-middleware2`
//   // response.headers.set('x-hello-from-middleware2', 'hello')
// }

// export const config = {
//     // matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
//    matcher: ["/"],

// };

