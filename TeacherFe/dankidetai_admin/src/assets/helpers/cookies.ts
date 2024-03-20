import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { OptionsType } from 'cookies-next/lib/types';
import { ACCESS_TOKEN } from '../configs/request';

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
    remove(ACCESS_TOKEN);
    // remove(AUTH_TOKEN);
};

export { get, logOut, remove, set };
