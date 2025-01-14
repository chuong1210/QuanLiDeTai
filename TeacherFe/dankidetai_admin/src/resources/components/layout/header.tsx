"use client"
import HEADER_MENU from '@/assets/configs/header_menu'
import { OverlayPanel } from 'primereact/overlaypanel'
import React, { useEffect, useRef, useState } from 'react'
import MenuItem from '../UI/MenuItem'
import { cookies } from '@/assets/helpers'
import { MenuItemType } from '@/assets/types/menu'
import brand from "@/resources/image/huit/brand.png"
import Image from 'next/image'
import { INFO_USER } from '@/assets/configs/request'
import { useRouter, usePathname } from 'next/navigation'
import ROUTER from '@/assets/configs/routers'
import { Button } from 'primereact/button'
import Link from 'next/link'
import { BreadCrumb } from 'primereact/breadcrumb'
import { isUUID } from '@/assets/helpers/string'
// import Image from 'next/image'
export default function Header({ onClick }: { onClick: () => void }) {
    const userModalRef = useRef<OverlayPanel>(null);
    const router = useRouter();
    const currentPath = usePathname();
    const pathSegments = currentPath.split('/').filter(Boolean);

    const [info, setInfo] = useState<UserLoginType | null>(null)
    useEffect(() => {
        const jinfo = localStorage.getItem(INFO_USER)
        if (jinfo === null) {
            return router.push(ROUTER.auth.login);
        }
        const info: UserLoginType = JSON.parse(jinfo)
        setInfo(info)
    }, [])
    const logOut = (item: MenuItemType) => {
        if (item.code === "logout") cookies.logOut()
    }

    const items = pathSegments.map((segment, index) => {

        if (index === pathSegments.length - 1) {
            // Nếu là phần tử cuối cùng
            if (isUUID(segment)) {
                return {
                    label: segment,
                    template: () => <Link href={currentPath}><span className="text-primary font-semibold">{segment}</span></Link>
                }
            }
            return {
                label: segment,
                template: () => <Link href={currentPath}><span className="text-primary font-semibold">{segment}</span></Link>

            };
        }
        // Các phần tử khác
        return { label: segment };
    });
    const home = { icon: 'pi pi-home', url: ROUTER.home };

    return (
        <div
            className='w-100 flex align-items-center justify-content-between  h-4rem shadow-2 bg-white pr-5 fixed top-0 left-0 right-0'
            style={{ zIndex: 500 }}
        >
            <div className='flex align-items-center'>
                <Image src={brand} alt='' width={244} height={60} priority={true} className='mr-4' />
                <div className='flex align-items-center' style={{ marginLeft: "16px" }}>
                    <Button
                        className="btn-bars-top-menu"
                        icon="pi pi-bars layout-topbar-button"
                        rounded
                        text
                        aria-label="Cancel"
                        onClick={onClick}
                        type="button"
                    />
                    <BreadCrumb model={items} home={home} />

                    {/* <span className="ml-4 font-semibold path-name">{currentPath}</span> */}
                </div>
            </div>

            <div style={{ cursor: "pointer" }} onClick={(e) => userModalRef?.current?.toggle(e)}>
                <span className="pi pi-user bg-primary p-2 border-circle"></span>
                <span> {info?.teacher?.name}</span>
            </div>
            <OverlayPanel ref={userModalRef} className='p-0'>
                <ul>
                    {HEADER_MENU.USER_MENU().map(item => <MenuItem key={item.code} item={{ ...item, onItemClick: logOut }} />)}
                </ul>
            </OverlayPanel>
        </div>
    )
}
