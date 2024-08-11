import { NextRequest, NextResponse } from 'next/server';
import {
  ROUTES,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  API,
} from '@/assets/config';
import { cookies } from './assets/helpers';


export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
};

const publicRoutes = ["/", "/login", "/signup"];
const privateRoutes = ["/", "/home", "/team"];



export async function middleware(req: NextRequest) {
  const accessToken = req.cookies.get(ACCESS_TOKEN)?.value;
  const refreshToken = req.cookies.get(REFRESH_TOKEN)?.value;
  const isLoginPage = req.nextUrl.pathname.startsWith('/login');

  // Trường hợp chưa đăng nhập và không phải trang login
  if (!accessToken &&!isLoginPage) {
    return NextResponse.redirect(new URL(`${ROUTES.auth.sign_in}`, req.url));
  }

  // Trường hợp đã đăng nhập và truy cập trang login
  if (accessToken  && isLoginPage) {
    return NextResponse.redirect(new URL(`${ROUTES.home.index}`, req.url));
  }
  if (!accessToken &&refreshToken&& cookies.isTokenExpired(accessToken))
  {  
     const response = NextResponse.redirect(new URL(`${ROUTES.auth.sign_in}`, req.url));
          response.cookies.delete(ACCESS_TOKEN);
          response.cookies.delete(REFRESH_TOKEN);
          return response;

  }
    // // Kiểm tra access token hết hạn
    // if (accessToken && cookies.isTokenExpired(accessToken)) {
    //     try {
    //       // Thử refresh token
    //       const response = await fetch('/api/refresh-token', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ token: refreshToken }),
    //       });
    
    //       if (response.ok) {
    //         // Refresh token thành công, tiếp tục request
    //         return NextResponse.next();
    //       } else {
    //         // Refresh token không hợp lệ, đăng xuất
    //         throw new Error('Refresh token invalid');
    //       }
    //     } catch (error) {
    //       // Xóa cookie và chuyển hướng đến trang đăng nhập
    //       console.error('Error refreshing token:', error);
    //       const response = NextResponse.redirect(new URL(`${ROUTES.auth.sign_in}`, req.url));
    //       response.cookies.delete(ACCESS_TOKEN);
    //       response.cookies.delete(REFRESH_TOKEN);
    //       return response;
    //     }
    //   }
    
  // Các trường hợp khác, tiếp tục request
  return NextResponse.next();
}
// export function middleware(req: NextRequest) {
//     const hasAccessToken = req.cookies.has(ACCESS_TOKEN);
//     const hasRefreshToken = req.cookies.has(REFRESH_TOKEN);
  
//     if (!hasAccessToken && !hasRefreshToken && !req.nextUrl.pathname.startsWith('/login')) {
//       return NextResponse.redirect(new URL(`${ROUTES.auth.sign_in}`, req.url));
//     }
  
//     if (hasAccessToken && hasRefreshToken && req.nextUrl.pathname.startsWith('/login')) {
//       return NextResponse.redirect(new URL(`${ROUTES.home.index}`, req.url));
//     }
  
//     return NextResponse.next();
//   }

/////////////////////////////////----------


//     if (req.headers.has('referer')) {
//         const refererUrl = new URL(req.headers.get('referer')!);
//         const response = NextResponse.next();

      
//         return response;
//     }
// const isPublicRoute = publicRoutes.includes(path);
// const isPrivateRoute = privateRoutes.includes(path);

// if (!accessToken && !refreshToken) {
//     if (isPrivateRoute) {
//         return NextResponse.redirect(new URL(ROUTES.auth.sign_in, req.url));
//     }
// } else if (accessToken && isPublicRoute) {
//     // If logged in and accessing a public route, redirect to home
//     return NextResponse.redirect(new URL(ROUTES.home.index, req.url));
// }