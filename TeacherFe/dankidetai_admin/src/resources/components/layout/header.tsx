"use client"
import HEADER_MENU from '@/assets/configs/header_menu'
import { OverlayPanel } from 'primereact/overlaypanel'
import React, { useRef } from 'react'
import MenuItem from '../UI/MenuItem'
import { cookies } from '@/assets/helpers'
import { MenuItemType } from '@/assets/types/menu'
import brand from "@/resources/image/huit/brand.png"
import Image from 'next/image'
// import Image from 'next/image'
export default function Header() {
    const userModalRef = useRef<OverlayPanel>(null);
    const logOut = (item: MenuItemType) => {
        if (item.code === "logout") cookies.logOut()
    }
    return (
        <div
            className='w-100 flex align-items-center justify-content-between  h-4rem shadow-2 bg-white pr-5 fixed top-0 left-0 right-0'
            style={{ zIndex: 500 }}
        >
            <Image src={brand} alt='' width={244} height={60} priority={true} />
            <div style={{ cursor: "pointer" }} onClick={(e) => userModalRef?.current?.toggle(e)}>
                <span className="pi pi-user bg-primary p-2 border-circle"></span>
                <span>Trần Vinh Hiển</span>
            </div>
            <OverlayPanel ref={userModalRef} className='p-0'>
                <ul>
                    {HEADER_MENU().map(item => <MenuItem key={item.code} item={{ ...item, onItemClick: logOut }} />)}
                </ul>
            </OverlayPanel>
        </div>
    )
}
