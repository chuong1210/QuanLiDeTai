import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ROUTES } from '../config/routes';
import { ResponseType } from '../types/httpRequest';
import { AUTH_RAW_TOKEN, AUTH_TOKEN } from '../config';
import { cookies } from '.';
import { AuthType } from '../interface/AuthType.type';
const baseUrl = ROUTES.base;
console.log(baseUrl);
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
              config.params.facultyId = auth?.faculty?.Id;
          }

          if (config.method === 'put' || config.method === 'post' || config.method === 'delete') {
              config.data.facultyId = auth?.faculty.Id;
          }

          break;
      }

      return config;
  },
  (error) => {
      return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => {
      return response;
  },
  (error: AxiosError) => {
      return Promise.reject(error);
  },
);
const post = <T = any>(
  path: string,
  data: any,
  configs?: AxiosRequestConfig,
): Promise<AxiosResponse<ResponseType<T>, any>> => {
  const response = http.post(path, data, configs);

  return response;
};
export {post}