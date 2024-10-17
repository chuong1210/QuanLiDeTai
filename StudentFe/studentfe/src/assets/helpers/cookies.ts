

import { ACCESS_TOKEN, API, REFRESH_TOKEN } from '@/assets/config';
import { MenuItemType } from '@/assets/types/menu';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { OptionsType } from 'cookies-next/lib/types';
import { jwtDecode } from 'jwt-decode';
import { http } from './httpRequest';
import { cookies } from '.';

import { NextRequest, NextResponse } from 'next/server';

const get = <T>(key: string): T | undefined => {
    const value = getCookie(key);
    console.log(`Getting cookie: ${key}, Value: ${value}`);
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
const logOut = async () => {
    try {
      const response = await http.post('/api/logout', {
        token: getCookie(REFRESH_TOKEN),
      });
  
      if (response.status === 200) {
        remove(REFRESH_TOKEN);
        remove(ACCESS_TOKEN);
        console.log('Logout successful');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
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

 const getClientSideCookie = (name: string): string | undefined => {
    const cookieValue = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${name}=`))
        ?.split('=')[1];

   return cookieValue;
};
const checkPermission = (permission: string, permissions: string[]): boolean => {
    if (!permissions || !permissions.includes(permission)) {
        return false;
    }

    return true;
};

const checkChildPermission = (item: MenuItemType, permissions: string[]): boolean => {
    if (item.items && item.items.length > 0) {
        return item.items.some((t: any) => permissions?.includes(t.permission || '') || typeof t.permission === 'undefined');
    }

    return false;
};

export { checkChildPermission, checkPermission, get, logOut, remove, set, isTokenExpired,getClientSideCookie };
