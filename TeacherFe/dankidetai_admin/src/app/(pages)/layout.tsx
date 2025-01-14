"use client"
import { ACCESS_TOKEN, ROLE_USER } from "@/assets/configs/request";
import ROUTER from "@/assets/configs/routers";
import { cookies } from "@/assets/helpers";
import Header from "@/resources/components/layout/header";
import Sidebar from "@/resources/components/layout/sidebar";
import { useRouter } from "next/navigation";
import { classNames } from "primereact/utils";
import { CSSProperties, ReactNode, useEffect, useState } from "react";

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
    const [stateLayout, setStateLayout] = useState(false);
    const HandleStateLayout = (state: boolean) => {
        setStateLayout(state)
    }
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    const sidebarStyle: CSSProperties = {
        position: 'fixed',
        left: isSidebarVisible ? '0' : '-300px',
        top: '90px',
        transition: 'left 0.3s ease',
        // marginRight: "2rem"
    };

    const mainContentStyle: CSSProperties = {
        marginLeft: isSidebarVisible ? '250px' : '0',
        padding: '20px',
        width: isSidebarVisible ? 'calc(100% - 250px)' : '100%',
        transition: 'margin-left 0.3s ease, width 0.3s ease',
        // backgroundColor: '#2c3e50',
        paddingLeft: isSidebarVisible ? "4rem" : "2rem",
    };

    return (
        <div>
            <div className='min-h-screen surface-100 overflow-hidden m-0'>
                <div >
                    <Header onClick={toggleSidebar} />
                    <div className='flex p-3 w-100' style={{ marginTop: '4rem', display: 'flex' }}>
                        <div style={sidebarStyle}>
                            <Sidebar />
                        </div>
                        <div style={{ marginLeft: "1rem", flex: 1, ...mainContentStyle }}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
