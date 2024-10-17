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
const groupProtectedRoutes = ['/topic/invite','/topic/register','topic/team/job/']; 



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


  if (accessToken) {
    const userHasGroup = await checkUserGroupServer(accessToken);
    const isGroupProtectedRoute = groupProtectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))
    if (!userHasGroup  ) {
      if(groupProtectedRoutes.includes(req.nextUrl.pathname))
      {

      return NextResponse.redirect(new URL(`${ROUTES.home.index}`, req.url));
    }
    if(req.nextUrl.pathname==="/topic/team/job/detail" )
      {
        return NextResponse.redirect(new URL(`${ROUTES.home.index}`, req.url));
  
      }
    }
  
  }


  async function checkUserGroupServer(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${req.nextUrl.origin}/api/check-user-group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get error details from the response
        throw new Error(`Failed to fetch user group: ${errorData.error || 'Unknown error'}`);
      }
      const data = await response.json();
     
      return data.hasGroup;
    } catch (error) {
      console.error('Error calling Next.js API route:', error);
      return false;
    }
  }

  // if (!accessToken && refreshToken && cookies.isTokenExpired(accessToken)) {
  //   try {
  //     // Call the refresh token API route on Next.js server
  //     const refreshResponse = await fetch(`${req.nextUrl.origin}/api/refresh-token`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ token: refreshToken }),
  //       credentials: 'include', // Send cookies for token refresh
  //     });

  //     if (refreshResponse.ok) {
  //       const data = await refreshResponse.json();
  //       if (data.success && data.result?.accessToken) {
  //         // Successfully refreshed, set new access token in response cookies
  //         const response = NextResponse.next();
  //         response.cookies.set(ACCESS_TOKEN, data.result.accessToken);
  //         return response; // Proceed with the request using the refreshed token
  //       } else {
  //         // If refresh fails, delete both tokens and redirect to login
  //         const response = NextResponse.redirect(new URL(`${ROUTES.auth.sign_in}`, req.url));
  //         response.cookies.delete(ACCESS_TOKEN);
  //         response.cookies.delete(REFRESH_TOKEN);
  //         return response;
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error refreshing token in middleware:', error);
  //   }
  // }

  // // Case 4: If the user is trying to access a group-protected route, check group membership
  // if (accessToken) {
  //   const userHasGroup = await checkUserGroupServer(accessToken);
  //   const isGroupProtectedRoute = groupProtectedRoutes.some(route => req.nextUrl.pathname.startsWith(route));
    
  //   if (!userHasGroup && isGroupProtectedRoute) {
  //     return NextResponse.redirect(new URL(`${ROUTES.home.index}`, req.url));
  //   }
  // }


    
  // Các trường hợp khác, tiếp tục request
  return NextResponse.next();
}

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