import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { OptionsType } from 'cookies-next/lib/types';
import { ACCESS_TOKEN, ROLE_USER } from '../configs/request';
import { request } from './request';
import API from '../configs/api';
import axios from 'axios';

const get = <T>(key: string): T | undefined => {
    const value = getCookie(key);

    if (!value) {
        return undefined;
    }
    try {
        return JSON.parse(value) as T;
    } catch (e) {
        return JSON.parse(JSON.stringify(value));
    }
};

const set = (key: string, value: any, options?: OptionsType) => {
    if (typeof value === 'string') {
        setCookie(key, value, options);
    } else {
        setCookie(key, JSON.stringify(value), options);
    }
};

const remove = (key: string) => {
    deleteCookie(key);
};

const logOut = () => {
    const token = getCookie(ACCESS_TOKEN);
    axios.post("http://localhost:8888/auth/log-out", {
        token: token
    })
    remove(ACCESS_TOKEN);
    remove(ROLE_USER);
    localStorage.clear()
};

export { get, logOut, remove, set };
