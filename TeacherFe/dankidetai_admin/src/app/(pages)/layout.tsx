"use client"
import { ACCESS_TOKEN, ROLE_USER } from "@/assets/configs/request";
import ROUTER from "@/assets/configs/routers";
import { cookies } from "@/assets/helpers";
import Header from "@/resources/components/layout/header";
import Sidebar from "@/resources/components/layout/sidebar";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const Layout = ({ children }:
    {
        children: ReactNode
    }) => {
    const router = useRouter()
    useEffect(() => {
        // if (!cookies.get(ACCESS_TOKEN) || !localStorage.getItem(ROLE_USER)) {
        if (!cookies.get(ACCESS_TOKEN)) {
            router.push(ROUTER.auth.login)
        }
    }, [])
    return (
        <div>
            <div className='min-h-screen surface-100 overflow-hidden m-0'>
                <div >
                    <Header />
                    <div className='flex p-3 w-100 overflow-auto' style={{ marginTop: '4rem' }}>
                        <Sidebar />
                        <div className='' style={{ width: "80vw", marginLeft: "1rem" }}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
