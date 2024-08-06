import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../config';
import { cookies } from '../helpers';

interface RefreshTokenResponse {
  result: {
    accessToken: string;
    refreshToken?: string;
  };
}

const refreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await axios.post<RefreshTokenResponse>('/api/refresh-token', {
    token: cookies.get(REFRESH_TOKEN),
  });
  return response.data;
};

const useRefreshToken = () => {
  const router = useRouter();

  const mutation = useMutation<RefreshTokenResponse, Error, void>({
    mutationFn: refreshToken,
    onSuccess: (data:RefreshTokenResponse) => {
      const { accessToken, refreshToken } = data.result;
      if (accessToken) {
        cookies.set(ACCESS_TOKEN, accessToken, { path: '/' });
        if (refreshToken) {
          cookies.set(REFRESH_TOKEN, refreshToken, { path: '/' });
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      }
    },
    onError: () => {
      router.push('/login');
    },
  });

  return mutation.mutateAsync;
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
