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
        if (!cookies.get(ACCESS_TOKEN) || !localStorage.getItem(ROLE_USER)) {
            if (!cookies.get(ACCESS_TOKEN)) {
                localStorage.clear();
                router.push(ROUTER.auth.login)
            }
        }
    }, [])
    return (
        <div>
            <div className='min-h-screen surface-100 overflow-hidden m-0'>
                <div >
                    <Header />
                    <div className='flex p-3 w-100' style={{ marginTop: '4rem', display: 'flex' }}>
                        <Sidebar />
                        <div style={{ marginLeft: "1rem", flex: 1 }}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
