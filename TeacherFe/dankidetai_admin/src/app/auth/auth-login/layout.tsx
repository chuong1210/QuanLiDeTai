"use client"
import { ACCESS_TOKEN } from '@/assets/configs/request';
import { PageProps } from '@/assets/types/UI';
import * as cookies from "@/assets/helpers/cookies"
import { useEffect } from 'react';
const AuthLayout = ({ children }: PageProps) => {
    function checkAuth() {
        const token = cookies.get(ACCESS_TOKEN);
        if (token) {
            cookies.logOut()
        }
    }
    useEffect(() => {
        checkAuth()
    }, [])
    return (
        <div className='h-screen relative p-4 sm:p-4 md:p-6 lg:px-8 lg:h-screen xl:h-screen surface-300 m-0'>
            {children}
        </div>
    );
};

export default AuthLayout;
