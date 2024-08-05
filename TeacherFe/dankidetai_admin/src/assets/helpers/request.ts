import { MetaType, ResponseType } from '@/assets/types/request';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import _, { isArray } from "lodash";
import API from '../configs/api';
import * as cookies from "./cookies"
import { ACCESS_TOKEN } from '../configs/request';
import { redirect, useRouter } from 'next/navigation'
import { NextResponse } from 'next/server';
import { trimObjectProperties } from './string';

export const request = axios.create({
    baseURL: API.base,
    headers: {
        //accept: 'text/plain',
        'Content-Type': 'application/json',
    },
});

request.interceptors.request.use(
    (config) => {
        const token = cookies.get(ACCESS_TOKEN);
        if (!config.headers.Authorization) {
            config.headers.Authorization = '';
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        else {
            throw new Error("You need login!")
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

request.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: any) => {
        console.log(error)
        if (error.response.data.code === 9992) {

            const token = cookies.get(ACCESS_TOKEN);
            const req = await axios.post(API.base + API.auth.refresh, {
                token: token
            })
            console.log("zo trong get du lieu moi", req)
            return
        }
        throw new Error(error.response.data.message)
        // return Promise.reject(error);
    },
);


const get = <T = any>(path: string, configs?: AxiosRequestConfig): Promise<AxiosResponse<ResponseType<T>, any>> => {
    const response = request.get(path, configs);
    return response;
};


const post = <T = any>(
    path: string,
    data: any,
    configs?: AxiosRequestConfig,
): Promise<AxiosResponse<T, any>> => {
    const response = request.post(path, data, configs);
    return response;
};

const update = <T = any>(
    path: string,
    data: any,
    configs?: AxiosRequestConfig,
): Promise<AxiosResponse<T, any>> => {
    const response = request.put(path, data, configs);

    return response;
};

const remove = (path: string, configs?: AxiosRequestConfig) => {
    const response = request.delete(path, configs);

    return response;
};
const defaultMeta: MetaType = {
    currentPage: 1,
    hasNextPage: false,
    hasPreviousPage: false,
    messages: [],
    limit: 10,
    totalCount: 1,
    totalPages: 1,

};
const ROW_PER_PAGE = [10, 20, 30]
export { get, post, remove, update, defaultMeta, ROW_PER_PAGE };
