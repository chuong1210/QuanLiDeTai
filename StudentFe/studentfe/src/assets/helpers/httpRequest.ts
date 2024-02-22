import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ROUTES } from '../config/routes';
import { ResponseType } from '../types/httpRequest';
import { AUTH_RAW_TOKEN, AUTH_TOKEN } from '../config';
import { cookies } from '.';
import { AuthType } from '../interface/AuthType.type';
const baseUrl = ROUTES.base;
class Http {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create({
      baseURL: baseUrl,
      // timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

// eslint-disable-next-line react-hooks/rules-of-hooks



const http = new Http().instance

http.interceptors.request.use(
  (config) => {
      while (true) {
          const token = cookies.get(AUTH_RAW_TOKEN);
          const auth = cookies.get<AuthType>(AUTH_TOKEN);

          if (!config.headers.Authorization) {
              config.headers.Authorization = '';
          }

          if (token) {
              config.headers.Authorization = `Bearer ${token}`;
          }

          if (!auth) {
              break;
          }

          if (!config.data && (config.method === 'put' || config.method === 'post' || config.method === 'delete')) {
              config.data = {};
          }

          if (!config.params && config.method === 'get') {
              config.params = {};
          }

          if (config.params && config.params.removeFacultyId) {
              delete config.params.removeFacultyId;

              break;
          }

          if (config.method === 'get') {
              // config.params.facultyId = auth?.faculty?.Id;
          }

          if (config.method === 'put' || config.method === 'post' || config.method === 'delete') {
              // config.data.facultyId = auth?.faculty.Id;
          }

          break;
      }

      return config;
  },
  (error) => {
      return Promise.reject(error);
  },
);

const responseIntercept = http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    if (error?.response?.status === 401 && !originalRequest?.retry) {
      originalRequest.retry = true;
      try {
        // Refresh token and get a new access token
        
        // Retry the original request with the new access token
        const newAccessToken = cookies.get(AUTH_RAW_TOKEN);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return http(originalRequest);
      } catch (refreshError) {
        // If refreshing token fails, redirect to login or handle accordingly
        console.error("Error refreshing token:", refreshError);
        // Redirect to login or handle the error as needed
        // Example: router.push('/login');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
      return response;
      // return response && response.data?response.data:response;
  },
  (error: AxiosError) => {
      return Promise.reject(error);
  },
);
const get = <T = any>(path: string, configs?: AxiosRequestConfig): Promise<AxiosResponse<ResponseType<T>, any>> => {
  const response = http.get(path, configs);

  return response;
};
const post = <T = any>(
  path: string,
  data: any,
  configs?: AxiosRequestConfig,
  // customHeaders?: Record<string, string>, // tự thêm

): Promise<AxiosResponse<ResponseType<T>, any>> => {


  // const defaultHeaders = {
  //   'Content-Type': 'application/json',
  //   // Thêm các header mặc định khác nếu cần
  // };

  // const headers = { ...defaultHeaders, ...customHeaders };

  // const response = http.post(path, data, { headers, ...configs });
   const response = http.post(path, data, configs);

  return response;
};
export {post,http,get}