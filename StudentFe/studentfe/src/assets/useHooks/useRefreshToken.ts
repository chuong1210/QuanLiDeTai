
import { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../config';
import { cookies } from '../helpers';

const useRefreshToken = () => {
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      // Gọi API refresh token và lưu vào cookies
      const refreshResponse = await axios.post('/api/refresh-token', {
        refreshToken: cookies.get(REFRESH_TOKEN),
      });
      const { accessToken, refreshToken } = refreshResponse.data;

      // Nếu có accessToken mới, cập nhật vào cookies 
      if (accessToken) {
        cookies.set(ACCESS_TOKEN, accessToken, { path: '/' });
        if (refreshToken) {
          cookies.set(REFRESH_TOKEN, refreshToken, { path: '/' });
        }
        // Cập nhật Axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return accessToken;
      }
    } catch (error) {
      // Nếu refresh token thất bại, xử lý logout hoặc điều hướng
      console.error('Error during refresh token:', error);
      // Logout user or redirect
      router.push('/login'); // redirect to login page
      return null;
    }
  }, [router]);

  return refresh;
};

export default useRefreshToken;


// import { http } from '@/assets/helpers';
// import useAuth from './useAuth';

// const useRefreshToken = () => {
//     const { setAuth } = useAuth();

//     const refresh = async () => {
//         const response = await http.http.get('/refresh', {
//             withCredentials: true
//         });
//         setAuth(prev => {
//             console.log(JSON.stringify(prev));
//             console.log(response.data.accessToken);
//             return { ...prev, accessToken: response.data.accessToken }
//         });
//         return response.data.accessToken;
//     }
//     return refresh;
// };

// export default useRefreshToken;
