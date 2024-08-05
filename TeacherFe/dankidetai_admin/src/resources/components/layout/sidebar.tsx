"use client"
import React, { useEffect, useState } from 'react'
import MenuItem from '../UI/MenuItem'
import Image from 'next/image'
import LogoImage from "@/resources/image/huit/logo.png"
import { SIDEBAR_MENU } from '@/assets/configs/sidebar_menu'
import { roleE } from '@/assets/configs/general'
import { cookies } from '@/assets/helpers'
import { ROLE_USER } from '@/assets/configs/request'

export default function Sidebar() {
    const [roles, setRoles] = useState<roleE[]>()
    useEffect(() => {
        const loadComponent = async () => {
            setRoles(cookies.get<roleE[]>(ROLE_USER));
        };
        loadComponent();
    }, [])
    return (
        <div
            className='relative' style={{ zIndex: 100, minWidth: "20vw" }}
        >
            <div className='fixed flex flex-column gap-2  bg-white h-screen  shadow-2 p-4' style={{ zIndex: 100, minWidth: "20vw" }}>
                {/* <i className="pi pi-align-justify absolute top-0 " style={{ zIndex: 10000, right: "-2.5rem", color: '#708090', fontSize: "2.5rem" }}></i> */}
                <div className='flex justify-content-center'>
                    <Image src={LogoImage} alt='' width={100} height={100} priority={true} />
                </div>
                <h2 className='text-center'>Giảng viên</h2>
                <ul className='p-2 overflow-y-auto h-full'>
                    {SIDEBAR_MENU.map((item) => <MenuItem key={item.code} item={item} checkPermission={roles} />)}
                </ul>
            </div>
        </div>
    )
}
