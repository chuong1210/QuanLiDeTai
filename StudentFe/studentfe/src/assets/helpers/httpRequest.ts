import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ROUTES } from '../config/routes';
import { MetaResponseType, MetaType, ParamType, ResponseType } from '../types/httpRequest';
import { REFRESH_TOKEN, ACCESS_TOKEN, API } from '../config';
import { cookies } from '.';
import { AuthType, AuthTypeLogin } from '../interface/AuthType.type';
import { OptionType } from '../types/common';
import _ from 'lodash';

import { refreshTokenApi } from '../config/apiRequests/StudentApiMutation';
import UseRefreshToken from '../useHooks/useRefreshToken';
import { AuthTypeRefreshToken } from '@/assets/interface';
import refreshToken from '../useHooks/useRefreshToken';
const baseUrl = ROUTES.base;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
let refreshPromise: Promise<string | null> | null = null;
class Http {
  instance: AxiosInstance
  constructor() {
    
    this.instance = axios.create({
  withCredentials :true,

      baseURL: baseUrl,
      // timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}




const http = new Http().instance
const abc= new Http().instance
http.interceptors.request.use(
  (config) => {
    const accessToken = cookies.get(ACCESS_TOKEN);
    const refreshToken = cookies.get(REFRESH_TOKEN);
    // if (!!accessToken && cookies.isTokenExpired(JSON.stringify(accessToken))) {
        
    //   cookies.logOut();


    //   }

    if(!isRefreshing)
    {
      if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
 
   

    // Additional checks if needed
    if (!config.data && ['put', 'post', 'delete'].includes(config.method ?? "")) {
      config.data = {};
    }
    
    if (config.params && config.params.removeFacultyId) {
      delete config.params.removeFacultyId;
    }
    console.log('Config before request (http):', config);

    return config;
  },
  (error) => Promise.reject(error)
);

const refreshTokenMeth=async (data:string) : Promise<ResponseType<AuthTypeLogin> | null>=>
{

  const refreshTokenRes = await http.post(`${API.auth.refresh}`, {
    token: data,
  },{
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json'
    }
});

return  refreshTokenRes.data;

}


// Response Interceptor
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for 401 error
    if (error.response && error.response.status === 401) {
    
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = new Promise(async (resolve, reject) => {
          try {
            const oldToken: AuthTypeRefreshToken = {
              token: cookies.get(REFRESH_TOKEN),
            };
            const responseRefresh: AxiosResponse<ResponseType<AuthTypeLogin>> = await http.post(`${API.auth.refresh}`, {
              token: oldToken.token ?? '',
             }
          ,{
              headers: {
                  // Authorization:`Bearer ${accessToken}`//  có là lỗi
              }
          }
          ) 
            const newAccessToken = responseRefresh.data.result?.accessToken;

            if (newAccessToken) {
              await cookies.set(REFRESH_TOKEN, newAccessToken);

              resolve(newAccessToken);
            } else {
              reject(error);
            }
          } catch (refreshError) {
            reject(refreshError);
          } finally {
            isRefreshing = false;
            refreshPromise = null;
          }
        });
      }



// Trong interceptor response:
if (refreshPromise) {
  return refreshPromise.then((newAccessToken) => {
    if (newAccessToken) {
      originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
      return http(originalRequest);
    }
    return Promise.reject(error);
  });
} else {
  return Promise.reject(error);
}
  }
}
);

//tu them
//http.defaults.headers.common.Authorization =cookies.get(ACCESS_TOKEN);


//



const get = <T = any>(path: string, configs?: AxiosRequestConfig): Promise<AxiosResponse<ResponseType<T>, any>> => {
  const response = http.get(path, configs);

  return response;
};

const getPaginator = <T = any>(path: string, configs?: AxiosRequestConfig): Promise<AxiosResponse<ResponseType<MetaResponseType<T>>, any>> => {
  const response = http.get(path, configs);

  return response;
};
const post = <T = any>(
  path: string,
  data: any,
  configs?: AxiosRequestConfig,
  // customHeaders?: Record<string, string>, // tự thêm

): Promise<AxiosResponse<ResponseType<T>, any>> => {


   const response = http.post(path, data, configs);

  return response;
};

const update = <T = any>(
  path: string,
  data: any,
  configs?: AxiosRequestConfig,
): Promise<AxiosResponse<ResponseType<T>, any>> => {
  const response = http.put(path, data, configs);

  return response;
};

const remove = <T = any>(
  path: string,
  data: any,
  configs?: AxiosRequestConfig,
): Promise<AxiosResponse<ResponseType<T>, any>> => {
  const response = http.delete(path, { ...configs, data });

  return response;
};
const handleSort = (sorts: OptionType | undefined, params: ParamType): string => {
  let result = params.sorts || '';

  if (!sorts) {
      return result;
  }

  const resultSplit = _.split(result, ',').filter((t) => t !== '');


  const keyIndex = resultSplit.findIndex((t) => t.includes(sorts.name || '...'));

  const symbol = sorts.value === 1 ? '' : '-';
  const newValue = `${symbol}${sorts.name}`;

  if (keyIndex !== -1) {
      resultSplit[keyIndex] = newValue;
  } else {
      resultSplit.push(newValue);
  }


  result = _.join(resultSplit, ',');


  return result;
};

const handleFilter = (
  original: string | undefined,
  field: string,
  operator: '>' | '@=' | '==',
  value: string | number | undefined,
) => {
  let filters = original?.split(', ') || [];

  filters = filters.filter((t) => t != '');
  let index = filters.findIndex((t) => t.includes(field + operator));

  if (filters.length > 0 && index > -1) {
      filters.splice(index, 1);
  }

  if (value) {
      filters.push(field + operator + value);
  }

  return filters.join(', ') || '';
};
const currentPage = (page: number | undefined) => {
  return page ? page - 1 : 0;
};
export {post,http,get,getPaginator,update,remove,handleFilter,handleSort,currentPage}