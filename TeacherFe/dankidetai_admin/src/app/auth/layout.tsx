"use client"
import { ACCESS_TOKEN } from '@/assets/configs/request';
import { PageProps } from '@/assets/types/UI';
import * as cookies from "@/assets/helpers/cookies"
import ROUTER from '@/assets/configs/routers';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
const AuthLayout = ({ children }: PageProps) => {
    const router = useRouter();
    function checkAuth() {
        const token = cookies.get(ACCESS_TOKEN);
        if (token) {
            return router.push(ROUTER.home)
        }
    }
    useEffect(() => {
        checkAuth()
    }, [])
    return (
        <body className='h-screen relative p-4 sm:p-4 md:p-6 lg:px-8 lg:h-screen xl:h-screen surface-300 m-0'>
            {children}
        </body>
    );
};

export default AuthLayout;
