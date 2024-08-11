

import { ACCESS_TOKEN, REFRESH_TOKEN} from '@/assets/config';
import { MenuItemType } from '@/assets/types/menu';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { OptionsType } from 'cookies-next/lib/types';
import { jwtDecode } from 'jwt-decode';

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
    remove(REFRESH_TOKEN);
    remove(ACCESS_TOKEN);
};
const isTokenExpired = (token: string | undefined) => {
    if (!token) return true;
    try {
        const decodedToken: any = jwtDecode(token);
        return decodedToken.exp < Date.now() / 1000;
    } catch (error) {
        return true;
    }
};
const checkPermission = (permission: string, permissions: string[]): boolean => {
    if (!permissions || !permissions.includes(permission)) {
        return false;
    }

    return true;
};

const checkChildPermission = (item: MenuItemType, permissions: string[]): boolean => {
    if (item.items && item.items.length > 0) {
        return item.items.some((t:any) => permissions?.includes(t.permission || '') || typeof t.permission === 'undefined');
    }

    return false;
};

export { checkChildPermission, checkPermission, get, logOut, remove, set,isTokenExpired };
